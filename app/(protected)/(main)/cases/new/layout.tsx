import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Case",
  description: "Create a new case",
};

export default function NewCaseLayout({ children }: { children?: React.ReactNode }) {
  return children;
}
