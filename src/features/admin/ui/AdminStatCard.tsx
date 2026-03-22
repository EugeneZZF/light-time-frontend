type AdminStatCardProps = {
  hint: string;
  title: string;
  value: string | number;
};

export default function AdminStatCard({
  hint,
  title,
  value,
}: AdminStatCardProps) {
  return (
    <div className="rounded-[24px] border border-[#d7e1d9] bg-white/80 p-5 shadow-[0_14px_30px_rgba(23,53,35,0.05)]">
      <div className="text-[13px] uppercase tracking-[0.18em] text-[#7a8f7e]">
        {title}
      </div>
      <div className="mt-3 text-[34px] font-bold leading-none text-[#173523]">
        {value}
      </div>
      <div className="mt-3 text-[14px] text-[#5f7565]">{hint}</div>
    </div>
  );
}
