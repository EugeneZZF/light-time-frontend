import { ReactNode } from "react";

type AdminSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminSurface({
  children,
  className,
}: AdminSurfaceProps) {
  return (
    <div
      className={`rounded-[24px] border border-[#d7e1d9] bg-white/82 p-5 shadow-[0_16px_30px_rgba(23,53,35,0.05)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
