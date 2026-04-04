import type { Metadata } from "next";
import "swiper/css";
import "./globals.css";
import AppChrome from "@/shared/ui/AppChrome";

export const metadata: Metadata = {
  title: "Light Time",
  description: "Большой каталог светильников и ламп для вашего дома",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
