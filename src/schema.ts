import { z } from "zod";

// Fixed frame rate for every composition in this lab.
export const FPS = 30;

// ---------------------------------------------------------------------------
// Instagram POST (still). 1080x1350 is the Instagram portrait feed ratio (4:5).
// ---------------------------------------------------------------------------
export const POST_W = 1080;
export const POST_H = 1350;

export const postSchema = z.object({
  // Path relative to assets/ (staticFile), e.g. "samples/floripa-sunset.png".
  heroImage: z.string(),
  // Big white headline. Keep it punchy (covers are short).
  headline: z.string(),
  // Colored tail of the headline (the part in the brand accent). Can be empty.
  accent: z.string(),
  // Smaller line under the headline (the dek). Can be empty.
  subtitle: z.string(),
  // @handle shown in the account chip.
  handle: z.string(),
  // Top-left label (chapter / brand line).
  kicker: z.string(),
  // Top-right label, e.g. "Junho 2026". Can be empty.
  edition: z.string(),
  // Accent hex override. Empty string means use the AI Collective brand accent.
  accentColor: z.string(),
  // Optional faint page number for carousels. Empty means hidden.
  pageNumber: z.string(),
  // Show the carousel ">" arrow on the right edge.
  showCarouselArrow: z.boolean(),
});

export type PostProps = z.infer<typeof postSchema>;

// Defaults so `npm run studio` shows a real post with zero input.
export const defaultPostProps: PostProps = {
  heroImage: "samples/floripa-sunset.png",
  headline: "Floripa entrou no mapa de uma das maiores comunidades de IA do",
  accent: "mundo.",
  subtitle: "Comunidade global de IA, agora com capítulo na ilha",
  handle: "@aicollectivefloripa",
  kicker: "AI Collective Florianópolis",
  edition: "",
  accentColor: "",
  pageNumber: "",
  showCarouselArrow: true,
};

// The three shapes a reel or slideshow can take.
export const orientationEnum = z.enum(["vertical", "horizontal", "square"]);
export type Orientation = z.infer<typeof orientationEnum>;

// Pixel dimensions for each orientation.
export function dimsFor(o: Orientation): { width: number; height: number } {
  if (o === "horizontal") return { width: 1920, height: 1080 };
  if (o === "square") return { width: 1080, height: 1080 };
  return { width: 1080, height: 1920 }; // vertical (default, reel-friendly)
}

// Props shared by both the Reel and the Slideshow compositions.
// `images` are paths RELATIVE to the assets/ folder (the Remotion public dir),
// for example "samples/floripa-sunset.png" or "generated/image-...png".
export const videoSchema = z.object({
  images: z.array(z.string()),
  captions: z.array(z.string()),
  title: z.string(),
  brand: z.string(),
  orientation: orientationEnum,
  secondsPerImage: z.number().min(1).max(15),
  accentColor: z.string(),
});

export type VideoProps = z.infer<typeof videoSchema>;

// Sensible defaults so `npm run studio` and `npm run render` work with zero input,
// using the three bundled Floripa sample images.
export const defaultVideoProps: VideoProps = {
  images: [
    "samples/floripa-sunset.png",
    "samples/floripa-hills.png",
    "samples/floripa-night.png",
  ],
  captions: ["Floripa entrou no mapa", "Comunidade de IA", "AI Collective"],
  title: "AI Collective Floripa",
  brand: "AI Collective Florianópolis",
  orientation: "vertical",
  secondsPerImage: 3,
  accentColor: "#FF630D",
};

// Total length: each image gets `secondsPerImage`, plus a half-second tail
// so the last image can breathe / fade.
export function totalDurationInFrames(images: string[], secondsPerImage: number): number {
  const count = Math.max(images.length, 1);
  const per = Math.round(secondsPerImage * FPS);
  const fade = Math.round(0.5 * FPS);
  return count * per + fade;
}
