// =============================================================================
// SINGLE SOURCE OF TRUTH for the brand. Framework-neutral (plain JS, no JSX, no
// Remotion, no React), so EVERY surface reads the SAME values:
//   - src/brand.tsx          (the React render: posts + video)
//   - src/schema.ts          (composition defaults)
//   - scripts/*.mjs          (CLI defaults: handle, kicker, brand, accent)
//   - ui/index.html          (the visual editor, via the /brand.js the server serves)
//
// ---------------------------------------------------------------------------
// TO REBRAND (white-label): edit THIS file. Change the colors, the fonts, the
// logo path, and the chapter strings here and every surface follows. The only
// extra step for a non-default font is the Google Fonts <link> in ui/index.html
// (the editor preview) and the loadFont import in src/brand.tsx. See the README
// section "Como trocar de marca / Rebrand".
// ---------------------------------------------------------------------------
//
// Current values grounded from aicollective.com (CSS tokens, og:image, favicon)
// and the official logo SVG, verified 2026-06-28.
// =============================================================================

export const BRAND = {
  // Metadata (org name, tagline, org-wide handle). NOT drawn on the art today:
  // what shows on a post is CHAPTER.handle + CHAPTER.label below. These exist for
  // future use (an "about" slide) and to document the brand; editing them alone
  // does not change rendered output. Edit CHAPTER for the on-art handle/label.
  name: "The AI Collective",
  tagline: "The Human Side of AI.",
  handleGlobal: "@aicollectiveco",

  colors: {
    accent: "#FF630D", // the single brand pop (logo mark)
    bg: "#0C0A09", // dark scrim base (stone-950)
    light: "#F5F5F4", // light bg (stone-100)
    ink: "#FFFFFF", // ink on photo
    muted: "#78726D", // muted secondary (stone-500)
    verified: "#FF630D", // chip seal uses brand orange, not Instagram blue
  },

  // Font FAMILY NAMES. The render side loads these via @remotion/google-fonts
  // (src/brand.tsx); the editor loads them via a Google Fonts <link>. Keep the
  // names in sync with both loaders when you change them.
  fonts: {
    display: "Source Serif 4", // editorial serif headline (free stand-in for Georgia Pro)
    body: "Open Sans", // brand body sans
  },

  // Type sizes + the auto-fit budget. Shared by the React render AND the editor
  // so the live preview and the final PNG fit text the same way.
  sizing: {
    coverBase: 90, // cover headline starting px (shrinks to fit)
    coverMin: 46, // cover headline floor px
    contentBase: 64, // content-slide heading starting px
    contentMin: 40, // content-slide heading floor px
    bodyBase: 37, // content-slide body starting px
    bodyMin: 26, // content-slide body floor px
    // Max height (px, in the 1080x1350 canvas) the bottom content block may take
    // before the auto-fit starts shrinking. Keeps the chip/logo on-canvas.
    maxContentHeight: 860,
  },

  // Scrim gradient stops as [positionPercent, alpha] over the dark bg. Both the
  // React overlay and the editor build the identical gradient from these.
  scrims: {
    cover: [[0, 0.55], [18, 0], [36, 0], [58, 0.55], [80, 0.9], [100, 0.97]],
    content: [[0, 0.5], [28, 0.35], [66, 0.78], [100, 0.95]],
  },

  // The official "C" circlemark path (viewBox 0 0 150 150).
  logoPath:
    "M130.8,116.48l-23.7-21.8c-2.07-1.91-5.17-2.09-7.51-.52-15.67,10.87-38.67,9.1-53.43-2.73-16.61-13.01-20.51-35.81-9.08-53.04,7.63-11.83,27.06-21.07,43.28-20.79,9.68,0,19.78,2.6,29.19,7.52,3.41,1.87,6.51,4.27,9.47,6.73l-.5,.46-14.84,13.65-.31,.28c-6.25-3.43-14.92-7.65-24.07-7.52-4.51,0-9.02,.79-13.24,2.4-3.67,1.41-8.77,3.8-11.15,7.09-1.31,1.82-.22,3.77,2,3.76,1.62-.03,3.26-1.06,4.75-1.61,5.5-2.05,11.37-3.06,17.24-3.06,8.33-.1,14.94,2.76,20.83,7.87,2.15,1.81,5.3,1.77,7.37-.13l23.7-21.81c1.07-.98,1.09-2.66,.05-3.67-2.11-2.05-4.34-3.96-6.68-5.7-12.63-9.46-28.78-14.78-44.33-14.78-21.64-.63-46.42,13.25-54.42,31.48-12.46,26.33,2.69,54.59,28.15,65.72,7.58,3.36,18.13,5.29,27.15,4.79,8.32-.45,15.83-3.18,22.52-7.7l.33,.3,15.36,14.13,.54,.49c-28.16,21.72-69.31,18.88-94-6.79-1.24-1.26-3.01-.84-3.93,.24-.01,.01-.02,.02-.03,.03-.59,.76-.69,1.76-.22,2.68,3.55,7.52,10.59,13,17.5,17.33,11.12,6.98,24.07,10.72,37.22,10.75,19.34-.09,40.9-9.06,54.82-22.4,1.08-1.03,1-2.69-.04-3.68h0Z",
};

// The LOCAL chapter instance. Rebranding a chapter = edit these two lines.
export const CHAPTER = {
  handle: "@aicollectivefloripa",
  label: "AI Collective Florianópolis", // top-left kicker AND the video brand tag
};

// rgba() string from a #rrggbb (or #rgb) hex + alpha. Pure, used everywhere.
export function withAlpha(hex, alpha) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Build a vertical scrim gradient string from one of BRAND.scrims, over bg.
export function scrimGradient(stops, bg = BRAND.colors.bg) {
  const parts = stops.map(([pos, a]) => `${withAlpha(bg, a)} ${pos}%`).join(", ");
  return `linear-gradient(180deg, ${parts})`;
}

// A filename-safe slug of a brand/handle string, for download names.
export function brandSlug(s) {
  return (
    (s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/^@/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "brand"
  );
}
