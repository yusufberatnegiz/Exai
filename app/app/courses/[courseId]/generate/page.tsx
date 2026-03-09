import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GenerateForm from "../generate-form";
import { generateQuestions } from "../generate-actions";

export default async function GeneratePage({
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

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-3">
          <Link href="/app" className="text-gray-400 hover:text-gray-700 transition-colors">
            Dashboard
          </Link>
          <span className="text-gray-200">/</span>
          <Link
            href={`/app/courses/${courseId}`}
            className="text-gray-400 hover:text-gray-700 transition-colors truncate max-w-[160px]"
          >
            {course.title}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-500">Generate Practice</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Practice</h1>
        <p className="mt-1 text-sm text-gray-400">
          Upload a past exam PDF or paste exam questions to set the style and
          instructions. Questions are generated from your source materials.
        </p>
      </div>

      {/* Generate form */}
      <section className="space-y-4 pt-6 border-t border-gray-100">
        <GenerateForm courseId={courseId} action={generateQuestions} />
      </section>
    </main>
  );
}
