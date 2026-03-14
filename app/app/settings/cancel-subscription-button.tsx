"use client";

import { useState } from "react";
import { cancelSubscription } from "./actions";

export default function CancelSubscriptionButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleCancel() {
    setLoading(true);
    setError(null);
    const result = await cancelSubscription();
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="text-sm text-muted-foreground">Subscription cancelled. Access continues until the end of your billing period.</p>;
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
      >
        Cancel subscription
      </button>
    );
  }

  return (
    <div className="space-y-2 text-right">
      <p className="text-xs text-gray-500 dark:text-zinc-400">Cancel at end of billing period?</p>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Yes, cancel"}
        </button>
        <button
          type="button"
          onClick={() => { setConfirming(false); setError(null); }}
          disabled={loading}
          className="text-sm font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
        >
          Keep
        </button>
      </div>
    </div>
  );
}
