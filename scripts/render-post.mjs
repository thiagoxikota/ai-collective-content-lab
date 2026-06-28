#!/usr/bin/env node
// Render a single Instagram POST (still PNG) from a hero image + an editorial
// overlay in The AI Collective identity. This is what the "criar-post" skill calls.
//
// The hero can be ANY image (a photo you have, a stock shot, or one made with
// the gerar-imagem skill). No API key needed to render the post itself.
//
// Usage:
//   node scripts/render-post.mjs --hero assets/samples/floripa-sunset.png \
//     --headline "O ALGORITMO MUDOU" --accent "E A SUA COMUNIDADE TAMBEM" \
//     --subtitle "Por que estar na sala importa mais que seguidores" \
//     --carousel
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { assetRelative, downloadTo, outputPath } from "./lib/util.mjs";

loadEnv();

const assetsDir = path.join(repoRoot, "assets");
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

const { values } = parseArgs({
  options: {
    hero: { type: "string" }, // main image: file path, assets-relative, or URL
    headline: { type: "string" }, // big white headline
    accent: { type: "string" }, // colored tail line(s) of the headline
    subtitle: { type: "string" }, // smaller dek under the headline
    handle: { type: "string" }, // @handle in the chip
    kicker: { type: "string" }, // top-left label
    edition: { type: "string" }, // top-right label (e.g. "Junho 2026")
    color: { type: "string" }, // accent hex override
    page: { type: "string" }, // optional page number watermark
    carousel: { type: "boolean" }, // show the carousel ">" arrow
    out: { type: "string" },
  },
});

// Resolve the hero image to a path relative to assets/ (for staticFile).
async function resolveHero(token) {
  if (!token) {
    // Default to a bundled sample so the command works with zero input.
    const samples = path.join(assetsDir, "samples");
    const first = fs.existsSync(samples)
      ? fs.readdirSync(samples).filter((f) => IMAGE_EXT.test(f)).sort()[0]
      : null;
    if (!first) throw new Error("Sem imagem hero. Passe --hero <caminho-ou-url>.");
    return `samples/${first}`;
  }
  if (/^https?:\/\//.test(token)) {
    const dest = outputPath("hero", "post", "png");
    await downloadTo(token, dest);
    return assetRelative(dest);
  }
  const candidates = [token, path.join(repoRoot, token), path.join(assetsDir, token)];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return assetRelative(path.resolve(c));
  }
  return token.split(path.sep).join("/"); // assume already assets-relative
}

const heroImage = await resolveHero(values.hero);

const inputProps = {
  heroImage,
  headline: values.headline ?? "O algoritmo mudou.",
  accent: values.accent ?? "A comunidade não.",
  subtitle: values.subtitle ?? "Por que estar na sala importa mais que ter seguidores",
  handle: values.handle ?? "@aicollectivefloripa",
  kicker: values.kicker ?? "AI Collective Florianópolis",
  edition: values.edition ?? "",
  accentColor: values.color ?? "",
  pageNumber: values.page ?? "",
  showCarouselArrow: Boolean(values.carousel),
};

const outDir = path.join(repoRoot, "out");
fs.mkdirSync(outDir, { recursive: true });
const outFile = values.out
  ? path.resolve(values.out)
  : path.join(outDir, `post-${Date.now()}.png`);

console.log(`\nRenderizando post (1080x1350)...`);
console.log(`  hero: ${heroImage}`);
console.log(`  headline: ${inputProps.headline} ${inputProps.accent}`);

await ensureBrowser();

const serveUrl = await bundle({
  entryPoint: path.join(repoRoot, "src", "index.ts"),
  publicDir: assetsDir,
});

const composition = await selectComposition({ serveUrl, id: "Post", inputProps });

await renderStill({
  composition,
  serveUrl,
  output: outFile,
  inputProps,
  imageFormat: "png",
});

console.log("\nPost pronto:");
console.log("  arquivo: " + outFile + "\n");
