"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { processSourceFile } from "@/lib/source-upload";

export type UpgradeCourseState = { error: string } | { success: true } | null;

/**
 * Placeholder upgrade action — simulates payment by setting is_premium = true.
 * Will be replaced by a real Stripe checkout flow in the billing milestone.
 */
export async function upgradeCourse(courseId: string): Promise<UpgradeCourseState> {
  if (!z.string().uuid().safeParse(courseId).success) {
    return { error: "Invalid course." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("courses")
    .update({ is_premium: true })
    .eq("id", courseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Course upgrade error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/app/courses/${courseId}`);
  return { success: true };
}

export type UploadState = { error: string } | { success: true } | null;
export type DeleteDocState = { error: string } | { success: true } | null;

export async function deleteDocument(documentId: string): Promise<DeleteDocState> {
  if (!z.string().uuid().safeParse(documentId).success) {
    return { error: "Invalid document." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Fetch doc to get storage path and verify ownership via course
  const { data: doc } = await supabase
    .from("documents")
    .select("id, storage_path, course_id, courses!inner(user_id)")
    .eq("id", documentId)
    .single();

  if (!doc) return { error: "Document not found." };

  const course = Array.isArray(doc.courses) ? doc.courses[0] : doc.courses;
  if ((course as { user_id: string }).user_id !== user.id) {
    return { error: "Not authorized." };
  }

  // Delete from storage if path exists
  if (doc.storage_path) {
    await supabase.storage.from("exam-uploads").remove([doc.storage_path]);
  }

  // Delete DB record (cascades chunks/jobs)
  const { error } = await supabase.from("documents").delete().eq("id", documentId);
  if (error) return { error: "Failed to delete document." };

  revalidatePath(`/app/courses/${doc.course_id}/materials`);
  return { success: true };
}

/**
 * Upload one or more source material files for a course.
 * Accepts .pdf, .docx, .ppt, .pptx - multiple files at once.
 * Pasted text is no longer handled here; use the generate section instead.
 */
export async function uploadSourceMaterials(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
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

  const [{ data: course }, { data: profile }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, is_premium")
      .eq("id", courseId)
      .eq("user_id", user.id)
      .single(),
    supabase.from("profiles").select("plan").eq("user_id", user.id).single(),
  ]);
  if (!course) return { error: "Course not found." };

  const isAccountPremium = profile?.plan != null && profile.plan !== "free";
  const isPremium = isAccountPremium || (course.is_premium ?? false);

  const errors: string[] = [];
  for (const file of validFiles) {
    const err = await processSourceFile(supabase, file, user.id, courseId, isPremium);
    if (err) errors.push(err);
  }

  revalidatePath(`/app/courses/${courseId}`);

  if (errors.length === validFiles.length) {
    return { error: errors.join("\n") };
  }
  if (errors.length > 0) {
    return { error: `Some files could not be uploaded:\n${errors.join("\n")}` };
  }
  return { success: true };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
