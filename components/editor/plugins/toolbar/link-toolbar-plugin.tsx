"use client";

import { useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  KEY_DOWN_COMMAND,
  type BaseSelection,
} from "lexical";
import { LinkIcon } from "lucide-react";
import { useToolbarContext } from "@/context/editor/toolbar-context";
import { useFloatingLinkContext } from "@/context/editor/floating-link-context";
import { getSelectedNode, sanitizeUrl } from "@/lib/editor-utils";
import { useUpdateToolbarHandler } from "@/hooks/use-update-editor-toolbar";
import { Toggle } from "@/components/ui/toggle";

export function LinkToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const { setIsLinkEditMode } = useFloatingLinkContext();
  const [isLink, setIsLink] = useState(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  return (
    <Toggle
      variant={"outline"}
      size="sm"
      className="rounded-sm data-[state=on]:border-foreground data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
      aria-label="Toggle link"
      onClick={insertLink}
    >
      <LinkIcon className="size-4" />
    </Toggle>
  );
}
