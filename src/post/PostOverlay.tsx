import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, LogoMark, withAlpha } from "../brand";
import { PostProps } from "../schema";

// The editorial overlay for an Instagram post cover, in The AI Collective
// identity. Fully static (no animation): it renders one frame as a PNG.
// Layout: hero photo (behind), a top label bar, and a bottom-anchored block
// with the account chip, the headline (white + accent tail) and the dek.

const PAD = 60;

// Instagram-style verified badge (scalloped circle + check).
const VerifiedCheck: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 1.5l2.3 1.7 2.85-.2 1 2.65 2.65 1-.2 2.85L24 12l-1.7 2.3.2 2.85-2.65 1-1 2.65-2.85-.2L12 22.5l-2.3-1.7-2.85.2-1-2.65-2.65-1 .2-2.85L0 12l1.7-2.3-.2-2.85 2.65-1 1-2.65 2.85.2L12 1.5z"
      fill={color}
    />
    <path d="M10.6 15.2l-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4z" fill="#ffffff" />
  </svg>
);

// Top-left kicker and top-right edition, in small tracked caps.
const TopBar: React.FC<{ kicker: string; edition: string }> = ({ kicker, edition }) => (
  <AbsoluteFill style={{ padding: `${PAD * 0.8}px ${PAD}px`, justifyContent: "flex-start" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
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

// Logo + handle + verified, on a dark rounded pill.
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
    }}
  >
    <LogoMark size={52} />
    <span
      style={{
        color: BRAND.colors.ink,
        fontFamily: BRAND.body.fontFamily,
        fontSize: 31,
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {handle}
    </span>
    <VerifiedCheck size={31} color={BRAND.colors.verified} />
  </div>
);

// Headline: white block, then the accent tail on its own line(s).
// `size` is the px font-size (the UI auto-fits it; 0 falls back to the default).
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
      fontSize: size > 0 ? size : 90,
      lineHeight: 1.0,
      letterSpacing: -1,
      color: BRAND.colors.ink,
      textShadow: "0 3px 22px rgba(0,0,0,0.6)",
    }}
  >
    <span>{headline}</span>
    {accent ? (
      <span style={{ display: "block", color: accentColor }}> {accent}</span>
    ) : null}
  </h1>
);

// Content slide: a medium heading + a body paragraph. Calmer than the cover,
// for the middle slides of a carousel (the "what / when / how" pages).
const ContentBlock: React.FC<{
  heading: string;
  accent: string;
  body: string;
  accentColor: string;
  size: number;
}> = ({ heading, accent, body, accentColor, size }) => (
  <div>
    <h2
      style={{
        margin: 0,
        fontFamily: BRAND.display.fontFamily,
        fontWeight: 800,
        fontSize: size > 0 ? size : 64,
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
          fontSize: 37,
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

// Dek: accent arrow + a short supporting line, in tracked caps.
const Subtitle: React.FC<{ text: string; accentColor: string }> = ({ text, accentColor }) => {
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, maxWidth: "92%" }}>
      <span
        style={{
          color: accentColor,
          fontFamily: BRAND.body.fontFamily,
          fontSize: 31,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
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

// Right-edge carousel chevron (signals "swipe").
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
    <span
      style={{
        color: BRAND.colors.ink,
        opacity: 0.4,
        fontFamily: BRAND.body.fontFamily,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      {n}
    </span>
  </AbsoluteFill>
);

export const PostOverlay: React.FC<PostProps> = (props) => {
  const accentColor = props.accentColor || BRAND.colors.accent;
  const bg = BRAND.colors.bg;
  const isContent = props.layout === "content";
  // Content slides are text-heavy, so they get a heavier, more even scrim.
  const scrim = isContent
    ? `linear-gradient(180deg, ${withAlpha(bg, 0.5)} 0%, ${withAlpha(bg, 0.35)} 28%, ${withAlpha(
        bg,
        0.78
      )} 66%, ${withAlpha(bg, 0.95)} 100%)`
    : `linear-gradient(180deg, ${withAlpha(bg, 0.55)} 0%, ${withAlpha(bg, 0)} 18%, ${withAlpha(
        bg,
        0
      )} 36%, ${withAlpha(bg, 0.55)} 58%, ${withAlpha(bg, 0.9)} 80%, ${withAlpha(bg, 0.97)} 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: scrim }} />

      <TopBar kicker={props.kicker} edition={props.edition} />

      {/* Bottom-anchored content block. */}
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: PAD, gap: 28 }}>
        <AccountChip handle={props.handle} />
        {isContent ? (
          <ContentBlock
            heading={props.headline}
            accent={props.accent}
            body={props.body}
            accentColor={accentColor}
            size={props.headlineSize}
          />
        ) : (
          <>
            <Headline
              headline={props.headline}
              accent={props.accent}
              accentColor={accentColor}
              size={props.headlineSize}
            />
            <Subtitle text={props.subtitle} accentColor={accentColor} />
          </>
        )}
      </AbsoluteFill>

      {props.showCarouselArrow ? <CarouselArrow /> : null}
      {props.pageNumber ? <PageNumber n={props.pageNumber} /> : null}
    </AbsoluteFill>
  );
};
