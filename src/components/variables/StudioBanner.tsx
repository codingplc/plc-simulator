import React, { useEffect, useRef, useState } from "react";
import { usePostHog } from "@posthog/react";
import styled, { keyframes } from "styled-components";

import { BORDER_SIZE } from "../../consts/variableTableStyles";
import { VAR_TABLE_BORDER } from "../../consts/colors";

import ladderImg from "../../images/ladder-logic-editor.png";

// The destination A/B (studio vs learn) is finished: studio won on click rate
// and on what people did after landing, so the surviving arm is hardcoded and
// the feature flag is gone. utm_campaign matches the docs callouts and the
// empty-canvas notice so every migration surface rolls up as one campaign.
const FEATURE = "studio.rungs.dev";
const HEADING = "Next-generation PLC simulator online";
const CTA_LABEL = "Open Studio →";
const CAPTION = "Ladder Logic Editor";

const buildTargetUrl = (): string => {
  const params = new URLSearchParams({
    utm_source: "plcsimulator.online",
    utm_medium: "banner",
    utm_campaign: "successor",
    utm_content: "app_variable_table",
  });
  return `https://studio.rungs.dev/?${params.toString()}`;
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

const StudioBanner: React.FC = () => {
  const posthog = usePostHog();
  const [dismissed, setDismissed] = useState(() => isDismissed());
  const shownFired = useRef(false);

  useEffect(() => {
    // One impression per mount, skipped once the banner has been dismissed.
    if (shownFired.current || isDismissed()) return;
    shownFired.current = true;
    posthog?.capture("studio_banner_shown");
  }, [posthog]);

  if (dismissed) return null;

  const href = buildTargetUrl();

  return (
    <Container>
      <Wrapper
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={`${FEATURE}: ${HEADING}`}
        onClick={() => {
          posthog?.capture("studio_banner_click", { destination: href });
        }}
      >
        <Left>
          <TextGroup>
            <Feature>{FEATURE}</Feature>
            <Heading>{HEADING}</Heading>
          </TextGroup>
          <CTA className="cta">{CTA_LABEL}</CTA>
        </Left>
        <Right>
          <SlideImg src={ladderImg} alt={CAPTION} />
        </Right>
      </Wrapper>
      <CloseBtn
        aria-label="Dismiss banner"
        onClick={() => {
          posthog?.capture("studio_banner_dismissed");
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
