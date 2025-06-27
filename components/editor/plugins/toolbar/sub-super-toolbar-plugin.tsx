"use client";

import { useState } from "react";
import { $isTableSelection } from "@lexical/table";
import { $isRangeSelection, BaseSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { SubscriptIcon, SuperscriptIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";

export function SubSuperToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  return (
    <ToggleGroup
      type="single"
      defaultValue={isSubscript ? "subscript" : isSuperscript ? "superscript" : ""}
    >
      <ToggleGroupItem
        value="subscript"
        size="sm"
        className="rounded-l-sm"
        aria-label="Toggle subscript"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        }}
        variant={"outline"}
      >
        <SubscriptIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="superscript"
        size="sm"
        aria-label="Toggle superscript"
        className="rounded-r-sm"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        }}
        variant={"outline"}
      >
        <SuperscriptIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
