import { BackButton } from "@/app/_components/back-button";
import { PageWrapper } from "@/app/_components/page-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Schedules",
};

export default function SchedulesPage() {
  return (
    <PageWrapper className="py-4">
      <BackButton />
    </PageWrapper>
  );
}
