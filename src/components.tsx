import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// One clean, system font stack. No external font download needed.
export const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// A full-bleed image with a slow Ken Burns zoom (scale + drift over time).
export const KenBurnsImage: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
}> = ({ src, durationInFrames, zoom = 0.12 }) => {
  const frame = useCurrentFrame();
  const progress = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const scale = 1.06 + zoom * progress;
  const driftY = interpolate(progress, [0, 1], [0, -2]); // percent
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateY(${driftY}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Crossfades a clip in (and out, unless it is the first / last image).
export const FadeWrapper: React.FC<{
  index: number;
  count: number;
  per: number;
  fade: number;
  children: React.ReactNode;
}> = ({ index, count, per, fade, children }) => {
  const frame = useCurrentFrame();
  const isFirst = index === 0;
  const isLast = index === count - 1;
  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, fade], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const fadeOut = isLast
    ? 1
    : interpolate(frame, [per, per + fade], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

// Bottom caption with a dark scrim and an accent bar. Fades in and out.
export const CaptionBar: React.FC<{
  text: string;
  accent: string;
  durationInFrames: number;
}> = ({ text, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (!text) return null;
  const fontSize = Math.round(Math.min(width, height) * 0.058);
  const inO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(inO, outO);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div
        style={{
          opacity,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0))",
          padding: `${fontSize * 2.4}px ${fontSize}px ${fontSize * 1.3}px`,
        }}
      >
        <div style={{ borderLeft: `8px solid ${accent}`, paddingLeft: 24 }}>
          <p
            style={{
              color: "#ffffff",
              fontSize,
              fontWeight: 800,
              lineHeight: 1.12,
              margin: 0,
              fontFamily: SANS,
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A small, high-contrast brand tag in the top-left corner.
export const BrandTag: React.FC<{ brand: string; accent: string }> = ({
  brand,
  accent,
}) => {
  const { width, height } = useVideoConfig();
  if (!brand) return null;
  const fontSize = Math.round(Math.min(width, height) * 0.026);
  return (
    <AbsoluteFill style={{ padding: fontSize * 1.6 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: fontSize * 0.6,
          alignSelf: "flex-start",
          background: "rgba(0,0,0,0.4)",
          borderRadius: 999,
          padding: `${fontSize * 0.5}px ${fontSize}px`,
        }}
      >
        <span
          style={{
            width: fontSize * 0.7,
            height: fontSize * 0.7,
            borderRadius: "50%",
            background: accent,
            display: "inline-block",
          }}
        />
        <span
          style={{
            color: "#ffffff",
            fontSize,
            fontWeight: 700,
            fontFamily: SANS,
            letterSpacing: 0.3,
          }}
        >
          {brand}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// A centered title card for the opening moment of a reel.
export const TitleCard: React.FC<{ title: string; accent: string }> = ({
  title,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (!title) return null;
  const fontSize = Math.round(Math.min(width, height) * 0.09);
  const opacity = interpolate(frame, [0, 10, 32, 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 42], [20, -10]);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          textAlign: "center",
          padding: "0 8%",
        }}
      >
        <p
          style={{
            color: "#ffffff",
            fontSize,
            fontWeight: 900,
            lineHeight: 1.05,
            margin: 0,
            fontFamily: SANS,
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          {title}
        </p>
        <div
          style={{
            width: fontSize * 1.6,
            height: 6,
            background: accent,
            borderRadius: 3,
            margin: `${fontSize * 0.4}px auto 0`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
