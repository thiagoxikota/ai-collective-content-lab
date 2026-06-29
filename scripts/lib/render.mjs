// Shared Remotion render core. Used by the CLI (render-post.mjs) AND the visual
// editor server (ui.mjs), so both produce the exact same PNG (no drift).
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { repoRoot } from "./env.mjs";

let serveUrlPromise = null;

// Bundle the Remotion project ONCE and reuse the result across renders.
export function getServeUrl() {
  if (!serveUrlPromise) {
    serveUrlPromise = (async () => {
      await ensureBrowser();
      return bundle({
        entryPoint: path.join(repoRoot, "src", "index.ts"),
        publicDir: path.join(repoRoot, "assets"),
      });
    })();
  }
  return serveUrlPromise;
}

// Render the "Post" still to a PNG file. inputProps.heroImage may be an
// assets-relative path (CLI) OR a data: / http(s) URL (editor upload).
export async function renderPostStill(inputProps, outFile) {
  const serveUrl = await getServeUrl();
  const composition = await selectComposition({ serveUrl, id: "Post", inputProps });
  await renderStill({
    composition,
    serveUrl,
    output: outFile,
    inputProps,
    imageFormat: "png",
  });
  return outFile;
}
