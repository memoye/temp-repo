import { PasswordCreationForm } from "@/app/(connect)/onboarding/_components/password-creation-form";
import type { Metadata } from "next";

type CreatePasswordPageProps = {
  searchParams: Promise<{ code: string }>;
};

export const metadata: Metadata = {
  title: "Create Password",
};

export default async function CreatePasswordPage({ searchParams }: CreatePasswordPageProps) {
  const search = await searchParams;
  const code = decodeURI(search.code as string).replace(/ /g, "+");

  return (
    <div className="flex w-full flex-col justify-center space-y-6 px-4 pb-12 md:mx-auto md:max-w-md lg:pb-32">
      <div className="mb-5 flex flex-col space-y-2 pt-3 text-center md:mb-8 xl:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
          Create your password
        </h1>
      </div>

      <PasswordCreationForm code={code} />
    </div>
  );
}
