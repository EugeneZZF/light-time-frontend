import { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};
export const metadata: Metadata = {
  title: "Админка",
  description: "Админ панель",
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return children;
}
