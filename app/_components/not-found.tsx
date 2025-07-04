import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { BackButton } from "./back-button";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  return (
    <div className="flex h-full min-h-[calc(100dvh-10rem)] w-full place-items-center">
      <div className="mx-auto flex flex-col items-center text-center">
        <h1 title="Page not found" className="text-9xl font-black text-primary">
          404 <span className="sr-only">Not Found</span>
        </h1>
        <p className="text-foreground-light mt-4 mb-3">
          The page you are looking does not exist or might have been moved.
          <br /> Contact{" "}
          <Link
            className="font-medium text-primary hover:underline"
            href={"mailto:hello@chronica.legal"}
          >
            hello@chronica.legal
          </Link>{" "}
          for further assistance.
        </p>
        <div className="mt-6 flex w-full items-center justify-center gap-4">
          <BackButton />
          <Button type="button" asChild className="space-x-2">
            <Link href="/">
              <HomeIcon size={16} /> Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
