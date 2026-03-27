import { ReactNode } from "react";
import { ArticlesNav } from "@/widgets/articlesNav";

type ArticlesLayoutProps = {
  children: ReactNode;
};

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return (
    <>
      <ArticlesNav />
      {children}
    </>
  );
}
