// Provider selector. Reads the PROVIDER env var (default: fal) and returns the
// matching provider module. Every provider exports the same two functions:
//   generateImage({ prompt, size, model })  -> { path, rel, url, model }
//   generateClip({ prompt, image, duration, model }) -> { path, rel, url, model }
//
// To add a new provider (Replicate, Gemini, OpenAI, ...): copy fal.mjs to
// <name>.mjs, implement those two functions, and add a case below.
import { loadEnv } from "../env.mjs";

export async function getProvider() {
  loadEnv();
  const name = (process.env.PROVIDER || "fal").toLowerCase();

  switch (name) {
    case "fal":
      return import("./fal.mjs");

    case "replicate":
    case "gemini":
    case "openai":
      throw new Error(
        `O provider "${name}" esta documentado no README, mas nao vem implementado neste lab. ` +
          `Crie scripts/lib/providers/${name}.mjs (copie fal.mjs como base, com generateImage e generateClip) ` +
          `e adicione um "case" em scripts/lib/providers/index.mjs. O padrao PROVIDER=fal funciona direto.`
      );

    default:
      throw new Error(`PROVIDER desconhecido: "${name}". Use fal (padrao).`);
  }
}
