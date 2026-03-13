"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
