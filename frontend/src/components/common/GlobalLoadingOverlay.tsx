import { useAppContext } from '../../context/AppContext';

const GlobalLoadingOverlay = () => {
  const { state } = useAppContext();

  if (!state.loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080612]/80 backdrop-blur-sm">
      <div className="rounded-2xl border border-violet-500/20 bg-slate-950/80 px-6 py-5 shadow-[0_0_28px_rgba(124,58,237,0.25)]">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400 animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-widest text-violet-300">
            {state.loadingContext ? `Loading ${state.loadingContext}` : 'Loading'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;