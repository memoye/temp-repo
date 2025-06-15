import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/app/_components/login-button";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 rounded-md md:border md:px-5 md:py-6 md:shadow lg:px-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex items-center justify-center rounded-md">
                  <Logo iconOnly className="[&>img]:size-10" />
                </div>
                <span className="sr-only">Chronica.</span>
              </Link>
              <h1 className="text-brand text-center text-xl font-bold">
                Welcome to Chronica<span className="text-sm font-light">&trade;</span>
              </h1>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/onboarding" className="underline">
                  Sign up
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3 [&_form]:!block">
              <Button className="relative h-12 w-full text-lg font-medium" asChild>
                <LoginButton>
                  <span className="max-[250px]:hidden">Continue to</span> Login
                  <ArrowRightIcon className="size-5" />
                </LoginButton>
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-balance text-muted-foreground [&_a]:underline [&_a]:hover:text-primary">
            By clicking &apos;continue&apos;, you agree to our{" "}
            <Link target="_blank" href="/terms-of-service">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link target="_blank" href="/terms-of-service#privacy">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
