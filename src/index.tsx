import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import * as Sentry from '@sentry/react';
import App from './App';
import { createRoot } from 'react-dom/client';
import React from 'react';

process.env.NODE_ENV === 'production' &&
  Sentry.init({
    release: 'plc-simulator@' + process.env.REACT_APP_VERSION,
    dsn: 'https://32c5d1333234467f9bbd89ffe4953fbf@o4505075727990784.ingest.sentry.io/4505075729629184',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 0.2,
    // Session Replay
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
  });

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (confirm('A new version of the app is available. Do you want to refresh the page?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});
