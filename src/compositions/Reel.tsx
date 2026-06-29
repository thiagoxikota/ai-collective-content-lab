import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { VideoProps } from "../schema";
import { BRAND } from "../brand";
import {
  BrandTag,
  CaptionBar,
  FadeWrapper,
  KenBurnsImage,
  TitleCard,
  isVideo,
} from "../components";

// Reel: a vertical-first montage. Each image gets a slow Ken Burns zoom,
// images crossfade into each other, captions slide up from a dark scrim,
// and an optional title card opens the piece. Built for Instagram / TikTok.
export const Reel: React.FC<VideoProps> = ({
  images,
  captions,
  title,
  brand,
  secondsPerImage,
  accentColor,
}) => {
  const { fps } = useVideoConfig();
  const per = Math.round(secondsPerImage * fps);
  const fade = Math.round(0.5 * fps);
  const imgs = images.length > 0 ? images : ["samples/floripa-sunset.png"];

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.bg }}>
      {imgs.map((img, i) => (
        <Sequence key={img + i} from={i * per} durationInFrames={per + fade}>
          <FadeWrapper index={i} count={imgs.length} per={per} fade={fade}>
            {isVideo(img) ? (
              <AbsoluteFill style={{ backgroundColor: BRAND.colors.bg }}>
                <OffthreadVideo
                  src={staticFile(img)}
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </AbsoluteFill>
            ) : (
              <KenBurnsImage src={staticFile(img)} durationInFrames={per + fade} />
            )}
            <CaptionBar
              text={captions[i] ?? ""}
              accent={accentColor}
              durationInFrames={per + fade}
            />
          </FadeWrapper>
        </Sequence>
      ))}

      {/* Opening title, only for the first ~1.4s. */}
      <Sequence durationInFrames={Math.round(1.5 * fps)}>
        <TitleCard title={title} accent={accentColor} />
      </Sequence>

      {/* Persistent brand tag. */}
      <BrandTag brand={brand} accent={accentColor} />
    </AbsoluteFill>
  );
};
