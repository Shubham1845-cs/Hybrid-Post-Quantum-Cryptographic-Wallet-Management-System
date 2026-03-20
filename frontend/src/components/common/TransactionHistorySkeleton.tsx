// ─── Full skeleton for transaction history panel ──────────────────────────────
// Shows 5 placeholder rows while history loads

import TransactionRowSkeleton from './TransactionRowSkeleton';
import SkeletonBlock          from './SkeletonBlock';

const TransactionHistorySkeleton = () => {
  return (
    <div className="relative w-full max-w-md rounded-2xl overflow-hidden
                    border border-white/[0.08]
                    bg-gradient-to-b from-slate-900/90 to-slate-950/90">

      {/* mimics header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] space-y-4">

        {/* title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock width="w-8" height="h-8" rounded="rounded-lg" />
            <div className="space-y-1.5">
              <SkeletonBlock width="w-40" height="h-3" />
              <SkeletonBlock width="w-24" height="h-2" />
            </div>
          </div>
          <SkeletonBlock width="w-8" height="h-8" rounded="rounded-lg" />
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/[0.05]
                          bg-white/[0.02] px-3 py-2 space-y-1.5">
            <SkeletonBlock width="w-20" height="h-2" />
            <SkeletonBlock width="w-28" height="h-5" />
            <SkeletonBlock width="w-16" height="h-2" />
          </div>
          <div className="rounded-xl border border-white/[0.05]
                          bg-white/[0.02] px-3 py-2 space-y-1.5">
            <SkeletonBlock width="w-20" height="h-2" />
            <SkeletonBlock width="w-28" height="h-5" />
            <SkeletonBlock width="w-16" height="h-2" />
          </div>
        </div>

        {/* filter tabs */}
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} width="flex-1" height="h-7" rounded="rounded-lg" />
          ))}
        </div>
      </div>

      {/* 5 placeholder rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <TransactionRowSkeleton key={i} />
      ))}

    </div>
  );
};

export default TransactionHistorySkeleton;