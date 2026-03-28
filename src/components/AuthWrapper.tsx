"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import type { ReactNode } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <LoginModal />
    </AuthProvider>
  );
}
