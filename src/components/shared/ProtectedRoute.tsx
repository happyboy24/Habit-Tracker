"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/constants";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function subscribeToSession() {
  return () => {};
}

function getSessionSnapshot() {
  return window.localStorage.getItem(STORAGE_KEYS.session);
}

function getServerSessionSnapshot() {
  return null;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  const sessionSnapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  useEffect(() => {
    if (!sessionSnapshot) {
      router.replace("/login");
    }
  }, [router, sessionSnapshot]);

  if (!sessionSnapshot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9f4]">
        <p className="text-sm text-[#667085]">Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}
