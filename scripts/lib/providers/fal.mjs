// fal.ai provider. The only fully implemented provider in this lab.
// One key (FAL_KEY) covers both image and video models.
//
// Model ids verified on fal.ai docs on 2026-06-27:
//   image  -> fal-ai/flux/schnell                              (fast, cheap, ~$0.003/MP)
//   t2v    -> fal-ai/kling-video/v2.5-turbo/pro/text-to-video  (~$0.35 / 5s)
//   i2v    -> fal-ai/kling-video/v2.5-turbo/pro/image-to-video (~$0.35 / 5s)
// Override any of them via env vars (FAL_IMAGE_MODEL, FAL_VIDEO_MODEL, FAL_VIDEO_IMAGE_MODEL).
import fs from "node:fs";
import { fal } from "@fal-ai/client";
import { requireKey } from "../env.mjs";
import {
  assetRelative,
  downloadTo,
  extFromContentType,
  outputPath,
} from "../util.mjs";

const IMAGE_MODEL = process.env.FAL_IMAGE_MODEL || "fal-ai/flux/schnell";
const T2V_MODEL =
  process.env.FAL_VIDEO_MODEL || "fal-ai/kling-video/v2.5-turbo/pro/text-to-video";
const I2V_MODEL =
  process.env.FAL_VIDEO_IMAGE_MODEL ||
  "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";

// Map a friendly aspect word to a Flux image_size enum.
function imageSizeFor(aspect) {
  if (aspect === "horizontal") return "landscape_16_9";
  if (aspect === "square") return "square_hd";
  if (aspect === "vertical") return "portrait_16_9";
  return aspect || "portrait_16_9"; // allow a raw enum to pass through
}

function configure() {
  const key = requireKey("FAL_KEY");
  fal.config({ credentials: key });
}

function logProgress(update) {
  if (update.status === "IN_PROGRESS" || update.status === "IN_QUEUE") {
    (update.logs || []).forEach((l) => l?.message && console.log("  " + l.message));
  }
}

// Text -> image. Returns { path, rel, url, model }.
export async function generateImage({ prompt, size, model }) {
  configure();
  const endpoint = model || IMAGE_MODEL;
  const image_size = imageSizeFor(size);
  console.log(`  modelo: ${endpoint}  (${image_size})`);

  const result = await fal.subscribe(endpoint, {
    input: { prompt, image_size, num_images: 1 },
    logs: true,
    onQueueUpdate: logProgress,
  });

  const image = result?.data?.images?.[0];
  if (!image?.url) {
    throw new Error("fal.ai nao retornou imagem. Resposta: " + JSON.stringify(result?.data));
  }
  const ext = extFromContentType(image.content_type, "png");
  const dest = outputPath("image", prompt, ext);
  await downloadTo(image.url, dest);
  return { path: dest, rel: assetRelative(dest), url: image.url, model: endpoint };
}

// Text (and optionally an image) -> short AI video clip. Returns { path, url, model }.
export async function generateClip({ prompt, image, duration = "5", model }) {
  configure();
  const hasImage = Boolean(image);
  const endpoint = model || (hasImage ? I2V_MODEL : T2V_MODEL);
  console.log(`  modelo: ${endpoint}`);

  const input = { prompt, duration: String(duration) };

  if (hasImage) {
    if (/^https?:\/\//.test(image)) {
      input.image_url = image; // already a URL
    } else {
      // Upload a local file to fal storage to get a usable URL.
      console.log("  enviando imagem para o fal.storage...");
      const buf = fs.readFileSync(image);
      const blob = new Blob([buf]);
      input.image_url = await fal.storage.upload(blob);
    }
  }

  const result = await fal.subscribe(endpoint, {
    input,
    logs: true,
    onQueueUpdate: logProgress,
  });

  const url = result?.data?.video?.url;
  if (!url) {
    throw new Error("fal.ai nao retornou video. Resposta: " + JSON.stringify(result?.data));
  }
  const dest = outputPath("clip", prompt, "mp4");
  await downloadTo(url, dest);
  return { path: dest, rel: assetRelative(dest), url, model: endpoint };
}

export const providerName = "fal";
