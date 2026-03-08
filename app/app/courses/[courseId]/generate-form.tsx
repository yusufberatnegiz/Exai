"use client";

import { useState, useTransition, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateState } from "./generate-actions";

type Props = {
  courseId: string;
  action: (prevState: GenerateState, formData: FormData) => Promise<GenerateState>;
};

export default function GenerateForm({ courseId, action }: Props) {
  const [state, setState] = useState<GenerateState>(null);
  const [isPending, startTransition] = useTransition();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(null, formData);
      setState(result);
      if (result && "success" in result) {
        setFileNames([]);
        formRef.current?.reset();
      }
    });
  }

  const fileLabel =
    fileNames.length === 0
      ? "No files chosen"
      : fileNames.length === 1
      ? fileNames[0]
      : `${fileNames.length} files selected`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />

      {/* Past exam files - multiple, PDF or image */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">
          Past exam files (PDF or image)
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
              hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Choose files
          </button>
          <span className="text-sm text-gray-400 truncate max-w-xs">
            {fileLabel}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          name="examFiles"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          disabled={isPending}
          onChange={(e) =>
            setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))
          }
        />
        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG - max 10 MB each</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-gray-300">
        <div className="flex-1 h-px bg-gray-100" />
        or paste exam text
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Pasted exam text */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">
          Paste past exam questions
        </label>
        <Textarea
          name="pastedText"
          placeholder="Paste the exam questions here..."
          disabled={isPending}
          rows={5}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-gray-300">
        <div className="flex-1 h-px bg-gray-100" />
        instructions
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Custom instructions */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">
          Question set instructions{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Textarea
          name="instructions"
          placeholder="e.g. Focus on dynamic programming. Make questions harder. Include a proof question."
          disabled={isPending}
          rows={3}
        />
      </div>

      <p className="text-xs text-gray-400">
        Provide at least one file or paste text. Your uploaded course materials
        are used as the knowledge base.
      </p>

      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-600">Question set generated successfully.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white
          hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Generating..." : "Generate Questions"}
      </button>
    </form>
  );
}
