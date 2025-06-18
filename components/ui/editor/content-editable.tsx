import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import { cn } from "@/lib/utils";

interface ContentEditableProps {
  className?: string;
  placeholder: string;
  placeholderClassName?: string;
}

export function ContentEditable({
  placeholder,
  className,
  placeholderClassName,
}: ContentEditableProps) {
  return (
    <LexicalContentEditable
      className={cn(
        "ContentEditable__root relative block h-full min-h-72 overflow-auto p-4 focus:outline-none",
        className,
      )}
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 overflow-hidden p-4 py-[18px] text-ellipsis text-muted-foreground select-none",
            placeholderClassName,
          )}
        >
          {placeholder}
        </div>
      }
    />
  );
}
