#!/usr/bin/env node
// Render a Remotion composition (Reel or Slideshow) to an MP4 in out/.
// This is the parametrized renderer the "criar-video" skill calls.
//
// Usage:
//   node scripts/render-video.mjs                       # Reel from images in assets/generated (or samples)
//   node scripts/render-video.mjs --comp Slideshow
//   node scripts/render-video.mjs --orientation horizontal --seconds 4
//   node scripts/render-video.mjs --images "samples/floripa-sunset.png,samples/floripa-night.png" \
//                                 --captions "Por do sol|Noite na ilha" --title "Floripa"
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";
import { loadEnv, installErrorHandler, repoRoot } from "./lib/env.mjs";
import { assetRelative } from "./lib/util.mjs";
import { BRAND, CHAPTER } from "../src/brand.config.mjs";

installErrorHandler();
loadEnv();

// Images AND video clips (e.g. from the gerar-clip-ia skill) are valid inputs.
const MEDIA_EXT = /\.(png|jpe?g|webp|mp4|mov|webm|m4v)$/i;
const assetsDir = path.join(repoRoot, "assets");

const { values } = parseArgs({
  options: {
    comp: { type: "string" }, // Reel (default) | Slideshow
    images: { type: "string" }, // comma list (assets-relative or file paths)
    captions: { type: "string" }, // pipe-separated, one per image
    title: { type: "string" },
    brand: { type: "string" },
    orientation: { type: "string" }, // vertical (default) | horizontal | square
    seconds: { type: "string" }, // seconds per image (default 3)
    accent: { type: "string" }, // hex color
    fps: { type: "string" },
    concurrency: { type: "string" },
    out: { type: "string" },
  },
});

// Resolve one image argument to a path relative to assets/ for staticFile().
function toAssetRelative(token) {
  const t = token.trim();
  if (!t) return null;
  // If it points at a real file on disk, convert to an assets-relative path.
  const candidates = [t, path.join(repoRoot, t), path.join(assetsDir, t)];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return assetRelative(path.resolve(c));
  }
  // Otherwise assume it is already an assets-relative path (e.g. "samples/x.png").
  return t.split(path.sep).join("/");
}

// Default image set: everything in assets/generated, else the bundled samples.
function defaultImages() {
  const gen = path.join(assetsDir, "generated");
  const fromGen = fs.existsSync(gen)
    ? fs.readdirSync(gen).filter((f) => MEDIA_EXT.test(f)).sort().map((f) => `generated/${f}`)
    : [];
  if (fromGen.length > 0) return fromGen;
  const samples = path.join(assetsDir, "samples");
  return fs.existsSync(samples)
    ? fs.readdirSync(samples).filter((f) => MEDIA_EXT.test(f)).sort().map((f) => `samples/${f}`)
    : [];
}

const compId = values.comp || "Reel";
const images = values.images
  ? values.images.split(",").map(toAssetRelative).filter(Boolean)
  : defaultImages();

if (images.length === 0) {
  console.error("Nenhuma imagem encontrada. Gere uma com a skill gerar-imagem ou passe --images.");
  process.exit(1);
}

const captions = values.captions ? values.captions.split("|").map((c) => c.trim()) : [];

// Clamp seconds-per-image to a sane 1..15 (a typo like --seconds 99999 would
// otherwise queue an hours-long render; NaN would crash the duration math).
let secondsPerImage = Number(values.seconds);
if (!Number.isFinite(secondsPerImage)) secondsPerImage = 3;
if (secondsPerImage < 1 || secondsPerImage > 15) {
  console.log(`  aviso: --seconds ${values.seconds} fora de 1..15, ajustando para o limite.`);
  secondsPerImage = Math.min(15, Math.max(1, secondsPerImage));
}

const ORIENTATIONS = ["vertical", "horizontal", "square"];
const orientation = ORIENTATIONS.includes(values.orientation) ? values.orientation : "vertical";

const inputProps = {
  images,
  captions,
  title: values.title ?? "",
  brand: values.brand ?? CHAPTER.label,
  orientation,
  secondsPerImage,
  accentColor: values.accent || BRAND.colors.accent,
};

const outDir = path.join(repoRoot, "out");
fs.mkdirSync(outDir, { recursive: true });
const outFile = values.out
  ? path.resolve(values.out)
  : path.join(outDir, `${compId.toLowerCase()}-${Date.now()}.mp4`);

console.log(`\nRenderizando ${compId} (${inputProps.orientation})...`);
console.log(`  imagens: ${images.length}  ->  ${images.join(", ")}`);

await ensureBrowser();

const serveUrl = await bundle({
  entryPoint: path.join(repoRoot, "src", "index.ts"),
  publicDir: assetsDir,
});

const composition = await selectComposition({
  serveUrl,
  id: compId,
  inputProps,
});

await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: outFile,
  inputProps,
  concurrency: values.concurrency ? Number(values.concurrency) : 4,
});

console.log("\nVideo pronto:");
console.log("  arquivo: " + outFile + "\n");
