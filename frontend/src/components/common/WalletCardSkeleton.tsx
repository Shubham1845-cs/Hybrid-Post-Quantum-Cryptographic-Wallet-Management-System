// ─── Skeleton that matches WalletCard layout exactly ─────────────────────────
// Shown while wallet data is loading — layout stays stable

import SkeletonBlock from './SkeletonBlock';

const WalletCardSkeleton = () => {
  return (
    <div className="relative w-full max-w-md rounded-2xl p-6
                    bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950
                    border border-white/[0.06]
                    shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

      <div className="flex items-center justify-between mb-6">
        <SkeletonBlock width="w-36" height="h-3" />
        <SkeletonBlock width="w-9"  height="h-6" rounded="rounded-md" />
      </div>

      {/* mimics balance label */}
      <SkeletonBlock width="w-16" height="h-3" />
      <div className="mt-2 mb-6">
        {/* mimics large balance number */}
        <SkeletonBlock width="w-48" height="h-10" />
      </div>

      {/* mimics address box */}
      <div className="rounded-xl border border-white/[0.05]
                      bg-white/[0.02] px-4 py-3 space-y-2">
        <SkeletonBlock width="w-24" height="h-2" />
        <SkeletonBlock width="w-full" height="h-4" />
      </div>

    </div>
  );
};

export default WalletCardSkeleton;