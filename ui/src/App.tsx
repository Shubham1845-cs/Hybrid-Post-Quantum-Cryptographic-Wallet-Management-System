// ─── App.tsx — Immersive 3D client-side router + layout ──────────────────────

import { useState, useCallback } from 'react';
import { AppProvider, useToast } from './context';
import PageLoader from './components/PageLoader';
import DynamicBackground from './components/DynamicBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import GenerateWallet from './pages/GenerateWallet';
import SendTransaction from './pages/SendTransaction';
import TransactionHistory from './pages/TransactionHistory';
import VerifyTransaction from './pages/VerifyTransaction';

export type Page =
  | 'dashboard'
  | 'generate'
  | 'send'
  | 'history'
  | 'verify';

function Router() {
  const [page, setPage] = useState<Page>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const { toasts } = useToast();

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'generate': return <GenerateWallet onNavigate={setPage} />;
      case 'send':     return <SendTransaction onNavigate={setPage} />;
      case 'history':  return <TransactionHistory onNavigate={setPage} />;
      case 'verify':   return <VerifyTransaction onNavigate={setPage} />;
      default:         return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <>
      {/* Page loader */}
      {!isLoaded && <PageLoader onComplete={handleLoadComplete} />}

      {/* Dynamic particle background */}
      <DynamicBackground />

      {/* Custom cursor with glow trail */}
      <CustomCursor />

      {/* Main app */}
      <div
        className="page"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <Navbar currentPage={page} onNavigate={setPage} />
        {renderPage()}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
