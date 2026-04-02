import { ReactNode } from "react";
import { InfoSidebar } from "@/widgets/infoSidebar";
import OtherNav from "@/widgets/otherNav/ui/OtherNav";
import { Metadata } from "next";

type OtherLayoutProps = {
  children: ReactNode;
};
export const metadata: Metadata = {
  title: "Light Time",
  description: "Большой каталог светильников и ламп для вашего дома",
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
