import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalLoadingOverlay from './components/common/GlobalLoadingOverlay';
import GlobalErrorDisplay from './components/common/GlobalErrorDisplay';
import ToastContainer from './components/common/ToastContainer';
import WalletDashboard from './components/wallet/WalletDashboard';
import KeyGenerationForm from './components/wallet/KeyGenerationForm';
import TransactionForm from './components/transaction/TransactionForm';
import TransactionHistory from './components/transaction/TransactionHistory';

const App = () => {
  return (
    <Router>

      {/* ── Global systems — always mounted ─────────────────── */}
      <GlobalLoadingOverlay />   {/* full page loading overlay  */}
      <GlobalErrorDisplay   />   {/* persistent error banner    */}
      <ToastContainer       />   {/* temporary toast messages   */}

      {/* ── Pages ───────────────────────────────────────────── */}
      <Routes>
        <Route path="/"         element={<WalletDashboard />}   />
        <Route path="/generate" element={<KeyGenerationForm />} />
        <Route path="/send"     element={<TransactionForm />}   />
        <Route path="/history"  element={<TransactionHistory />}/>
      </Routes>

    </Router>
  );
};

export default App;
