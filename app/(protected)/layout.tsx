import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionExpiryHandler } from "../_components/session-expiry-handler";
import { RedirectHandler } from "../_components/redirect-handler";
import { SidebarProvider } from "@/components/ui/sidebar";

type ProtectedLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <SessionExpiryHandler initialSession={session} />
      <RedirectHandler />
      <SidebarProvider>{children}</SidebarProvider>
    </>
  );
}
