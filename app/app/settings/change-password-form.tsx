"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Could not update password. Please try again.");
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirm("");
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 2000);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Change password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full max-w-xs">
      <input
        type="password"
        placeholder="New password (min. 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        disabled={loading}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-600 dark:text-emerald-400">Password updated.</p>}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); setPassword(""); setConfirm(""); }}
          disabled={loading}
          className="text-sm font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
