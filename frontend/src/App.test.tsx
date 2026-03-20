import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing and shows the header', () => {
    render(<App />);
    expect(screen.getByText(/Hybrid PQC Wallet System/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Keys/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfer/i)).toBeInTheDocument();
  });
});
