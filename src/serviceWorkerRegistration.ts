/* eslint-disable no-console */
import { registerSW } from 'virtual:pwa-register';

type Config = {
  onSuccess?: () => void;
  onUpdate?: () => void;
};

export function register(config?: Config) {
  registerSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        console.log('Service worker registered.');
      }
    },
    onRegisterError(error) {
      console.error('Error during service worker registration:', error);
    },
    onNeedRefresh() {
      if (confirm('A new version of the app is available. Do you want to refresh the page?')) {
        window.location.reload();
      }
      config?.onUpdate?.();
    },
    onOfflineReady() {
      console.log('Content is cached for offline use.');
      config?.onSuccess?.();
    },
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
