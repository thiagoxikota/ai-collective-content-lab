// Tiny .env loader (no dependency). Reads KEY=VALUE lines from the repo's
// .env file and copies any that are not already set into process.env.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // scripts/lib
export const repoRoot = path.resolve(here, "..", ".."); // repo root

export function loadEnv() {
  const envPath = path.join(repoRoot, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip optional surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

// Read a required env var or fail with a friendly, actionable message.
export function requireKey(name) {
  loadEnv();
  const value = process.env[name];
  if (!value) {
    console.error(
      [
        "",
        `  Falta a chave ${name}.  /  Missing ${name}.`,
        "",
        "  1. Abra o arquivo .env (rode ./scripts/setup.sh se ele nao existir).",
        "  2. Cole sua chave do fal.ai depois de FAL_KEY=",
        "  3. Pegue uma chave gratis em https://fal.ai/dashboard/keys",
        "",
      ].join("\n")
    );
    process.exit(1);
  }
  return value;
}
