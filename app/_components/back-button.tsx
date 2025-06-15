"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { MoveLeftIcon } from "lucide-react";

export const BackButton = ({
  icon = <MoveLeftIcon className="size-4" />,
  text = "Go Back",
  className,
}: {
  icon?: ReactNode;
  text?: string;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <Button type="button" className={className} variant="ghost" onClick={() => router.back()}>
      {icon} {text}
    </Button>
  );
};
