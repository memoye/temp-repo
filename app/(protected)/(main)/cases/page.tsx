import Link from "next/link";

export const metadata = {
  title: "Cases",
};

export default function CasesPage() {
  return (
    <>
      <h1>cases</h1>
      <Link href="/cases/new">new</Link>
    </>
  );
}
