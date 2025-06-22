import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_SPACE_COMMAND,
} from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export function AutoBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_SPACE_COMMAND,
      (payload: KeyboardEvent) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return false;
        }

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);

        if (elementDOM === null) {
          return false;
        }

        const textContent = element.getTextContent();

        // Check for bullet list pattern: "-" followed by space
        if (textContent === "-") {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElementOrThrow();

            // Select all text in the element and remove it
            topLevelElement.select(0, topLevelElement.getTextContentSize());
            selection.removeText();

            // Insert unordered list
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          });

          return true;
        }

        // Check for numbered list pattern: "1." followed by space
        if (textContent === "1.") {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElementOrThrow();

            // Select all text in the element and remove it
            topLevelElement.select(0, topLevelElement.getTextContentSize());
            selection.removeText();

            // Insert ordered list
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          });

          return true;
        }

        // Optional: Add more patterns
        // Check for heading patterns: "# ", "## ", etc.
        const headingMatch = textContent.match(/^(#{1,6})$/);
        if (headingMatch) {
          const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElementOrThrow();

            // Select all text in the element and remove it
            topLevelElement.select(0, topLevelElement.getTextContentSize());
            selection.removeText();

            // Create heading node
            const headingNode = $createHeadingNode(`h${level}`);
            topLevelElement.replace(headingNode);
            headingNode.select();
          });

          return true;
        }

        // Check for quote pattern: ">" followed by space
        if (textContent === ">") {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElementOrThrow();

            // Select all text in the element and remove it
            topLevelElement.select(0, topLevelElement.getTextContentSize());
            selection.removeText();

            // Create quote node
            const quoteNode = $createQuoteNode();
            topLevelElement.replace(quoteNode);
            quoteNode.select();
          });

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
