"use client";

import { useState } from "react";
import { $isTableSelection } from "@lexical/table";
import {
  $isRangeSelection,
  BaseSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const Icons: Partial<Record<TextFormatType, React.ElementType>> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  code: CodeIcon,
} as const;

export function FontFormatToolbarPlugin({
  format,
  className,
}: {
  format: Omit<TextFormatType, "highlight" | "subscript" | "superscript">;
  className?: string;
}) {
  const { activeEditor } = useToolbarContext();
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setIsSelected(selection.hasFormat(format as TextFormatType));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const Icon = Icons[format as TextFormatType] as React.ElementType;

  return (
    <Toggle
      aria-label="Toggle bold"
      variant="outline"
      size="sm"
      className={cn(
        "rounded-sm data-[state=on]:border-foreground data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
        className,
      )}
      defaultPressed={isSelected}
      pressed={isSelected}
      onPressedChange={setIsSelected}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
      }}
    >
      <Icon className="size-4" />
    </Toggle>
  );
}
