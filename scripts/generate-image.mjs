#!/usr/bin/env node
// Generate an image from text and save it to assets/generated/.
//
// Usage:
//   node scripts/generate-image.mjs "um por do sol em Floripa, fotografico"
//   node scripts/generate-image.mjs "logo minimalista" --aspect square
//   node scripts/generate-image.mjs "banner" --aspect horizontal --model fal-ai/flux/dev
import { parseArgs } from "node:util";
import { loadEnv, installErrorHandler } from "./lib/env.mjs";
import { getProvider } from "./lib/providers/index.mjs";

installErrorHandler();
loadEnv();

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    aspect: { type: "string" }, // vertical | horizontal | square (default vertical)
    model: { type: "string" }, // override the fal model id
    size: { type: "string" }, // raw fal image_size enum, if you know it
  },
});

const prompt = positionals.join(" ").trim();
if (!prompt) {
  console.error('Uso: node scripts/generate-image.mjs "seu prompt aqui" [--aspect vertical|horizontal|square]');
  process.exit(1);
}

const size = values.size || values.aspect || "vertical";

console.log(`\nGerando imagem...\n  prompt: ${prompt}`);
const provider = await getProvider();
const res = await provider.generateImage({ prompt, size, model: values.model });

console.log("\nImagem pronta:");
console.log("  arquivo: " + res.path);
console.log("  (use no Remotion como: " + res.rel + ")\n");
