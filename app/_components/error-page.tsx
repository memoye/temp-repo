import Link from "next/link";
import { BackButton } from "./back-button";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, HomeIcon } from "lucide-react";

export function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid h-full place-items-center p-4">
      <div className="mx-auto flex flex-col items-center text-center">
        <h1 className="mb-4 text-9xl font-black text-primary">Oops!</h1>
        <div className="text-foreground-light mt-4 mb-3">
          <div className="mx-auto my-2 flex w-full max-w-[600px] gap-4 bg-destructive/10 p-4 text-start text-destructive">
            <AlertTriangleIcon className="shrink-0" />{" "}
            <p>
              {error.message.replace(/try again/gi, "").trim() ||
                "An error occured while loading the page"}
              .
            </p>
          </div>
          <p>
            <button
              className="font-medium text-primary hover:underline"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>{" "}
            - If the problem persists, contact{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={"mailto:hello@chronica.legal"}
            >
              hello@chronica.legal
            </Link>{" "}
            for assistance.
          </p>
        </div>
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
}
