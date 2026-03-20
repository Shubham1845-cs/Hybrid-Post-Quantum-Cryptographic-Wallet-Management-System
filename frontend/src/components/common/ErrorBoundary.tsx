// ─── What this file does ──────────────────────────────────────────────────────
// Catches unexpected JavaScript errors anywhere in component tree
// Prevents entire app from crashing — shows friendly crash screen instead
// MUST be a class component — React requirement for error boundaries

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error:    Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // called when any child component throws
  // updates state to trigger crash UI render
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // logs error details (could send to error tracking service)
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  // reset — lets user try again
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080612]
                        flex flex-col items-center justify-center
                        gap-6 px-4">

          {/* crash icon */}
          <div className="w-20 h-20 rounded-2xl
                          bg-red-500/10 border border-red-500/20
                          flex items-center justify-center
                          shadow-[0_0_32px_rgba(239,68,68,0.2)]">
            <span className="text-3xl">💥</span>
          </div>

          {/* title */}
          <div className="text-center">
            <h1 className="text-xl font-mono font-bold text-slate-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm font-mono text-slate-500 max-w-sm">
              An unexpected error occurred. Your wallet data is safe.
            </p>
          </div>

          {/* error details — collapsed by default */}
          {this.state.error && (
            <details className="w-full max-w-md">
              <summary className="text-[10px] font-mono text-slate-600
                                  uppercase tracking-widest cursor-pointer
                                  hover:text-slate-400 transition-colors">
                Technical details
              </summary>
              <div className="mt-2 rounded-xl border border-white/6
                              bg-white/2 px-4 py-3">
                <p className="text-[10px] font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            </details>
          )}

          {/* recovery buttons */}
          <div className="flex gap-3">
            {/* try again — resets error boundary */}
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl font-mono font-bold
                         text-sm tracking-widest uppercase
                         bg-linear-to-r from-violet-600 to-indigo-600
                         hover:from-violet-500 hover:to-indigo-500
                         text-white transition-all duration-300
                         hover:scale-[1.02] active:scale-[0.98]
                         shadow-[0_4px_16px_rgba(124,58,237,0.4)]">
              Try Again
            </button>

            {/* reload — full page refresh */}
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl font-mono font-bold
                         text-sm tracking-widest uppercase
                         border border-white/10 bg-white/3
                         hover:bg-white/7 hover:border-white/15
                         text-slate-400 hover:text-slate-200
                         transition-all duration-300">
              Reload Page
            </button>
          </div>

        </div>
      );
    }

    // no error — render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;