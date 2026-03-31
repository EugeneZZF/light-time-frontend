import { ReactNode } from "react";
import { InfoSidebar } from "@/widgets/infoSidebar";
import OtherNav from "@/widgets/otherNav/ui/OtherNav";

type OtherLayoutProps = {
  children: ReactNode;
};

export default function OtherLayout({ children }: OtherLayoutProps) {
  return (
    <section className="flex w-full text-black px-[40px] min-h-[470px] mb-[200px]">
      <InfoSidebar />
      <div className="ml-[44px] w-[730px] pt-[23px]">
        <OtherNav></OtherNav>
        {children}
      </div>
    </section>
  );
}
