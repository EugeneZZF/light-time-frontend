"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // удаляем токены
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_session");

    // редирект
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-[16px] border border-[#d9e3db] bg-white px-4 py-3 text-[15px] font-bold text-[#173523] transition hover:border-[#9bb9a2] hover:bg-[#f7fbf8]"
    >
      Выйти
    </button>
  );
}
