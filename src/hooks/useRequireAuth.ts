"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth() {
  const { user, setShowLoginModal } = useAuth();

  const requireAuth = useCallback((): boolean => {
    if (user) return true;
    setShowLoginModal(true);
    return false;
  }, [user, setShowLoginModal]);

  return { user, requireAuth };
}
