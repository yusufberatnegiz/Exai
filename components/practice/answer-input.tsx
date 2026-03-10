"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Question } from "./types";
import type { CodingEditorProps } from "./coding-editor";

const CodingEditorDynamic = dynamic(() => import("./coding-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
      Loading editor…
    </div>
  ),
}) as React.ComponentType<CodingEditorProps>;

export type AnswerInputProps = {
  question: Question;
  answer: string;
  isSubmitted: boolean;
  isPending: boolean;
  onChange: (val: string) => void;
  onCmdEnter?: () => void;
};

export function AnswerInput({
  question,
  answer,
  isSubmitted,
  isPending,
  onChange,
  onCmdEnter,
}: AnswerInputProps) {
  const disabled = isSubmitted || isPending;

  if (question.question_type === "tf") {
    const choices = question.choices?.length === 2 ? question.choices : ["True", "False"];
    const selectedStyles = [
      "border-emerald-500 bg-emerald-50 text-emerald-700",
      "border-red-400 bg-red-50 text-red-700",
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {choices.map((opt, i) => {
          const selected = answer === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={`py-4 rounded-xl text-sm font-semibold border-2 transition-all
                ${
                  selected
                    ? selectedStyles[i]
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.question_type === "mcq" && question.choices && question.choices.length > 0) {
    return (
      <div className="space-y-2">
        {question.choices.map((opt, i) => {
          const selected = answer === opt;
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all
                ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                  ${selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {letter}
              </span>
              <span
                className={`text-sm leading-relaxed ${
                  selected ? "text-blue-800 font-medium" : "text-gray-700"
                }`}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.question_type === "coding") {
    return (
      <CodingEditorDynamic
        value={answer}
        onChange={onChange}
        disabled={disabled}
        language="javascript"
        onCmdEnter={onCmdEnter}
      />
    );
  }

  return <OpenTextarea value={answer} onChange={onChange} disabled={disabled} />;
}

function OpenTextarea({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Write your answer here..."
      rows={4}
      style={{ overflow: "hidden" }}
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900
        leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20
        focus:border-blue-400 transition-colors placeholder:text-gray-400
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
    />
  );
}
