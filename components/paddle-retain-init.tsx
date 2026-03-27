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
      if (!window.Paddle?.Retain) return;
      window.Paddle.Retain.initializeProfiling({
        email,
        ...(paddleCustomerId ? { paddleCustomerId } : {}),
      });
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
