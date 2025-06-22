"use client";

import { useCallback, useState, useRef } from "react";
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical";
import { Minus, Plus } from "lucide-react";
import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const style = "font-size";
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        `${DEFAULT_FONT_SIZE}px`,
      );
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number, preserveFocus = false) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);

      // Store the currently focused element before the editor update
      const activeElement = preserveFocus ? document.activeElement : null;

      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });

      setFontSize(size);

      // Restore focus to the input if it was focused before
      if (preserveFocus && activeElement === inputRef.current) {
        // Use setTimeout to ensure the editor update has completed
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    },
    [activeEditor, style],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || DEFAULT_FONT_SIZE;
    updateFontSize(newValue, true); // Pass true to preserve focus
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="size-8! rounded-r-none border border-r-0 border-input"
          onClick={() => updateFontSize(fontSize - 1)}
          disabled={fontSize <= MIN_FONT_SIZE}
        >
          <Minus className="size-3" />
        </Button>
        <Input
          ref={inputRef}
          value={fontSize}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="!h-8 w-12 rounded-none text-center"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          // type="number"
        />
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="size-8! rounded-l-none border border-l-0 border-input"
          onClick={() => updateFontSize(fontSize + 1)}
          disabled={fontSize >= MAX_FONT_SIZE}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}
