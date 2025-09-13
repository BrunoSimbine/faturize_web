"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/auth"; // ajuste o caminho se necessário

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
