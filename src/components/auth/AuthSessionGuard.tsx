"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export function AuthSessionGuard() {
  useEffect(() => {
    const requireSession = () => {
      if (!Cookies.get("token")) {
        window.location.replace("/login");
      }
    };

    requireSession();
    window.addEventListener("pageshow", requireSession);
    window.addEventListener("focus", requireSession);
    return () => {
      window.removeEventListener("pageshow", requireSession);
      window.removeEventListener("focus", requireSession);
    };
  }, []);

  return null;
}
