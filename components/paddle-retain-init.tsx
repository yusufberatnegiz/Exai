"use client";

import { useEffect } from "react";

type Props = {
  email: string;
  paddleCustomerId?: string | null;
};

/**
 * Passes logged-in user details to Paddle Retain for in-app payment
 * recovery notifications. Must be inside the authenticated app layout.
 */
export default function PaddleRetainInit({ email, paddleCustomerId }: Props) {
  useEffect(() => {
    function init() {
      try {
        const retain = window.Paddle?.Retain;
        if (!retain) return;
        // profitwell.js may be blocked by ad blockers - guard before calling
        if (typeof retain.initializeProfiling !== "function") return;
        retain.initializeProfiling({
          email,
          ...(paddleCustomerId ? { paddleCustomerId } : {}),
        });
      } catch {
        // Silently ignore - Retain is non-critical
      }
    }

    // Paddle script may still be loading - retry until available
    if (window.Paddle?.Retain) {
      init();
    } else {
      const t = setTimeout(init, 2000);
      return () => clearTimeout(t);
    }
  }, [email, paddleCustomerId]);

  return null;
}
