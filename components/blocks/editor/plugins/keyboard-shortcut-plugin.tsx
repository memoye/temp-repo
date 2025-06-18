import { KEY_DOWN_COMMAND, COMMAND_PRIORITY_EDITOR } from "lexical";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function KeyboardShortcutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const { key, ctrlKey, metaKey } = event;

        // Check for cmd/ctrl + b
        if ((metaKey || ctrlKey) && key === "b") {
          event.preventDefault();
          event.stopPropagation();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          return true;
        }

        // Check for cmd/ctrl + i (if needed)
        if ((metaKey || ctrlKey) && key === "i") {
          event.preventDefault();
          event.stopPropagation();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          return true;
        }

        // Add other shortcuts here as needed
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
