import { cn } from "@/lib/utils";

interface NavFooterProps {
  version?: string;
}

export function NavFooter({ version = "v1.0" }: NavFooterProps) {
  // const { state, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-0.5 py-2",
        // state === "collapsed" && "!flex-col gap-2",
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        {/* {!isMobile && state !== "collapsed" && ( */}
        <span className="font-mono text-xs text-muted-foreground">{version}</span>
        {/* // )} */}
        {/* <Button
          variant="ghost"
          className="hover:!bg-muted"
          // size="icon"
          asChild
        >
          <Link to="/support" target="_blank">
            <HelpCircle className="size-4" />
            <span
              className={
                !isMobile && state !== "collapsed" ? "not-sr-only" : "sr-only"
              }
            >
              Help
            </span>
          </Link>
        </Button> */}
      </div>
    </div>
  );
}
