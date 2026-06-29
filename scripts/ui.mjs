#!/usr/bin/env node
// Tiny local server for the visual post editor.
//   - serves the editor page (ui/index.html)
//   - serves /brand.js so the editor reads the SAME brand tokens/logo/scrims as
//     the render (src/brand.config.mjs is the single source of truth)
//   - POST /render takes the form values + dropped image and returns the REAL
//     1080x1350 PNG from the same Remotion composition the skills use (no drift)
//
// Bound to localhost only (not the LAN). Start with:  npm run ui
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { getServeUrl, renderPostStill } from "./lib/render.mjs";
import { BRAND, CHAPTER, brandSlug } from "../src/brand.config.mjs";

loadEnv();

const HOST = process.env.UI_HOST || "127.0.0.1"; // localhost only by default
const START_PORT = Number(process.env.UI_PORT || 4321);
const uiDir = path.join(repoRoot, "ui");
const outDir = path.join(repoRoot, "out");
fs.mkdirSync(outDir, { recursive: true });

// Serialize renders: ONE headless-Chrome render at a time. A burst of /render
// calls (a carousel, or a flood) then queues instead of spawning N parallel
// Chrome instances that would swap/wedge a low-RAM machine (the 8GB M1 target).
let renderChain = Promise.resolve();
function renderQueue(task) {
  const result = renderChain.then(task);
  renderChain = result.then(() => {}, () => {});
  return result;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

// The brand payload the browser editor reads (mirror of the render side).
const BRAND_JS =
  "window.BRAND_CFG = " +
  JSON.stringify({
    colors: BRAND.colors,
    fonts: BRAND.fonts,
    sizing: BRAND.sizing,
    scrims: BRAND.scrims,
    logoPath: BRAND.logoPath,
    chapter: { handle: CHAPTER.handle, label: CHAPTER.label },
    zipName: "carrossel-" + brandSlug(CHAPTER.label) + ".zip",
  }) +
  ";";

function sendFile(res, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

function readBody(req, limitBytes = 30 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let aborted = false;
    const chunks = [];
    req.on("data", (c) => {
      if (aborted) return;
      size += c.length;
      if (size > limitBytes) {
        // Stop buffering, but do NOT destroy the socket here: that would reset
        // the connection before we can send the friendly message. Reject with a
        // 413 marker and let the handler write a real response.
        aborted = true;
        chunks.length = 0;
        reject(Object.assign(new Error("Imagem grande demais (o limite e ~22MB de foto). Use uma imagem menor."), { statusCode: 413 }));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => { if (!aborted) resolve(Buffer.concat(chunks)); });
    req.on("error", reject);
  });
}

// The editor only ever sends a raster data:image/* URL. Reject anything else so
// the LAN/SSRF surface is closed even if someone calls /render directly. SVG is
// excluded on purpose: an SVG rendered by headless Chrome can fetch external
// resources (a fresh SSRF vector), and the editor never produces one.
const DATA_IMAGE = /^data:image\/(png|jpe?g|webp|gif|avif);/i;
function validateProps(props) {
  if (!props || typeof props !== "object") return "Props ausentes.";
  if (!props.heroImage) return "Solte ou escolha uma imagem de fundo primeiro.";
  if (!DATA_IMAGE.test(String(props.heroImage))) {
    return "Imagem invalida. O editor aceita uma foto (PNG, JPG, WEBP), nao um link.";
  }
  return null;
}

// Coerce the numeric/enum fields to safe ranges before they reach Remotion.
function sanitizeProps(props) {
  const n = (v, d, lo, hi) => {
    const x = Number(v);
    if (!Number.isFinite(x)) return d;
    return Math.min(hi, Math.max(lo, x));
  };
  return {
    ...props,
    layout: props.layout === "content" ? "content" : "cover",
    heroFocusX: n(props.heroFocusX, 0.5, 0, 1),
    heroFocusY: n(props.heroFocusY, 0.5, 0, 1),
    heroZoom: n(props.heroZoom, 1, 1, 4),
    darken: n(props.darken, 0, 0, 1),
    headlineSize: n(props.headlineSize, 0, 0, 400),
    bodySize: n(props.bodySize, 0, 0, 200),
    showCarouselArrow: Boolean(props.showCarouselArrow),
  };
}

function handler(server) {
  return async (req, res) => {
    try {
      if (req.method === "POST" && req.url === "/render") {
        const body = await readBody(req);
        let parsed;
        try {
          parsed = JSON.parse(body.toString("utf8"));
        } catch {
          return sendJson(res, 400, { error: "Nao consegui ler os dados do post. Tente de novo." });
        }
        const props = parsed && parsed.props;
        const bad = validateProps(props);
        if (bad) return sendJson(res, 400, { error: bad });

        const outFile = path.join(outDir, `post-ui-${Date.now()}.png`);
        await renderQueue(() => renderPostStill(sanitizeProps(props), outFile));
        const png = await fs.promises.readFile(outFile); // async: do not block the loop
        fs.promises.unlink(outFile).catch(() => {}); // ephemeral: the bytes go in the response
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Disposition": 'attachment; filename="post.png"',
        });
        res.end(png);
        return;
      }

      if (req.method === "GET" && (req.url || "").split("?")[0] === "/brand.js") {
        res.writeHead(200, { "Content-Type": MIME[".js"] });
        res.end(BRAND_JS);
        return;
      }

      // Static files from ui/ (real directory-boundary check, no traversal).
      let rel = decodeURIComponent((req.url || "/").split("?")[0]);
      if (rel === "/") rel = "/index.html";
      const file = path.join(uiDir, rel);
      const inside = path.relative(uiDir, file);
      if (inside.startsWith("..") || path.isAbsolute(inside) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404");
        return;
      }
      sendFile(res, file);
    } catch (err) {
      const code = err && err.statusCode ? err.statusCode : 500;
      if (!res.headersSent) sendJson(res, code, { error: String((err && err.message) || err) });
      else res.end();
      if (code === 413) req.destroy(); // safe now: the response was already sent
    }
  };
}

// Try to listen; if the port is taken, step up a few ports with a friendly note.
function listen(port, attemptsLeft) {
  const server = http.createServer();
  server.on("request", handler(server));
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.log(`  porta ${port} ocupada, tentando ${port + 1}...`);
      setTimeout(() => listen(port + 1, attemptsLeft - 1), 50);
      return;
    }
    if (err.code === "EADDRINUSE") {
      console.error(`\n  Todas as portas de ${START_PORT} a ${port} estao ocupadas.`);
      console.error(`  Feche o outro editor, ou rode com outra porta:  UI_PORT=4400 npm run ui\n`);
      process.exit(1);
    }
    console.error("  erro ao subir o servidor:", err.message);
    process.exit(1);
  });
  server.listen(port, HOST, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n  Editor de posts do AI Collective`);
    console.log(`  Abra:  ${url}\n`);
    console.log(`  (preparando o motor de render em segundo plano...)`);
    getServeUrl()
      .then(() => console.log("  pronto. pode baixar quando quiser.\n"))
      .catch((e) => console.log("  aviso: bundle falhou, tenta de novo no primeiro download:", e.message));
    // Open the default browser (macOS `open`, Linux `xdg-open`, Windows `start`).
    // Set UI_NO_OPEN=1 to skip (useful for tests / headless / CI).
    if (!process.env.UI_NO_OPEN) {
      const opener =
        process.platform === "darwin" ? "open" : process.platform === "win32" ? "start \"\"" : "xdg-open";
      exec(`${opener} ${url}`, () => {});
    }
  });
}

listen(START_PORT, 12);
