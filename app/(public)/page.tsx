import Link from "next/link";
import { BoltIcon, ScaleIcon, LockIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { HeroCTA } from "./_components/hero-cta";
import { FooterCTA } from "./_components/footer-cta";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <span className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
              Coming soon
            </span>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Legal Practice Management,
              <br />
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-foreground-light mx-auto mb-10 max-w-2xl text-xl">
              Chronica gives you one simple way to manage cases, clients, documents, and
              billing - so you can focus on practicing law.
            </p>

            <HeroCTA />
          </div>
        </section>

        {/* Trust Badges */}
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-center font-semibold text-foreground/80">
              Trusted by firms worldwide
            </h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-70 md:gap-16">
              {/* Replace with actual client logos */}
              <div className="text-foreground-light text-xl font-bold">Law+</div>
              <div className="text-foreground-light text-xl font-bold">Justice Partners</div>
              <div className="text-foreground-light text-xl font-bold">Horizon Legal</div>
              <div className="text-foreground-light text-xl font-bold">Cedar & Stone</div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex items-start gap-3">
                <div className="rounded-full bg-primary/50 p-3">
                  <ScaleIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Case Management</h3>
              </CardHeader>
              <CardContent>
                <p className="">
                  Track every detail from intake to resolution with our intuitive matter
                  management system.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex items-start gap-3">
                <div className="rounded-full bg-green-50 p-3">
                  <BoltIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Automated Workflows</h3>
              </CardHeader>
              <CardContent>
                <p className="">
                  Reduce administrative work with automated document generation, deadline
                  tracking, and client communications.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex items-start gap-3">
                <div className="rounded-full bg-purple-50 p-3">
                  <LockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Bank-Grade Security</h3>
              </CardHeader>
              <CardContent>
                <p className="">
                  Client data protected with 256-bit encryption, regular audits, and role-based
                  access controls.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Ready to transform your practice?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
              Join thousands of attorneys who trust Chronica to streamline their firm&apos;s
              operations.
            </p>
            <div className="mx-auto max-w-md">
              {/* <Input
                type="email"
                placeholder="Enter your work email"
                className="border border-muted/40 placeholder:text-muted-foreground"
              /> */}
              <FooterCTA />
            </div>
          </div>
        </section>
      </main>
      {/* Footer Section */}
      <footer className="text-forerground-light bg-foreground/10 py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="mb-2 flex items-center justify-center">
            <Logo className="mx-auto" />
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="mt-4 text-xs">
            &copy; {new Date().getFullYear()} Chronica. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
