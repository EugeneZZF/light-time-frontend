"use client";

import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type AppChromeProps = {
  children: ReactNode;
};

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[white]">
      <div className="content-container flex w-[1100px] flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
