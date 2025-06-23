"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Copiable = ({
  copyText,
  children,
  className,
}: {
  copyText: string | number;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(copyText)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="group/copiable flex flex-nowrap items-center gap-0.5 rounded-md transition-all">
      <div className={className}>{children || copyText}</div>

      <button
        onClick={handleCopy}
        className={cn(
          "relative ml-0.5 shrink-0 rounded-md p-1 transition-opacity",
          isCopied ? "opacity-100" : "group-hover/copiable:opacity-100 lg:opacity-0",
        )}
        aria-label="Copy"
        type="button"
      >
        {isCopied ? (
          <CheckIcon className="text-success" width={16} height={16} />
        ) : (
          <CopyIcon className="size-4" />
        )}
        {isCopied && (
          <span
            aria-hidden={!isCopied}
            className={cn(
              "text-gray-light absolute -top-2.5 -right-1.5 text-[10px] transition-transform",
              isCopied && "-rotate-6 animate-in fade-in-0 zoom-in-90 slide-in-from-bottom",
            )}
          >
            Copied!
          </span>
        )}
      </button>
    </div>
  );
};
