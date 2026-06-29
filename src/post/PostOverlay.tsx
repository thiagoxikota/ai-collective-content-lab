import React, { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { BRAND, LogoMark, withAlpha, scrimGradient } from "../brand";
import { PostProps } from "../schema";

// The editorial overlay for an Instagram post, in The AI Collective identity.
// Renders one frame as a PNG. Layout: hero photo (behind), a top label bar, and
// a bottom-anchored block with the account chip, the headline/heading, and the
// dek or body.
//
// AUTO-FIT: when headlineSize is 0 (the CLI / skill path), the component MEASURES
// its own bottom block in the headless browser and shrinks the heading (then, on
// content slides, the body) until the block fits BUDGET, so a long headline never
// overflows off-canvas. When a size is passed (the editor measured it client-side
// so the live preview matches), the component honors it as-is.

const PAD = 60;
const BUDGET = BRAND.sizing.maxContentHeight;

// Instagram-style verified badge (scalloped circle + check). Brand-neutral glyph.
const VerifiedCheck: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 1.5l2.3 1.7 2.85-.2 1 2.65 2.65 1-.2 2.85L24 12l-1.7 2.3.2 2.85-2.65 1-1 2.65-2.85-.2L12 22.5l-2.3-1.7-2.85.2-1-2.65-2.65-1 .2-2.85L0 12l1.7-2.3-.2-2.85 2.65-1 1-2.65 2.85.2L12 1.5z"
      fill={color}
    />
    <path d="M10.6 15.2l-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4z" fill="#ffffff" />
  </svg>
);

const TopBar: React.FC<{ kicker: string; edition: string }> = ({ kicker, edition }) => (
  <AbsoluteFill style={{ padding: `${PAD * 0.8}px ${PAD}px`, justifyContent: "flex-start" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <span style={labelStyle}>{kicker}</span>
      {edition ? <span style={labelStyle}>{edition}</span> : <span />}
    </div>
  </AbsoluteFill>
);

const labelStyle: React.CSSProperties = {
  color: BRAND.colors.ink,
  fontFamily: BRAND.body.fontFamily,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: 1.6,
  textTransform: "uppercase",
  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
};

const AccountChip: React.FC<{ handle: string }> = ({ handle }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      background: withAlpha(BRAND.colors.bg, 0.55),
      borderRadius: 999,
      padding: "14px 26px 14px 16px",
      backdropFilter: "blur(8px)",
      alignSelf: "flex-start",
    }}
  >
    <LogoMark size={52} />
    <span style={{ color: BRAND.colors.ink, fontFamily: BRAND.body.fontFamily, fontSize: 31, fontWeight: 700, letterSpacing: 0.2 }}>
      {handle}
    </span>
    <VerifiedCheck size={31} color={BRAND.colors.verified} />
  </div>
);

const Headline: React.FC<{ headline: string; accent: string; accentColor: string; size: number }> = ({
  headline,
  accent,
  accentColor,
  size,
}) => (
  <h1
    style={{
      margin: 0,
      fontFamily: BRAND.display.fontFamily,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: -1,
      color: BRAND.colors.ink,
      textShadow: "0 3px 22px rgba(0,0,0,0.6)",
    }}
  >
    <span>{headline}</span>
    {accent ? <span style={{ display: "block", color: accentColor }}> {accent}</span> : null}
  </h1>
);

const ContentBlock: React.FC<{
  heading: string;
  accent: string;
  body: string;
  accentColor: string;
  size: number;
  bodySize: number;
}> = ({ heading, accent, body, accentColor, size, bodySize }) => (
  <div>
    <h2
      style={{
        margin: 0,
        fontFamily: BRAND.display.fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -0.5,
        color: BRAND.colors.ink,
        textShadow: "0 3px 22px rgba(0,0,0,0.6)",
      }}
    >
      <span>{heading}</span>
      {accent ? <span style={{ color: accentColor }}> {accent}</span> : null}
    </h2>
    {body ? (
      <p
        style={{
          margin: "28px 0 0",
          fontFamily: BRAND.body.fontFamily,
          fontSize: bodySize,
          fontWeight: 500,
          lineHeight: 1.4,
          color: BRAND.colors.ink,
          maxWidth: "94%",
          textShadow: "0 1px 10px rgba(0,0,0,0.55)",
        }}
      >
        {body}
      </p>
    ) : null}
  </div>
);

