interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  return (
    <div className="relative rounded-xl border border-red-500/30 bg-red-950/40
                    backdrop-blur-sm p-4 flex items-start gap-3 my-4
                    shadow-[0_0_20px_rgba(239,68,68,0.15)]
                    hover:shadow-[0_0_28px_rgba(239,68,68,0.25)]
                    transition-shadow duration-300">

      {/* red glow bar on left */}
      <div className="absolute left-0 top-3 bottom-3 w-[3px]
                      bg-red-500 rounded-full
                      shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

      <div className="ml-2 flex-1">
        <p className="text-xs font-mono font-bold text-red-400
                      uppercase tracking-widest mb-1">
          Error
        </p>
        <p className="text-sm text-red-300">{message}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 text-xs font-mono
                     border border-red-500/40 hover:border-red-400
                     px-2 py-1 rounded-md transition-all duration-200
                     hover:bg-red-500/10"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;