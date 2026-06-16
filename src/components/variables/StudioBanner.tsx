import React, { useEffect, useRef, useState } from "react";
import { useFeatureFlagVariantKey, usePostHog } from "@posthog/react";
import styled, { keyframes } from "styled-components";

import { BORDER_SIZE } from "../../consts/variableTableStyles";
import { VAR_TABLE_BORDER } from "../../consts/colors";

import ladderImg from "../../images/ladder-logic-editor.png";

// Destination experiment: two tailored banners. The `studio` arm pitches the
// Studio app (ladder screenshot); the `learn` arm pitches Learn (passing
// exercise tests). Each has its own copy, right-side panel and link, so this
// measures the whole package (banner + destination) per arm.
// Flag lives in PostHog project 142335. Fallback / kill switch = "studio".
const FEATURE_FLAG = "plcsim-banner-destination";

type Variant = "studio" | "learn";
const DEFAULT_VARIANT: Variant = "studio";

type RightPanel =
  | { kind: "image"; src: string; caption: string }
  | { kind: "tests"; title: string; items: string[]; summary: string };

type VariantContent = {
  feature: string;
  heading: string;
  cta: string;
  href: string;
  right: RightPanel;
};

const CONTENT: Record<Variant, VariantContent> = {
  studio: {
    feature: "studio.rungs.dev",
    heading: "Next-generation PLC simulator online",
    cta: "Open Studio →",
    href: "https://studio.rungs.dev/",
    right: { kind: "image", src: ladderImg, caption: "Ladder Logic Editor" },
  },
  learn: {
    feature: "learn.rungs.dev",
    heading: "Learn PLC programming, the practical way",
    cta: "Start free exercises →",
    href: "https://learn.rungs.dev/",
    right: {
      kind: "tests",
      title: "ToggleLamp",
      items: ["rising edge toggles", "holds on release", "no double-toggle"],
      summary: "3 passed, 0 failed",
    },
  },
};

const buildTargetUrl = (variant: Variant): string => {
  const base = CONTENT[variant].href;
  const params = new URLSearchParams({
    utm_source: "plcsimulator.online",
    utm_medium: "banner",
    utm_campaign: "plcsim_banner_dest",
    utm_content: variant,
  });
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
};

// Dev-only QA override: ?banner=studio|learn. Stripped from production builds so
// it can't skew the live experiment.
const getOverrideVariant = (): Variant | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("banner");
    if (raw === "studio" || raw === "learn") return raw;
  } catch {
    // Ignore URL parsing failures.
  }
  return null;
};

