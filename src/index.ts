// Remotion entry point. The CLI and the programmatic renderer both load this file.
// It only has to register the root component (which lists every composition).
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
