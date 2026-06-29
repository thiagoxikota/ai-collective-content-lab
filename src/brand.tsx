import React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadSans } from "@remotion/google-fonts/OpenSans";
import {
  BRAND as CONFIG,
  CHAPTER,
  withAlpha,
  scrimGradient,
  brandSlug,
} from "./brand.config.mjs";

// =============================================================================
// The AI Collective visual identity (React/Remotion side).
// All VALUES live in src/brand.config.mjs (the single source of truth, shared
// with the CLI scripts and the editor). This file only adds the things that
// need React/Remotion: font loading and the SVG logo component.
//
// To rebrand: edit src/brand.config.mjs (and, for a non-default font, swap the
// two loadFont imports above + the editor's Google Fonts <link>).
// =============================================================================

// Load the brand fonts. Calling loadFont at module load registers the @font-face
// and Remotion waits for it before rendering. Only the weights + Latin subsets
// the art actually uses, so the render stays fast at a live event.
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

// Re-export the framework-neutral helpers so existing imports keep working.
export { CHAPTER, withAlpha, scrimGradient, brandSlug };

export const BRAND = {
  name: CONFIG.name,
  tagline: CONFIG.tagline,
  handleGlobal: CONFIG.handleGlobal,
  colors: CONFIG.colors,
  sizing: CONFIG.sizing,
  scrims: CONFIG.scrims,
  display: { fontFamily: serif.fontFamily }, // resolved Source Serif 4 family
  body: { fontFamily: sans.fontFamily }, // resolved Open Sans family
} as const;

export const LogoMark: React.FC<{ size: number; color?: string }> = ({
  size,
  color = CONFIG.colors.accent,
}) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
    <path d={CONFIG.logoPath} fill={color} />
  </svg>
);
