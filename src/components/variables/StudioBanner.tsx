import React, { useState } from "react";
import { useFeatureFlagVariantKey, usePostHog } from "@posthog/react";
import styled, { keyframes } from "styled-components";

import { BORDER_SIZE } from "../../consts/variableTableStyles";
import { VAR_TABLE_BORDER } from "../../consts/colors";

import ladderImg from "../../images/ladder-logic-editor.png";
import stImg from "../../images/structured-text-editor.png";
import trendsImg from "../../images/trends-input-outputs.png";
import saveImg from "../../images/save-project-locally.png";

const FEATURE_FLAG = "studio-banner-variant";
const TARGET_BASE_URL = "https://studio.rungs.dev";

const buildTargetUrl = (variant: string): string => {
  const params = new URLSearchParams({
    utm_source: "plcsimulator",
    utm_medium: "banner",
    utm_campaign: "studio-feature",
    utm_content: variant,
  });
  return `${TARGET_BASE_URL}/?${params.toString()}`;
};

type ImageSlide = { kind: "image"; src: string; caption: string };
type ChatSlide = { kind: "chat"; question: string; answer: string };
type Slide = ImageSlide | ChatSlide;

type Variant = {
  feature: string;
  heading: string;
  cta: string;
  slide: Slide;
};

const VARIANTS: Record<string, Variant> = {
  ladder: {
    feature: "Studio",
    heading: "Modern ladder editor",
    cta: "open studio.rungs.dev →",
    slide: { kind: "image", src: ladderImg, caption: "Ladder Logic Editor" },
  },
  st: {
    feature: "Studio",
    heading: "Write your PLC in code",
    cta: "open studio.rungs.dev →",
    slide: { kind: "image", src: stImg, caption: "Structured Text Editor" },
  },
  trends: {
    feature: "Studio",
    heading: "Watch your I/O live",
    cta: "open studio.rungs.dev →",
    slide: { kind: "image", src: trendsImg, caption: "Trends & I/O Monitoring" },
  },
  save: {
    feature: "Studio",
    heading: "Save projects locally",
    cta: "open studio.rungs.dev →",
    slide: { kind: "image", src: saveImg, caption: "Save Projects Locally" },
  },
  ai: {
    feature: "✨ Relay AI Assistant",
    heading: "Stuck? Ask Relay.",
    cta: "try Relay AI →",
    slide: {
      kind: "chat",
      question: "Does my ladder logic look correct?",
      answer:
        "Rung 1: `XIC` needs BOOL, not REAL. Fix the type in the Tag editor.",
    },
  },
};

const DEFAULT_VARIANT = "ladder";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const Container = styled.div`
  position: relative;
`;
const Wrapper = styled.a<{ $aspect: string }>`
  display: flex;
  border-top: ${BORDER_SIZE} solid ${VAR_TABLE_BORDER};
  text-decoration: none;
  overflow: hidden;
  aspect-ratio: ${(p) => p.$aspect};
  background: linear-gradient(135deg, #0f172a 0%, #1e2533 100%);
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
const Heading = styled.span`
  font-size: 3.6cqi;
  font-weight: 800;
  color: #f1f5f9;
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
  color: #93c5fd;
  line-height: 1.2;
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

const ChatPanel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  background: #1e2533;
  animation: ${fadeIn} 0.5s ease both;
`;
const UserBubble = styled.div`
  align-self: flex-end;
  max-width: 92%;
  background: #6ea2f7;
  color: #000;
  font-size: 12px;
  line-height: 1.35;
  padding: 4px 8px;
  border-radius: 0;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
`;
const AssistantText = styled.div`
  align-self: flex-start;
  color: #d4d4d4;
  font-size: 12px;
  line-height: 1.45;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  code {
    background: #2a3344;
    color: #e2e8f0;
    padding: 0.05em 0.3em;
    border-radius: 3px;
    font-size: 0.95em;
  }
`;

const renderInline = (text: string): React.ReactNode => {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

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

const getOverrideVariantKey = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("banner");
    if (override && override in VARIANTS) return override;
  } catch {
    // Ignore URL parsing failures.
  }
  return null;
};

const resolveVariantKey = (raw: string | boolean | undefined): string => {
  const override = getOverrideVariantKey();
  if (override) return override;
  if (typeof raw === "string" && raw in VARIANTS) return raw;
  return DEFAULT_VARIANT;
};

const StudioBanner: React.FC = () => {
  const posthog = usePostHog();
  const variantKeyRaw = useFeatureFlagVariantKey(FEATURE_FLAG);
  const variantKey = resolveVariantKey(variantKeyRaw);
  const variant = VARIANTS[variantKey];

  const [dismissed, setDismissed] = useState(() => isDismissed());

  if (dismissed) return null;

  const { slide } = variant;
  const aspect = "4 / 1";

  return (
    <Container>
      <Wrapper
        $aspect={aspect}
        href={buildTargetUrl(variantKey)}
        target="_blank"
        rel="noopener"
        aria-label="open the new PLC simulator at studio.rungs.dev"
        onClick={() => {
          posthog?.capture("studio_banner_click", { variant: variantKey });
        }}
      >
        <Left>
          <Feature>{variant.feature}</Feature>
          <Heading>{variant.heading}</Heading>
          <CTA className="cta">{variant.cta}</CTA>
        </Left>
        <Right>
          {slide.kind === "image" ? (
            <SlideImg src={slide.src} alt={slide.caption} />
          ) : (
            <ChatPanel>
              <UserBubble>{slide.question}</UserBubble>
              <AssistantText>{renderInline(slide.answer)}</AssistantText>
            </ChatPanel>
          )}
        </Right>
      </Wrapper>
      <CloseBtn
        aria-label="Dismiss banner"
        onClick={() => {
          posthog?.capture("studio_banner_dismissed", { variant: variantKey });
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
