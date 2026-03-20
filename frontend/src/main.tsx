import React          from 'react';
import ReactDOM       from 'react-dom/client';
import App3D          from './App3D';
import { AppProvider} from './context/AppContext';
import ErrorBoundary  from './components/common/ErrorBoundary';
import './index.css';
import './styles/3d-app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    {/* ErrorBoundary — outermost — catches any crash */}
    <ErrorBoundary>

      {/* AppProvider — gives context to entire app */}
      <AppProvider>
        <App3D />
      </AppProvider>

    </ErrorBoundary>

  </React.StrictMode>
);