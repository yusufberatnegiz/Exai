import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetsList from "./sets-list";

export default async function SetsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();

  if (!course) notFound();

  const { data: questionSets } = await supabase
    .from("question_sets")
    .select("id, title, created_at, mode, questions(count)")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-3">
          <Link href="/app" className="text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors">
            Dashboard
          </Link>
          <span className="text-gray-200 dark:text-zinc-700">/</span>
          <Link
            href={`/app/courses/${courseId}`}
            className="text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors truncate max-w-[160px]"
          >
            {course.title}
          </Link>
          <span className="text-gray-200 dark:text-zinc-700">/</span>
          <span className="text-gray-500 dark:text-zinc-400">Exam Sets</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Sets</h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-zinc-400">
          All generated question sets for this course.
        </p>
      </div>

      <section className="pt-6 border-t border-gray-100 dark:border-zinc-700">
        <SetsList
          sets={(questionSets ?? []).map((qs) => ({
            id: qs.id,
            title: qs.title,
            created_at: qs.created_at,
            mode: qs.mode,
            questions: Array.isArray(qs.questions) ? (qs.questions as { count: number }[]) : [],
          }))}
          courseId={courseId}
        />
      </section>
    </main>
  );
}
