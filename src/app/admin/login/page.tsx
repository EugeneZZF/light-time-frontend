"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/admin");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setNextPath(searchParams.get("next") ?? "/admin");
  }, []);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        message?: string;
        accessToken?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Не удалось войти.");
        return;
      }

      if (data.accessToken) {
        localStorage.setItem("admin_access_token", data.accessToken);
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError(
        "Не удалось выполнить вход. Проверьте соединение и попробуйте ещё раз.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[520px] items-center px-6 py-16">
      <div className="w-full overflow-hidden rounded-[28px] border border-[#d5e4d8] shadow-[0_25px_80px_rgba(44,84,35,0.12)]">
        <div className="border-b border-[#dce9de] px-8 py-7">
          <p className="text-[13px] uppercase tracking-[0.24em] text-[#64836a]">
            Light Time
          </p>
          <h1 className="mt-3 text-[34px] font-bold leading-none text-[#153a1e]">
            Вход в админ панель
          </h1>
          <p className="mt-3 text-[16px] leading-[1.4] text-[#49614f]">
            Авторизуйтесь, чтобы открыть раздел{" "}
            <span className="font-bold">/admin</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-8">
          <label className="flex flex-col gap-2">
            <span className="text-[15px] font-bold text-[#23422b]">Почта</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-[14px] border border-[#c7d8cb] bg-white px-4 py-3 text-[16px] outline-none transition focus:border-[#2f7d44] focus:ring-4 focus:ring-[#2f7d4420]"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[15px] font-bold text-[#23422b]">Пароль</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-[14px] border border-[#c7d8cb] bg-white px-4 py-3 text-[16px] outline-none transition focus:border-[#2f7d44] focus:ring-4 focus:ring-[#2f7d4420]"
              placeholder="Введите пароль"
              required
            />
          </label>

          {error ? (
            <div className="rounded-[14px] border border-[#f1c8c8] bg-[#fff4f4] px-4 py-3 text-[14px] text-[#a03535]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-[16px] bg-[linear-gradient(135deg,#0d5b27_0%,#1f8d42_100%)] px-5 py-3 text-[17px] font-bold text-white transition hover:scale-[1.01] hover:shadow-[0_16px_30px_rgba(31,141,66,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
}
