"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UploadState = { error: string } | { success: true } | null;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
];

export async function uploadDocument(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const courseId = formData.get("courseId") as string;
  const file = formData.get("file") as File | null;
  const pastedText = ((formData.get("pastedText") as string) ?? "").trim();

  // Validate courseId
  if (!z.string().uuid().safeParse(courseId).success) {
    return { error: "Invalid course." };
  }

  const hasFile = !!file && file.size > 0;
  const hasText = pastedText.length > 0;

  if (!hasFile && !hasText) {
    return { error: "Upload a file or paste exam text — cannot be empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Verify user owns the course
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();
  if (!course) return { error: "Course not found." };

  // Resolve file content, name, and MIME type
  let content: ArrayBuffer | string;
  let filename: string;
  let mimeType: string;

  if (hasFile && file) {
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File must be under 10 MB." };
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { error: "Only PDF, PNG, JPG, and plain text files are allowed." };
    }
    filename = file.name;
    mimeType = file.type;
    content = await file.arrayBuffer();
  } else {
    filename = "pasted-input.txt";
    mimeType = "text/plain";
    content = pastedText;
  }

  // Generate document ID upfront so we can build the path before the DB insert
  const documentId = randomUUID();
  const storagePath = `${user.id}/${courseId}/${documentId}/${filename}`;

  // Upload to storage first — if this fails, no DB row is left dangling
  const { error: storageError } = await supabase.storage
    .from("exam-uploads")
    .upload(storagePath, content, { contentType: mimeType });

  if (storageError) {
    return { error: `Storage error: ${storageError.message}` };
  }

  // Insert document row with the final path
  const { error: docError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: user.id,
    course_id: courseId,
    filename,
    mime_type: mimeType,
    storage_path: storagePath,
    status: "uploaded",
  });

  if (docError) {
    // Storage succeeded but DB failed — attempt to clean up the orphaned file
    await supabase.storage.from("exam-uploads").remove([storagePath]);
    return { error: `Database error: ${docError.message}` };
  }

  revalidatePath(`/app/courses/${courseId}`);
  return { success: true };
}
