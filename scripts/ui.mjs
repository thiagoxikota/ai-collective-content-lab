#!/usr/bin/env node
// Tiny local server for the visual post editor.
//   - serves the editor page (ui/index.html)
//   - POST /render takes the form values + dropped image and returns the REAL
//     1080x1350 PNG from the same Remotion composition the skills use (no drift)
//
// Start with:  npm run ui   (opens the browser for you)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { getServeUrl, renderPostStill } from "./lib/render.mjs";

loadEnv();

const PORT = Number(process.env.UI_PORT || 4321);
const uiDir = path.join(repoRoot, "ui");
const outDir = path.join(repoRoot, "out");
fs.mkdirSync(outDir, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

function sendFile(res, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

function readBody(req, limitBytes = 30 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limitBytes) {
        reject(new Error("Imagem grande demais (limite 30MB)."));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    // Render endpoint: returns the real Remotion PNG for the given props.
    if (req.method === "POST" && req.url === "/render") {
      const body = await readBody(req);
      const { props } = JSON.parse(body.toString("utf8"));
      if (!props || !props.heroImage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Solte ou escolha uma imagem de fundo primeiro." }));
        return;
      }
      const outFile = path.join(outDir, `post-ui-${Date.now()}.png`);
      await renderPostStill(props, outFile);
      const png = fs.readFileSync(outFile);
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="post.png"',
        "X-Out-File": outFile,
      });
      res.end(png);
      return;
    }

    // Static files from ui/ (no path traversal).
    let rel = decodeURIComponent((req.url || "/").split("?")[0]);
    if (rel === "/") rel = "/index.html";
    const file = path.normalize(path.join(uiDir, rel));
    if (!file.startsWith(uiDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404");
      return;
    }
    sendFile(res, file);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: String(err.message || err) }));
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  Editor de posts do AI Collective`);
  console.log(`  Abra:  ${url}\n`);
  console.log(`  (preparando o motor de render em segundo plano...)`);
  // Warm up the Remotion bundle so the first download is fast.
  getServeUrl()
    .then(() => console.log("  pronto. pode baixar quando quiser.\n"))
    .catch((e) => console.log("  aviso: bundle falhou, tenta de novo no primeiro download:", e.message));
  // Open the browser (macOS `open`, fallback to xdg-open).
  exec(`open ${url} || xdg-open ${url}`, () => {});
});
