"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteQuestionSet(
  setId: string,
  courseId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("question_sets")
    .delete()
    .eq("id", setId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete question set error:", error);
    return { error: "Could not delete question set." };
  }

  revalidatePath(`/app/courses/${courseId}/sets`);
  return { success: true };
}

export async function renameQuestionSet(
  setId: string,
  courseId: string,
  title: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const trimmed = title.trim();
  if (!trimmed) return { error: "Title cannot be empty." };

  const { error } = await supabase
    .from("question_sets")
    .update({ title: trimmed })
    .eq("id", setId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Rename question set error:", error);
    return { error: "Could not rename question set." };
  }

  revalidatePath(`/app/courses/${courseId}/sets`);
  return { success: true };
}
