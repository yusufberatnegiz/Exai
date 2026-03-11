import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CreateCourseForm from "../create-course-form";
import { createCourse } from "../actions";

export default async function NewCoursePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return (
    <main className="max-w-lg mx-auto px-6 py-10 space-y-6">
      <div>
        <Link
          href="/app"
          className="text-sm text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
        >
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">New Course</h1>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-5">
        <CreateCourseForm action={createCourse} />
      </div>
    </main>
  );
}
