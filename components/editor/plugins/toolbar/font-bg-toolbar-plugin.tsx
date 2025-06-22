"use client";

import { useCallback, useState } from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical";
import { PaintBucketIcon } from "lucide-react";

import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import ColorPicker from "@/components/ui/color-picker";
import { cn } from "@/lib/utils";

export function FontBackgroundToolbarPlugin({ className }: { className?: string }) {
  const { activeEditor } = useToolbarContext();
  const [bgColor, setBgColor] = useState("transparent");

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor(
        $getSelectionStyleValueForProperty(selection, "background-color", "transparent"),
      );
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {},
      );
    },
    [activeEditor],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  return (
    <ColorPicker
      icon={<PaintBucketIcon className="size-4" />}
      color={bgColor}
      onChange={onBgColorSelect}
      title="text background color"
      className={cn(
        !bgColor || bgColor === "transparent" ? "border-b" : "border-b-4",
        className,
      )}
      style={{
        borderBottomColor: !bgColor || bgColor === "transparent" ? "inherit" : bgColor,
      }}
    />
  );
}
