import { createMigrate, persistReducer } from "redux-persist";
import storage from "localforage";
import { createStore, compose } from "redux";
import { persistStore } from "redux-persist";
import "firebase/compat/firestore";

import { migrations } from "./const";
import { IMPORT_PROJECT, OPEN_ALERT_SNACKBAR } from "./types";
import firebase from "../helpers/firebase";
import { enablePatches } from "immer";
import simulator from "./simulator";

export const firestore = firebase.firestore();

const persistConfig = {
  key: "root",
  version: 3,
  storage,
  migrate: createMigrate(migrations as any, { debug: true }),
  debug: true,
  writeFailHandler: (err: any) => console.error("storage engine failed during setItem()", err),
  blacklist: ["temp"],
};

enablePatches();

const persistedReducer = persistReducer(persistConfig, simulator as any);

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer, composeEnhancers());

export const persistor = persistStore(store, { manualPersist: true } as any);

const shareUuid = window.location.pathname.split("/")[1];

export const loadDiagram = () => {
  if (shareUuid) {
    const shareRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> = firestore
      .collection("projects_public")
      .doc(shareUuid);
    shareRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const payload = doc.data()?.diagram;
          store.dispatch({ type: IMPORT_PROJECT, payload });
          persistor.purge();
        } else {
          store.dispatch({
            type: OPEN_ALERT_SNACKBAR,
            payload: {
              color: "error",
              open: true,
              text: "Diagram not found in the database.",
            },
          });
        }
        persistor.persist();
      })
      .catch((error) => {
        store.dispatch({
          type: OPEN_ALERT_SNACKBAR,
          payload: {
            color: "error",
            open: true,
            text: `Database loading error. ${error.message}`,
          },
        });
        console.error("Error getting document:", error);
        persistor.persist();
      });
  } else {
    persistor.persist();
  }
};
