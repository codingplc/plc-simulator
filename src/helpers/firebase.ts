import firebase from "firebase/compat/app";
import { getAuth, type Auth } from "firebase/auth";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredConfig = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

if (hasRequiredConfig) {
  firebase.initializeApp(config);
} else {
  console.warn("Firebase config missing; Firebase features are disabled.");
}

const createDisabledAuth = () => {
  const disabledError = () =>
    Promise.reject(new Error("Firebase is disabled because configuration is missing."));
  return {
    currentUser: null,
    signInWithEmailAndPassword: disabledError,
    createUserWithEmailAndPassword: disabledError,
    sendPasswordResetEmail: disabledError,
    signOut: disabledError,
    onAuthStateChanged: (callback: (user: firebase.User | null) => void) => {
      callback(null);
      return () => undefined;
    },
  } as unknown as firebase.auth.Auth;
};

export const firebaseEnabled = hasRequiredConfig;
export const auth = hasRequiredConfig ? firebase.auth() : createDisabledAuth();

// react-firebase-hooks v5 takes the modular Auth instance, not the compat wrapper.
// Both are backed by the same app, so the two stay in sync.
export const authModular: Auth = hasRequiredConfig
  ? getAuth(firebase.app())
  : (auth as unknown as Auth);
export const firestore = hasRequiredConfig ? firebase.firestore() : null;
export const analytics = hasRequiredConfig ? firebase.analytics() : null;

export const logEvent = (name: string, params?: Record<string, unknown>) => {
  if (!analytics) return;
  analytics.logEvent(name, params);
};

export default firebase;
