"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { processSourceFile } from "@/lib/source-upload";

export type UploadState = { error: string } | { success: true } | null;

/**
 * Upload one or more source material files for a course.
 * Accepts .pdf, .docx, .ppt, .pptx — multiple files at once.
 * Pasted text is no longer handled here; use the generate section instead.
 */
export async function uploadSourceMaterials(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const courseId = formData.get("courseId") as string;

  if (!z.string().uuid().safeParse(courseId).success) {
    return { error: "Invalid course." };
  }

  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof File && f.size > 0);

  if (validFiles.length === 0) {
    return { error: "Select at least one file." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();
  if (!course) return { error: "Course not found." };

  const errors: string[] = [];
  for (const file of validFiles) {
    const err = await processSourceFile(supabase, file, user.id, courseId);
    if (err) errors.push(err);
  }

  revalidatePath(`/app/courses/${courseId}`);

  if (errors.length === validFiles.length) {
    // All files failed
    return { error: errors.join("\n") };
  }
  if (errors.length > 0) {
    // Partial success
    return { error: `Some files failed:\n${errors.join("\n")}` };
  }
  return { success: true };
}
