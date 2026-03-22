import { ReactNode } from "react";

type AdminPageHeaderProps = {
  action?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export default function AdminPageHeader({
  action,
  description,
  eyebrow = "Admin workspace",
  title,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[#d7e1d9] bg-[linear-gradient(135deg,#fffef7_0%,#f9fbf6_50%,#eff5ee_100%)] p-6 shadow-[0_20px_40px_rgba(23,53,35,0.07)] md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-[12px] uppercase tracking-[0.22em] text-[#708673]">
          {eyebrow}
        </div>
        <h1 className="mt-3 text-[34px] font-bold leading-none text-[#163523]">
          {title}
        </h1>
        <p className="mt-3 max-w-[720px] text-[16px] leading-[1.5] text-[#57705e]">
          {description}
        </p>
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}