const resolveVariant = (raw: string | boolean | undefined): Variant => {
  if (import.meta.env.DEV) {
    const override = getOverrideVariant();
    if (override) return override;
  }
  return raw === "learn" || raw === "studio" ? raw : DEFAULT_VARIANT;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const Container = styled.div`
  position: relative;
`;
const Wrapper = styled.a`
  display: flex;
  border-top: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  text-decoration: none;
  overflow: hidden;
  aspect-ratio: 4 / 1;
  background: linear-gradient(135deg, #14171d 0%, #1d222b 100%);
  container-type: size;

  :hover .cta {
    background: #2563eb;
  }
`;
const Left = styled.div`
  width: 50%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4% 3%;
  gap: 8%;
  overflow: hidden;
`;
const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8cqi;
`;
const Heading = styled.span`
  font-size: 3.6cqi;
  font-weight: 800;
  color: oklch(90% 0.007 247.896);
  line-height: 1.2;
  text-align: center;
`;
const CTA = styled.span`
  display: inline-block;
  padding: 3% 6%;
  border-radius: 5px;
  background: #3b82f6;
  color: #fff;
  font-size: 3.1cqi;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: background 150ms ease;
  white-space: nowrap;
`;
const Right = styled.div`
  width: 50%;
  position: relative;
  overflow: hidden;
  container-type: size;
`;
const Feature = styled.span`
  font-size: 3.6cqi;
  font-weight: 700;
  color: #66b3ff;
  line-height: 1;
  text-align: center;
`;
const SlideImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: ${fadeIn} 0.5s ease both;
`;

const TestPanel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3cqh;
  padding: 6% 8%;
  background: oklch(12.9% 0.042 264.695);
  font-family: "Roboto Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;
  animation: ${fadeIn} 0.5s ease both;
`;
const Marker = styled.span`
  color: oklch(62.7% 0.265 303.9);
`;
const TestTitle = styled.div`
  font-size: 9cqh;
  font-weight: 700;
  color: oklch(90% 0.007 247.896);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TestRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5%;
  font-size: 9cqh;
  line-height: 1.2;
  color: oklch(85% 0 0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Check = styled.span`
  color: oklch(70% 0.17 151.711);
  font-weight: 700;
`;
const TestSummary = styled.div`
  font-size: 9cqh;
  font-weight: 700;
  color: oklch(70% 0.17 151.711);
  line-height: 1.2;
  white-space: nowrap;
`;

const DISMISS_KEY = "studio-banner-dismissed";
const DISMISS_DAYS = 7;
const DISMISS_WINDOW_MS = DISMISS_DAYS * 86_400_000;

const isDismissed = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const storage = window.localStorage;
    const ts = storage.getItem(DISMISS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DISMISS_WINDOW_MS;
  } catch {
    return false;
  }
};

const setDismissedTimestamp = (): void => {
  if (typeof window === "undefined") return;
  try {
    const storage = window.localStorage;
    storage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures (privacy mode / restricted environments).
  }
};

const CloseBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 6px;
  background: rgba(15, 23, 42, 0.7);
  border: none;
  color: #94a3b8;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  z-index: 1;
  padding: 3px 5px;
  border-radius: 6px;
  &:hover {
    background: rgba(15, 23, 42, 0.85);
    color: #cbd5e1;
  }
`;

// `forceVariant` pins a specific arm and disables analytics/dismissal — for
// local preview only (see the temporary stacked render in VariableTable).
type StudioBannerProps = { forceVariant?: Variant };

const StudioBanner: React.FC<StudioBannerProps> = ({ forceVariant }) => {
  const preview = forceVariant !== undefined;
  const posthog = usePostHog();
  const variantRaw = useFeatureFlagVariantKey(FEATURE_FLAG);
  const variant = forceVariant ?? resolveVariant(variantRaw);
  const content = CONTENT[variant];

  const [dismissed, setDismissed] = useState(() => isDismissed());
  const shownFired = useRef(false);

  useEffect(() => {
    // Fire one impression per mount, once the flag has resolved, so the
    // recorded variant matches the link the user actually sees (and clicks).
    if (preview || shownFired.current || isDismissed()) return;
    if (variantRaw === undefined && !import.meta.env.DEV) return;
    shownFired.current = true;
    posthog?.capture("studio_banner_shown", { variant });
  }, [preview, posthog, variant, variantRaw]);

  if (!preview && dismissed) return null;

  const href = buildTargetUrl(variant);
  const { right } = content;

  return (
    <Container>
      <Wrapper
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={`${content.feature}: ${content.heading}`}
        onClick={() => {
          posthog?.capture("studio_banner_click", {
            variant,
            destination: href,
          });
        }}
      >
        <Left>
          <TextGroup>
            <Feature>{content.feature}</Feature>
            <Heading>{content.heading}</Heading>
          </TextGroup>
          <CTA className="cta">{content.cta}</CTA>
        </Left>
        <Right>
          {right.kind === "image" ? (
            <SlideImg src={right.src} alt={right.caption} />
          ) : (
            <TestPanel>
              <TestTitle>
                <Marker>◆</Marker> {right.title}
              </TestTitle>
              {right.items.map((item) => (
                <TestRow key={item}>
                  <Check>✓</Check>
                  <span>{item}</span>
                </TestRow>
              ))}
              <TestSummary>✓ {right.summary}</TestSummary>
            </TestPanel>
          )}
        </Right>
      </Wrapper>
      <CloseBtn
        aria-label="Dismiss banner"
        onClick={() => {
          posthog?.capture("studio_banner_dismissed", { variant });
          setDismissedTimestamp();
          setDismissed(true);
        }}
      >
        ✕
      </CloseBtn>
    </Container>
  );
};

export default StudioBanner;
