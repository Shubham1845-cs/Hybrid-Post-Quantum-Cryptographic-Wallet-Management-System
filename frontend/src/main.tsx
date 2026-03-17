import React          from 'react';
import ReactDOM       from 'react-dom/client';
import App            from './App';
import { AppProvider} from './context/AppContext';
import ErrorBoundary  from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    {/* ErrorBoundary — outermost — catches any crash */}
    <ErrorBoundary>

      {/* AppProvider — gives context to entire app */}
      <AppProvider>
        <App />
      </AppProvider>

    </ErrorBoundary>

  </React.StrictMode>
);