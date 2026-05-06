import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import App from "./App";
import { createRoot } from "react-dom/client";
import React from "react";
import { version } from "../package.json";

posthog.init("phc_Lu1p6d28pqkBdam80PJcMQ3thC2CzuWMsXEWRHO10yX", {
  api_host: "https://eu.i.posthog.com",
  autocapture: false,
  person_profiles: "always",
  defaults: "2026-01-30",
  capture_performance: false,
});

import.meta.env.MODE === "production" &&
  Sentry.init({
    release: `plc-simulator@${version}`,
    dsn: "https://32c5d1333234467f9bbd89ffe4953fbf@o4505075727990784.ingest.sentry.io/4505075729629184",
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 0.2,
    // Session Replay
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
  });

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>,
);

serviceWorkerRegistration.register();
