import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BasePageHeaderProps {
  description?: React.ReactNode;
  className?: string;
  pageActions?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

interface PageHeaderPropsWithTitle extends BasePageHeaderProps {
  title: React.ReactNode;
  children?: never;
}

interface PageHeaderPropsWithChildren extends BasePageHeaderProps {
  title?: never;
  children: React.ReactNode;
}

type PageHeaderProps = PageHeaderPropsWithTitle | PageHeaderPropsWithChildren;

export const PageHeader = ({
  title,
  description,
  className,
  pageActions,
  isLoading,
  children,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col items-start justify-between gap-4 text-accent-foreground @2xl/main:flex-row @2xl/main:items-center @2xl/main:gap-6",
        className,
      )}
    >
      <section className="my-1 flex-1 space-y-2">
        {children || (
          <h1 className="text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="mb-4 block h-5 w-1/4" /> : title}
          </h1>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ) : (
          <>{description && <p className="text-foreground-light">{description}</p>}</>
        )}
      </section>

      {pageActions}
    </div>
  );
};
