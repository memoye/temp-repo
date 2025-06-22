"use client";

import { useCallback, useState } from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, type BaseSelection } from "lexical";
import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useTheme } from "next-themes";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import ColorPicker from "@/components/ui/color-picker";

export function FontColorToolbarPlugin({ className }: { className?: string }) {
  const { activeEditor } = useToolbarContext();
  const { theme } = useTheme();

  const [fontColor, setFontColor] = useState(theme === "dark" ? "#fff" : "#000");

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontColor(
        $getSelectionStyleValueForProperty(
          selection,
          "color",
          theme === "dark" ? "#fff" : "#000",
        ),
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

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  return (
    <ColorPicker
      icon={
        <div className="flex size-4 flex-col items-center justify-center">
          <span className="text-center text-xs leading-none font-semibold">A</span>
          <span style={{ backgroundColor: fontColor }} className="block h-1 w-3" />
        </div>
      }
      color={fontColor}
      onChange={onFontColorSelect}
      title="text color"
      className={className}
    />
  );
}
