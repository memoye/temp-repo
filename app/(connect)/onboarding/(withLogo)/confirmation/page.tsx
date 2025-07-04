import type { Metadata } from "next";
import Image from "next/image";
import { ResendLink } from "../../_components/resend-link";

type EmailConfirmationPageProps = {
  searchParams: Promise<{ email: string }>;
};

export const metadata: Metadata = {
  title: "Email Confirmation",
};

export default async function EmailConfirmationPage({
  searchParams,
}: EmailConfirmationPageProps) {
  const search = await searchParams;
  const userEmail = decodeURIComponent(search.email as string);

  return (
    <main className="mx-auto mt-14 h-full max-w-[727px] px-9 py-6 text-center md:mt-10 lg:mt-4 xl:mt-12">
      <Image
        src={"/assets/new-email.svg"}
        alt="New Confirmation Email"
        className="mx-auto mb-12 select-none"
        draggable={false}
        width={120}
        height={90}
      />
      <h1 className="mb-4 text-[2rem] font-semibold">Email Confirmation</h1>
      <p className="text-foreground-light font-medium text-pretty">
        We&apos;ve sent a verification link to&nbsp;
        {userEmail ? (
          <span className="max-w-full break-words text-foreground">{userEmail}</span>
        ) : (
          "you"
        )}
        . Click on the link to set your password. The code expires shortly, so please enter it
        soon.
      </p>
      <ResendLink email={userEmail} />
    </main>
  );
}
