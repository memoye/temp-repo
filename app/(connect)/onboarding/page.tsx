import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { SignUpForm } from "@/app/_components/signup-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingDots } from "@/components/ui/loading-dots";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account on Chronica.",
};

export default async function SignUpPage() {
  return (
    <div className="relative flex h-dvh items-center overflow-hidden overflow-y-auto lg:px-0">
      <div className="sticky inset-y-0 hidden h-dvh w-full flex-1 lg:block xl:max-w-[653px]">
        <div className="relative hidden h-full flex-col bg-primary px-10 py-16 text-primary-foreground lg:flex">
          <div className="absolute inset-0" />
          <div className="relative z-20 flex flex-col items-center space-y-[5.125rem] text-center text-lg font-semibold lg:text-3xl">
            <p className="mx-auto">
              A Simple way to manage <br /> everything about your firm.
            </p>

            <div className="relative mr-10">
              <Image
                src={"/assets/dashboard-overview.png"}
                alt="Chronica dashboard overview "
                className="rounded-lg duration-1000 select-none"
                draggable={false}
                width={541}
                height={570}
              />

              <div className="absolute -right-8 bottom-5 h-[150px] w-[150px] rounded-lg bg-white xl:h-[282px] xl:w-[303px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="@container/signup-side relative mx-4 flex h-full flex-1 flex-col md:mx-6">
        <header className="sticky top-0 right-4 z-50 flex items-center justify-between gap-4 bg-background px-2 py-3">
          <Link href="/">
            <Logo className="lg:[&>img]:h-10" />
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {/* @2xl/signup-side:bg-red-500 */}
          <div className="mx-auto flex w-full max-w-3xl flex-col justify-center space-y-6 px-4 pb-6 lg:mx-0 lg:pb-16">
            <h1 className="mt-2 mb-2! space-y-2 text-xl font-semibold tracking-tight md:text-2xl">
              Create an account
              <span className="sr-only">
                &nbsp;on&nbsp;<span className="text-primary">Chronica</span>
              </span>
            </h1>
            <p className="text-sm">
              Already have an account,{" "}
              <Link className="text-primary hover:underline" href="/login">
                Login
              </Link>
            </p>

            <Suspense
              fallback={
                <div className="grid h-full min-h-[calc(100dvh-12rem)] w-full place-items-center">
                  <LoadingDots className="text-primary" animation="pulse" />
                </div>
              }
            >
              <SignUpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
