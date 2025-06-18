import { PageWrapper } from "@/app/_components/page-wrapper";
import Link from "next/link";

export const metadata = {
  title: "Cases",
};

export default function CasesPage() {
  return (
    <PageWrapper>
      <h1>cases</h1>
      <Link href="/cases/new">new</Link>
    </PageWrapper>
  );
}
