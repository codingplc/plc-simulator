import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';
import 'firebase/compat/analytics';
import firebase from './helpers/firebase';
import ErrorBoundary from './components/ErrorBoundary';
import Simulator from './components/Simulator';
import Loading from './components/Loading';
import { loadDiagram, persistor, store } from './store/store';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CustomDragLayer } from './CustomDragLayer';

const theme = createTheme();

firebase.analytics();

loadDiagram();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ErrorBoundary>
          <DndProvider backend={HTML5Backend}>
            <CustomDragLayer />
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Simulator />
            </ThemeProvider>
          </DndProvider>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

serviceWorkerRegistration.register();
