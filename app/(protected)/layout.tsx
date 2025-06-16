import { auth } from "@/auth";
import { SessionExpiryHandler } from "../_components/session-expiry-handler";
import { SidebarProvider } from "@/components/ui/sidebar";

type ProtectedLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth();

  return (
    <>
      <SessionExpiryHandler initialSession={session} />
      <SidebarProvider>{children}</SidebarProvider>
    </>
  );
}
