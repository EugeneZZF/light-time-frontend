import { ReactNode } from "react";

export function AdminLabel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] font-bold text-[#23402b]">{label}</span>
      {children}
    </label>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-[14px] border border-[#cedad1] bg-white px-4 py-3 text-[15px] text-[#183524] outline-none transition focus:border-[#28553a] focus:ring-4 focus:ring-[#28553a15] ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`min-h-[120px] rounded-[14px] border border-[#cedad1] bg-white px-4 py-3 text-[15px] text-[#183524] outline-none transition focus:border-[#28553a] focus:ring-4 focus:ring-[#28553a15] ${props.className ?? ""}`}
    />
  );
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={`rounded-[14px] border border-[#cedad1] bg-white px-4 py-3 text-[15px] text-[#183524] outline-none transition focus:border-[#28553a] focus:ring-4 focus:ring-[#28553a15] w-full ${props.className ?? ""}`}
    />
  );
}
