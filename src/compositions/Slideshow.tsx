import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { VideoProps } from "../schema";
import { BRAND } from "../brand";
import { BrandTag, SANS, isVideo } from "../components";

// One slide: image fitted (letterboxed) on a dark card, a centered caption,
// and a quick fade in / out. Calmer and more "deck-like" than the Reel.
const Slide: React.FC<{
  src: string;
  caption: string;
  accent: string;
  durationInFrames: number;
}> = ({ src, caption, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fontSize = Math.round(Math.min(width, height) * 0.05);
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: "6%",
      }}
    >
      {isVideo(src) ? (
        <OffthreadVideo
          src={src}
          muted
          style={{
            maxWidth: "100%",
            maxHeight: caption ? "78%" : "100%",
            objectFit: "contain",
            borderRadius: 18,
          }}
        />
      ) : (
        <Img
          src={src}
          style={{
            maxWidth: "100%",
            maxHeight: caption ? "78%" : "100%",
            objectFit: "contain",
            borderRadius: 18,
          }}
        />
      )}
      {caption ? (
        <p
          style={{
            color: "#ffffff",
            fontSize,
            fontWeight: 700,
            fontFamily: SANS,
            textAlign: "center",
            margin: `${fontSize * 0.7}px 0 0`,
            borderTop: `4px solid ${accent}`,
            paddingTop: fontSize * 0.5,
          }}
        >
          {caption}
        </p>
      ) : null}
    </AbsoluteFill>
  );
};

// A row of dots marking how far through the slideshow we are.
const ProgressDots: React.FC<{ count: number; per: number; accent: string }> = ({
  count,
  per,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const active = Math.min(count - 1, Math.floor(frame / per));
  const dot = Math.round(Math.min(width, height) * 0.012);
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", padding: dot * 4 }}
    >
      <div style={{ display: "flex", gap: dot }}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            style={{
              width: dot * 2,
              height: dot * 2,
              borderRadius: "50%",
              background: i === active ? accent : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC<VideoProps> = ({
  images,
  captions,
  brand,
  secondsPerImage,
  accentColor,
}) => {
  const { fps } = useVideoConfig();
  const per = Math.round(secondsPerImage * fps);
  const imgs = images.length > 0 ? images : ["samples/floripa-sunset.png"];

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.bg }}>
      {imgs.map((img, i) => (
        <Sequence key={img + i} from={i * per} durationInFrames={per}>
          <Slide
            src={staticFile(img)}
            caption={captions[i] ?? ""}
            accent={accentColor}
            durationInFrames={per}
          />
        </Sequence>
      ))}
      <ProgressDots count={imgs.length} per={per} accent={accentColor} />
      <BrandTag brand={brand} accent={accentColor} />
    </AbsoluteFill>
  );
};
