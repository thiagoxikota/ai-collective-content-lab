#!/usr/bin/env node
// Generate a short AI video clip from text (and optionally an image) and save
// it to assets/generated/. The clip can then be dropped into a Remotion video.
//
// Heads up: video models cost real money (Kling ~$0.35 per 5s clip). Keep
// duration short and set a spend limit in the fal.ai dashboard before an event.
//
// Usage:
//   node scripts/generate-clip.mjs "ondas quebrando na praia, camera lenta"
//   node scripts/generate-clip.mjs "anima essa foto" --image assets/generated/image-xxx.png
//   node scripts/generate-clip.mjs "drone sobre a ilha" --duration 5
import { parseArgs } from "node:util";
import { loadEnv } from "./lib/env.mjs";
import { getProvider } from "./lib/providers/index.mjs";

loadEnv();

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    image: { type: "string" }, // local path OR a public URL (turns on image-to-video)
    duration: { type: "string" }, // seconds, default 5 (keep it short to save money)
    model: { type: "string" }, // override the fal model id
  },
});

const prompt = positionals.join(" ").trim();
if (!prompt) {
  console.error('Uso: node scripts/generate-clip.mjs "seu prompt" [--image caminho] [--duration 5]');
  process.exit(1);
}

console.log(`\nGerando clip de IA (pode levar de 30s a alguns minutos)...\n  prompt: ${prompt}`);
if (values.image) console.log(`  base: ${values.image}`);

const provider = await getProvider();
const res = await provider.generateClip({
  prompt,
  image: values.image,
  duration: values.duration || "5",
  model: values.model,
});

console.log("\nClip pronto:");
console.log("  arquivo: " + res.path);
console.log("  (use no Remotion como: " + res.rel + ")\n");
