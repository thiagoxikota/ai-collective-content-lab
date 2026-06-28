import React from "react";
import { Composition, Still } from "remotion";
import { Post } from "./compositions/Post";
import { Reel } from "./compositions/Reel";
import { Slideshow } from "./compositions/Slideshow";
import {
  FPS,
  POST_H,
  POST_W,
  VideoProps,
  defaultPostProps,
  defaultVideoProps,
  dimsFor,
  postSchema,
  totalDurationInFrames,
  videoSchema,
} from "./schema";

// Compute width / height / duration from the incoming props so a single
// composition can render vertical, horizontal, or square, with any number
// of images, without editing this file.
function metadataFromProps(props: VideoProps, withTail: boolean) {
  const { width, height } = dimsFor(props.orientation);
  const count = Math.max(props.images.length, 1);
  const per = Math.round(props.secondsPerImage * FPS);
  const durationInFrames = withTail
    ? totalDurationInFrames(props.images, props.secondsPerImage)
    : count * per;
  return { width, height, fps: FPS, durationInFrames };
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Instagram POST (still PNG): hero photo + AI Collective editorial overlay. */}
      <Still
        id="Post"
        component={Post}
        schema={postSchema}
        defaultProps={defaultPostProps}
        width={POST_W}
        height={POST_H}
      />
      <Composition
        id="Reel"
        component={Reel}
        schema={videoSchema}
        defaultProps={defaultVideoProps}
        fps={FPS}
        // Real values are computed per render from the props below.
        durationInFrames={300}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => metadataFromProps(props, true)}
      />
      <Composition
        id="Slideshow"
        component={Slideshow}
        schema={videoSchema}
        defaultProps={defaultVideoProps}
        fps={FPS}
        durationInFrames={270}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => metadataFromProps(props, false)}
      />
    </>
  );
};
