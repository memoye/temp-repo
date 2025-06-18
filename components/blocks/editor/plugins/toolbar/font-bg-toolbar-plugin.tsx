"use client";

import { useCallback, useState } from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical";
import { PaintBucketIcon } from "lucide-react";

import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import ColorPicker from "@/components/ui/color-picker";

export function FontBackgroundToolbarPlugin() {
  const { activeEditor } = useToolbarContext();

  const [bgColor, setBgColor] = useState("inherit");

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor($getSelectionStyleValueForProperty(selection, "background-color", "inherit"));
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
    />
  );
}
