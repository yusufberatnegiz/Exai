"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type UpgradePlanState = { error: string } | { success: true } | null;

/**
 * Placeholder — simulates upgrading the user's account plan to 'premium'.
 * Will be replaced by a real Stripe subscription checkout in the billing milestone.
 */
export async function upgradePlan(): Promise<UpgradePlanState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("profiles")
    .update({ plan: "premium" })
    .eq("user_id", user.id);

  if (error) {
    console.error("Upgrade plan error:", error);
    return { error: "Could not upgrade plan. Please try again." };
  }

  revalidatePath("/app/settings");
  return { success: true };
}

export async function deleteAccount(): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Delete account error:", error);
    return { error: "Could not delete account. Please try again." };
  }

  return { success: true };
}
