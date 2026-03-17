// ─── Skeleton that matches TransactionRow layout exactly ─────────────────────
// Shown while transaction history is loading

import SkeletonBlock from './SkeletonBlock';

const TransactionRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-3
                    border-b border-white/[0.04]">

      {/* mimics direction icon box */}
      <SkeletonBlock width="w-9" height="h-9" rounded="rounded-xl" />

      {/* mimics middle section */}
      <div className="flex-1 space-y-2">
        <SkeletonBlock width="w-20" height="h-3" />
        <SkeletonBlock width="w-36" height="h-3" />
      </div>

      {/* mimics right section */}
      <div className="flex flex-col items-end gap-1">
        <SkeletonBlock width="w-16" height="h-4" />
        <SkeletonBlock width="w-10" height="h-2" />
      </div>

    </div>
  );
};

export default TransactionRowSkeleton;