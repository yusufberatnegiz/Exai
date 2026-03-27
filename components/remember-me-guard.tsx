"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Signs out users who chose "don't remember me" when the browser is closed.
 * Logic:
 * - If localStorage has exai_no_remember=1 (user unchecked remember me)
 * - AND sessionStorage does NOT have exai_session_alive (browser was closed)
 * - Then sign out and redirect to /auth
 */
export default function RememberMeGuard() {
  const router = useRouter();

  useEffect(() => {
    const noRemember = localStorage.getItem("exai_no_remember") === "1";
    const sessionAlive = sessionStorage.getItem("exai_session_alive") === "1";

    if (noRemember && !sessionAlive) {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        localStorage.removeItem("exai_no_remember");
        router.push("/auth");
      });
    }
  }, [router]);

  return null;
}
