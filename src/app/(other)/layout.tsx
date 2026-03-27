import { ReactNode } from "react";
import { InfoSidebar } from "@/widgets/infoSidebar";

type OtherLayoutProps = {
  children: ReactNode;
};

export default function OtherLayout({ children }: OtherLayoutProps) {
  return (
    <section className="flex w-full text-black px-[40px]">
      <InfoSidebar />
      <div className="ml-[44px] w-[730px] pt-[23px]">{children}</div>
    </section>
  );
}
