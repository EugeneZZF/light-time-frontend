import { ReactNode } from "react";

type ArticlesLayoutProps = {
  children: ReactNode;
};

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return children;
}
