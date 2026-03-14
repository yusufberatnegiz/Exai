import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaddleServerConfig } from "@/lib/paddle-server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_APP_URL ?? "https://www.exai.study"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("paddle_customer_id")
    .eq("user_id", user.id)
    .single();

  const customerId = profile?.paddle_customer_id as string | null | undefined;

  if (!customerId) {
    // No billing record - send to settings
    return NextResponse.redirect(
      new URL("/app/settings", process.env.NEXT_PUBLIC_APP_URL ?? "https://www.exai.study")
    );
  }

  let config;
  try {
    config = getPaddleServerConfig();
  } catch {
    return NextResponse.redirect(
      new URL("/app/settings", process.env.NEXT_PUBLIC_APP_URL ?? "https://www.exai.study")
    );
  }

  const baseUrl =
    config.env === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";

  const res = await fetch(`${baseUrl}/customers/${customerId}/portal-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    console.error("[paddle/portal] Failed to create portal session:", await res.text());
    return NextResponse.redirect(
      new URL("/app/settings", process.env.NEXT_PUBLIC_APP_URL ?? "https://www.exai.study")
    );
  }

  const json = await res.json();
  const portalUrl = json?.data?.urls?.general?.overview as string | undefined;

  if (!portalUrl) {
    console.error("[paddle/portal] No portal URL in response:", JSON.stringify(json));
    return NextResponse.redirect(
      new URL("/app/settings", process.env.NEXT_PUBLIC_APP_URL ?? "https://www.exai.study")
    );
  }

  return NextResponse.redirect(portalUrl);
}
