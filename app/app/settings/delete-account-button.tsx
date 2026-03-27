"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteAccount } from "./actions";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (typed !== "DELETE") return;
    setLoading(true);
    setError(null);
    const result = await deleteAccount("DELETE");
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors underline underline-offset-2"
      >
        Delete account
      </button>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
      <p className="text-sm font-semibold text-red-700 dark:text-red-400">Delete account</p>
      <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
        This will permanently delete your account and all associated data including courses, question sets, and answers. This cannot be undone.
      </p>
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 dark:text-zinc-400">
          Type <span className="font-mono font-bold text-gray-700 dark:text-zinc-200">DELETE</span> to confirm
        </label>
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="DELETE"
          disabled={loading}
          className="w-full text-sm px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || typed !== "DELETE"}
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting..." : "Yes, delete my account"}
        </button>
        <button
          type="button"
          onClick={() => { setConfirming(false); setTyped(""); setError(null); }}
          disabled={loading}
          className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
