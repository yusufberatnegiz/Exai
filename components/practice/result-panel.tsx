import type { GradeResult } from "./types";

export function SolutionBox({ solution }: { solution: string }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 px-4 py-3 space-y-1.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Solution</p>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{solution}</p>
    </div>
  );
}

export default function ResultPanel({
  grade,
  solution,
  total,
}: {
  grade: GradeResult | null;
  solution: string;
  total: number;
}) {
  if (!grade) return null;

  if (grade.gradingFailed) {
    return (
      <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gray-50/60">
        <p className="text-sm text-gray-500">
          Answer saved, but grading is temporarily unavailable.
        </p>
        <SolutionBox solution={solution} />
      </div>
    );
  }

  const isCorrect = grade.is_correct;
  const maxPts = 100 / total;
  const earnedPts = (grade.score / 100) * maxPts;

  return (
    <div
      className={`border-t px-6 py-5 space-y-4 ${
        isCorrect ? "border-emerald-100 bg-emerald-50/50" : "border-red-100 bg-red-50/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
            isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          {earnedPts.toFixed(1)} / {maxPts.toFixed(1)} pts
        </span>
      </div>
      {grade.feedback && (
        <p className="text-sm text-gray-700 leading-relaxed">{grade.feedback}</p>
      )}
      <SolutionBox solution={solution} />
    </div>
  );
}
