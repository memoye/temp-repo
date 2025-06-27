import { PageHeader } from "@/app/_components/page-header";
import { PageWrapper } from "@/app/_components/page-wrapper";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { QuickCasesStats } from "./_components/quick-cases-stats";
import CasesTable from "./_components/cases-table";
import { getCases } from "@/data/services/case-manager";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ perPage: string; page: string; title: string }>;
}) {
  const search = await searchParams;
  const initialData = await getCases({
    Page: Number(search.page ?? 1),
    PageSize: Number(search.perPage ?? 20),
    Keyword: search.title ?? "",
  });

  return (
    <PageWrapper className="space-y-6 py-4">
      <PageHeader
        title="Cases"
        description="Manage and track all cases"
        pageActions={
          <Button type="button" asChild>
            <Link href="/cases/new">
              <PlusIcon /> New Case
            </Link>
          </Button>
        }
      />

      <QuickCasesStats />

      <CasesTable initialData={initialData} />
    </PageWrapper>
  );
}
