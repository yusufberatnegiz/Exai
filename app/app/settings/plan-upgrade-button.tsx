"use client";

import { useState, useTransition } from "react";
import type { UpgradePlanState } from "./actions";

type Props = {
  action: () => Promise<UpgradePlanState>;
};

export default function PlanUpgradeButton({ action }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleUpgrade() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result && "error" in result) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 7 5.5 10.5 12 3" />
        </svg>
        Upgraded to Premium
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleUpgrade}
        disabled={isPending}
        className="px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-40"
      >
        {isPending ? "Upgrading..." : "Upgrade to Premium - $8/mo"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
