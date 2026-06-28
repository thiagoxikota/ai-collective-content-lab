import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PostProps } from "../schema";
import { BRAND } from "../brand";
import { PostOverlay } from "../post/PostOverlay";

// A single Instagram post (still, 1080x1350): a full-bleed hero photo with The
// AI Collective editorial overlay on top. Rendered to PNG via renderStill.
export const Post: React.FC<PostProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.bg }}>
      <Img
        src={staticFile(props.heroImage)}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
      />
      <PostOverlay {...props} />
    </AbsoluteFill>
  );
};
