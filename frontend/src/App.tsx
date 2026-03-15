import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components for routing
const Dashboard = () => <div data-testid="dashboard">Wallet Dashboard (To be implemented)</div>;
const KeyGeneration = () => <div data-testid="keygen">Key Generation (To be implemented)</div>;
const TransactionForm = () => <div data-testid="txform">Transaction Form (To be implemented)</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <h1>Hybrid PQC Wallet System</h1>
          <nav>
            <a href="/">Dashboard</a> | <a href="/generate">Generate Keys</a> | <a href="/transfer">Transfer</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<KeyGeneration />} />
            <Route path="/transfer" element={<TransactionForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
