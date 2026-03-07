"use client";

import { useState, useTransition } from "react";
import type { GenerateState } from "./generate-actions";

type Props = {
  courseId: string;
  action: (prevState: GenerateState, formData: FormData) => Promise<GenerateState>;
  hasReadyDocs: boolean;
};

export default function GenerateForm({ courseId, action, hasReadyDocs }: Props) {
  const [state, setState] = useState<GenerateState>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(null, formData);
      setState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="courseId" value={courseId} />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending || !hasReadyDocs}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white
            hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Generating…" : "Generate Questions"}
        </button>

        {!hasReadyDocs && (
          <p className="text-xs text-gray-400">
            Upload and process a document first.
          </p>
        )}
      </div>

      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-600">
          Question set generated successfully.
        </p>
      )}
    </form>
  );
}
