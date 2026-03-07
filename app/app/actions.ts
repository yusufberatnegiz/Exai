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

  const { data: course, error } = await supabase
    .from("courses")
    .insert({ title: parsed.data.title, user_id: user.id })
    .select("id")
    .single();

  if (error || !course) {
    return { error: error?.message ?? "Failed to create course." };
  }

  // Optional: process any source files uploaded during course creation
  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof File && f.size > 0);

  const fileErrors: string[] = [];
  for (const file of validFiles) {
    const err = await processSourceFile(supabase, file, user.id, course.id);
    if (err) fileErrors.push(err);
  }

  revalidatePath("/app");
  return {
    success: true,
    courseId: course.id,
    ...(fileErrors.length > 0 ? { fileErrors } : {}),
  };
}
