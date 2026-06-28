// Remotion config. Only non-default settings live here.
// Docs: https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

// Serve assets/ as the static root, so staticFile("samples/x.png") and
// staticFile("generated/x.png") resolve to files under assets/.
Config.setPublicDir("assets");

// jpeg frames render faster than png (we only need them as a video source).
Config.setVideoImageFormat("jpeg");

// Keep CPU / RAM modest so it behaves on an 8 GB laptop. Raise for speed.
Config.setConcurrency(4);
