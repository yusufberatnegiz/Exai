"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { processSourceFile } from "@/lib/source-upload";

const CreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type CreateCourseState =
  | { error: string }
  | { success: true; courseId: string; fileErrors?: string[] }
  | null;

export async function createCourse(
  _prevState: CreateCourseState,
  formData: FormData
): Promise<CreateCourseState> {
  const parsed = CreateCourseSchema.safeParse({
    title: formData.get("title"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  // Free-plan course limit — premium users bypass
  const FREE_PLAN_MAX_COURSES = 2;
  const [{ data: profile }, { count: courseCount }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("user_id", user.id).single(),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);
  const isPremiumUser = profile?.plan != null && profile.plan !== "free";
  if (!isPremiumUser && (courseCount ?? 0) >= FREE_PLAN_MAX_COURSES) {
    return { error: `Free plan is limited to ${FREE_PLAN_MAX_COURSES} courses. Upgrade to create more.` };
  }

  const { data: course, error } = await supabase
    .from("courses")
    .insert({ title: parsed.data.title, user_id: user.id })
    .select("id")
    .single();

  if (error || !course) {
    console.error("Course creation error:", error);
    return { error: "Could not create course. Please try again." };
  }

  // Optional: process any source files uploaded during course creation
  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof File && f.size > 0);

  const fileErrors: string[] = [];
  for (const file of validFiles) {
    // New courses always start as free (is_premium = false)
    const err = await processSourceFile(supabase, file, user.id, course.id, false);
    if (err) fileErrors.push(err);
  }

  revalidatePath("/app");
  return {
    success: true,
    courseId: course.id,
    ...(fileErrors.length > 0 ? { fileErrors } : {}),
  };
}

export type DeleteCourseState = { error: string } | { success: true } | null;

export async function deleteCourse(
  courseId: string
): Promise<DeleteCourseState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete course error:", error);
    return { error: "Could not delete course. Please try again." };
  }

  revalidatePath("/app");
  return { success: true };
}
