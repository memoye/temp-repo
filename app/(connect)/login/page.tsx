"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/app/_components/login-button";
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";

export default function ImprovedLoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-10">
      {/* Background decoration */}
      <div className="bg-grid-black/[0.02] absolute inset-0 bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 opacity-20 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col gap-8 rounded-xl bg-card/50 px-6 py-8 shadow-lg backdrop-blur-sm md:border md:px-8 md:py-10">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="group flex flex-col items-center gap-3 font-medium transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-center rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                <Logo iconOnly className="[&>img]:size-8" />
              </div>
              <span className="sr-only">Chronica.</span>
            </Link>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Chronica<span className="text-xs">&trade;</span> account
              </p>
            </div>
          </div>

          {/* Login Section */}
          <div className="space-y-4">
            <Button
              className="h-12 w-full font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              asChild
            >
              <LoginButton>Continue with Account</LoginButton>
            </Button>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheckIcon className="h-3 w-3" />
              <span>Secure login</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/onboarding"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-muted-foreground">
            <p className="text-balanced leading-relaxed">
              By continuing, you agree to our
              <br />
              <Link
                target="_blank"
                href="/terms-of-service"
                className="font-medium text-foreground/80 transition-colors hover:text-foreground hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                target="_blank"
                href="/terms-of-service#privacy"
                className="font-medium text-foreground/80 transition-colors hover:text-foreground hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Additional help */}
        <div className="mt-8 text-center">
          <Link
            href="/help"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Need help signing in?
          </Link>
        </div>
      </div>
    </div>
  );
}
