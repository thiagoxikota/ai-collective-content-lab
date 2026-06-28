import React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadSans } from "@remotion/google-fonts/OpenSans";

// =============================================================================
// The AI Collective visual identity.
// Grounded from aicollective.com (CSS tokens, og:image, favicon) + the official
// logo SVG, verified 2026-06-28. See README "Identidade" for sources.
//
//   Accent orange     #FF630D  (logo mark; site CSS uses the near-identical #f97316)
//   Dark / scrim      #0C0A09  (stone-950, dark page bg)
//   Light bg          #F5F5F4  (stone-100, light page bg)
//   Ink on photo      #FFFFFF  (white, as in the official og:image)
//   Muted secondary   #78726D  (stone-500)
//   Type: editorial serif headlines (Georgia Pro -> free Source Serif 4) +
//         Open Sans body. Tagline: "The Human Side of AI."
// =============================================================================

// Load the brand fonts. Calling loadFont at module load registers the @font-face
// and Remotion waits for it before rendering.
// Load only the weights + Latin subsets the posts actually use. This keeps the
// render fast (a few font requests, not dozens) which matters at a live event.
const serif = loadSerif("normal", {
  weights: ["800"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});
const sans = loadSans("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

export const BRAND = {
  name: "The AI Collective",
  tagline: "The Human Side of AI.",
  handleGlobal: "@aicollectiveco",
  colors: {
    accent: "#FF630D", // the single brand pop
    bg: "#0C0A09", // dark scrim base
    light: "#F5F5F4",
    ink: "#FFFFFF",
    muted: "#78726D",
    verified: "#FF630D", // chip seal uses the brand orange, not Instagram blue
  },
  display: { fontFamily: serif.fontFamily }, // Source Serif 4
  body: { fontFamily: sans.fontFamily }, // Open Sans
} as const;

// Convert a #rrggbb (or #rgb) hex to an rgba() string with the given alpha.
export function withAlpha(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// The AI Collective "C" circlemark, recreated from the official logo SVG
// (viewBox 0 0 150 150). Open C with a rotational/refresh feel. Flat orange is
// the current official palette (the legacy mark used an orange->blue gradient).
const C_MARK_PATH =
  "M130.8,116.48l-23.7-21.8c-2.07-1.91-5.17-2.09-7.51-.52-15.67,10.87-38.67,9.1-53.43-2.73-16.61-13.01-20.51-35.81-9.08-53.04,7.63-11.83,27.06-21.07,43.28-20.79,9.68,0,19.78,2.6,29.19,7.52,3.41,1.87,6.51,4.27,9.47,6.73l-.5,.46-14.84,13.65-.31,.28c-6.25-3.43-14.92-7.65-24.07-7.52-4.51,0-9.02,.79-13.24,2.4-3.67,1.41-8.77,3.8-11.15,7.09-1.31,1.82-.22,3.77,2,3.76,1.62-.03,3.26-1.06,4.75-1.61,5.5-2.05,11.37-3.06,17.24-3.06,8.33-.1,14.94,2.76,20.83,7.87,2.15,1.81,5.3,1.77,7.37-.13l23.7-21.81c1.07-.98,1.09-2.66,.05-3.67-2.11-2.05-4.34-3.96-6.68-5.7-12.63-9.46-28.78-14.78-44.33-14.78-21.64-.63-46.42,13.25-54.42,31.48-12.46,26.33,2.69,54.59,28.15,65.72,7.58,3.36,18.13,5.29,27.15,4.79,8.32-.45,15.83-3.18,22.52-7.7l.33,.3,15.36,14.13,.54,.49c-28.16,21.72-69.31,18.88-94-6.79-1.24-1.26-3.01-.84-3.93,.24-.01,.01-.02,.02-.03,.03-.59,.76-.69,1.76-.22,2.68,3.55,7.52,10.59,13,17.5,17.33,11.12,6.98,24.07,10.72,37.22,10.75,19.34-.09,40.9-9.06,54.82-22.4,1.08-1.03,1-2.69-.04-3.68h0Z";

export const LogoMark: React.FC<{ size: number; color?: string }> = ({
  size,
  color = BRAND.colors.accent,
}) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
    <path d={C_MARK_PATH} fill={color} />
  </svg>
);
