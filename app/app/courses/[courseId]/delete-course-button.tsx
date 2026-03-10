"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DeleteCourseState } from "../../actions";

type Props = {
  courseId: string;
  action: (courseId: string) => Promise<DeleteCourseState>;
};

export default function DeleteCourseButton({ courseId, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    startTransition(async () => {
      const result = await action(courseId);
      if (result && "error" in result) {
        setError(result.error);
        setConfirmed(false);
      } else {
        router.push("/app");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {confirmed && !isPending && (
        <button
          onClick={() => { setConfirmed(false); setError(null); }}
          className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40
          ${confirmed
            ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
            : "border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          }`}
      >
        {isPending ? "Deleting…" : confirmed ? "Confirm delete" : "Delete course"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
