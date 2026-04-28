"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getCurrentSession } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getCurrentSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
