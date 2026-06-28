// Small helpers shared by the generation scripts. No dependencies.
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./env.mjs";

export const generatedDir = path.join(repoRoot, "assets", "generated");

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// "Por do sol em Floripa!" -> "por-do-sol-em-floripa"
export function slugify(text) {
  return (
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // strip accents (e.g. "Floripá" -> "Floripa")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "asset"
  );
}

// Build a unique output path under assets/generated/, e.g.
// assets/generated/image-por-do-sol-1782600000000.png
export function outputPath(kind, label, ext) {
  ensureDir(generatedDir);
  const stamp = Date.now();
  const name = `${kind}-${slugify(label)}-${stamp}.${ext}`;
  return path.join(generatedDir, name);
}

// Path relative to the assets/ folder, for Remotion staticFile().
// e.g. /repo/assets/generated/x.png -> "generated/x.png"
export function assetRelative(absPath) {
  const assetsDir = path.join(repoRoot, "assets");
  return path.relative(assetsDir, absPath).split(path.sep).join("/");
}

// Download a URL to a local file using the built-in fetch (Node 18+).
export async function downloadTo(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download falhou (${res.status}) para ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  ensureDir(path.dirname(destPath));
  fs.writeFileSync(destPath, buf);
  return destPath;
}

// Pick a file extension from a content-type string (defaults to png / mp4).
export function extFromContentType(contentType, fallback) {
  if (!contentType) return fallback;
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("mp4")) return "mp4";
  return fallback;
}
