import type { ReactNode } from "react";
import { SiteHeader } from "../_components/site-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
