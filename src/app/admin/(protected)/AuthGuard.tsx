"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const sessionValue = localStorage.getItem("admin_session");
    const sessionTimestamp = localStorage.getItem("admin_session_timestamp");

    const isSessionValid =
      sessionValue &&
      sessionTimestamp &&
      Date.now() - parseInt(sessionTimestamp) < 20 * 60 * 1000;

    if (!isSessionValid) {
      localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_session_timestamp");
      router.replace("/admin/login");
    } else {
      setIsValid(true);
    }
  }, []);

  // ⛔ пока проверка — ничего не рендерим
  if (!isValid) return null;

  return <>{children}</>;
}
