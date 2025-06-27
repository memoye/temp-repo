import { SidebarProvider } from "@/components/ui/sidebar";

type ProtectedLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