const Subtitle: React.FC<{ text: string; accentColor: string }> = ({ text, accentColor }) => {
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, maxWidth: "92%" }}>
      <span style={{ color: accentColor, fontFamily: BRAND.body.fontFamily, fontSize: 31, fontWeight: 800, lineHeight: 1.2 }}>
        {"→"}
      </span>
      <span
        style={{
          color: BRAND.colors.ink,
          fontFamily: BRAND.body.fontFamily,
          fontSize: 33,
          fontWeight: 600,
          lineHeight: 1.25,
          textShadow: "0 1px 10px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const CarouselArrow: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", padding: PAD * 0.5 }}>
    <div
      style={{
        width: 66,
        height: 66,
        borderRadius: "50%",
        background: withAlpha(BRAND.colors.bg, 0.5),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <path d="M9 5l7 7-7 7" stroke={BRAND.colors.ink} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </AbsoluteFill>
);

const PageNumber: React.FC<{ n: string }> = ({ n }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: PAD * 0.7 }}>
    <span style={{ color: BRAND.colors.ink, opacity: 0.4, fontFamily: BRAND.body.fontFamily, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
      {n}
    </span>
  </AbsoluteFill>
);

// Measure the bottom block and shrink heading (then body) until it fits BUDGET.
// Only active on the CLI path (headlineSize <= 0); the editor passes its own size.
function useAutoFit(layout: PostProps["layout"], headlineSize: number, bodySize: number) {
  const auto = headlineSize <= 0;
  const isContent = layout === "content";
  const hBase = isContent ? BRAND.sizing.contentBase : BRAND.sizing.coverBase;
  const hMin = isContent ? BRAND.sizing.contentMin : BRAND.sizing.coverMin;
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(auto ? hBase : headlineSize);
  const [b, setB] = useState(bodySize > 0 ? bodySize : BRAND.sizing.bodyBase);
  const done = useRef(false);
  const [handle] = useState(() => (auto ? delayRender("post-autofit") : null));

  useLayoutEffect(() => {
    if (!auto || done.current) return;
    const el = ref.current;
    if (!el) return;
    if (el.offsetHeight > BUDGET) {
      if (h > hMin) {
        setH(Math.max(hMin, h - 4));
        return;
      }
      if (isContent && b > BRAND.sizing.bodyMin) {
        setB(Math.max(BRAND.sizing.bodyMin, b - 3));
        return;
      }
    }
    done.current = true;
    if (handle != null) continueRender(handle);
  });

  return {
    ref,
    headingPx: auto ? h : headlineSize,
    bodyPx: bodySize > 0 ? bodySize : auto ? b : BRAND.sizing.bodyBase,
  };
}

export const PostOverlay: React.FC<PostProps> = (props) => {
  const accentColor = props.accentColor || BRAND.colors.accent;
  const bg = BRAND.colors.bg;
  const isContent = props.layout === "content";
  const scrim = scrimGradient(isContent ? BRAND.scrims.content : BRAND.scrims.cover, bg);
  const fit = useAutoFit(props.layout, props.headlineSize, props.bodySize ?? 0);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: scrim }} />

      <TopBar kicker={props.kicker} edition={props.edition} />

      {/* Bottom-anchored content block. The inner div (fit.ref) is what gets measured. */}
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: PAD }}>
        <div ref={fit.ref} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <AccountChip handle={props.handle} />
          {isContent ? (
            <ContentBlock
              heading={props.headline}
              accent={props.accent}
              body={props.body}
              accentColor={accentColor}
              size={fit.headingPx}
              bodySize={fit.bodyPx}
            />
          ) : (
            <>
              <Headline headline={props.headline} accent={props.accent} accentColor={accentColor} size={fit.headingPx} />
              <Subtitle text={props.subtitle} accentColor={accentColor} />
            </>
          )}
        </div>
      </AbsoluteFill>

      {props.showCarouselArrow ? <CarouselArrow /> : null}
      {props.pageNumber ? <PageNumber n={props.pageNumber} /> : null}
    </AbsoluteFill>
  );
};
