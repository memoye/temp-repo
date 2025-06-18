"use client";

import { useState } from "react";
import { AsteriskIcon, EyeIcon, EyeClosedIcon } from "lucide-react";
import type { InputProps } from "./input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(!showPassword && "tracking-[4px]", className)}
        {...props}
      />

      {/* default placeholder from design */}
      {!props.value && !props.placeholder && (
        <div className="translate-y-center pointer-events-none absolute left-4.5 flex flex-nowrap items-center gap-1 text-muted-foreground">
          {Array(6)
            .fill(AsteriskIcon)
            .map((Item, idx) => (
              <Item key={idx} />
            ))}
        </div>
      )}

      <button
        type="button"
        className={cn(
          "translate-y-center absolute right-4.5 rounded-md bg-transparent px-2 py-1.5 outline-transparent transition-transform",
          showPassword ? "-scale-y-100" : "",
        )}
        onClick={toggleShowPassword}
      >
        {showPassword ? <EyeIcon className="size-4" /> : <EyeClosedIcon className="size-4" />}
      </button>
    </div>
  );
}
