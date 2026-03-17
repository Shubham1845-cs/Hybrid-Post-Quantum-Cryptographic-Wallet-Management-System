// ─── Base skeleton block — shimmer placeholder for any shape ─────────────────
import { cn } from '../../utils/cn';

interface SkeletonBlockProps {
  width?:  string; // tailwind width class e.g. "w-full", "w-32"
  height?: string; // tailwind height class e.g. "h-4", "h-10"
  rounded?: string; // tailwind rounded class
}

const SkeletonBlock = ({
  width   = 'w-full',
  height  = 'h-4',
  rounded = 'rounded-lg',
}: SkeletonBlockProps) => {
  return (
    <div
      className={cn(
        width, height, rounded,
        // shimmer effect using your existing animate-shimmer
        'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
        'bg-[length:200%_100%] animate-shimmer',
      )}
    />
  );
};

export default SkeletonBlock;