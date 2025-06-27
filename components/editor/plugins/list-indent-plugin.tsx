import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_TAB_COMMAND,
} from "lexical";
import {
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
  // $createListItemNode,
  $createListNode,
} from "@lexical/list";
import { $getNearestNodeOfType } from "@lexical/utils";

export function ListIndentPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (payload: KeyboardEvent) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return false;
        }

        const anchorNode = selection.anchor.getNode();
        const listItem = $getNearestNodeOfType(anchorNode, ListItemNode);

        if (!listItem) {
          return false;
        }

        const parentList = listItem.getParent();
        if (!$isListNode(parentList)) {
          return false;
        }

        // Prevent default tab behavior
        payload.preventDefault();

        const isShiftPressed = payload.shiftKey;

        if (isShiftPressed) {
          // Shift+Tab: Outdent (move list item up one level)
          return handleOutdent(listItem, parentList);
        } else {
          // Tab: Indent (move list item down one level)
          return handleIndent(listItem, parentList);
        }
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

function handleIndent(listItem: ListItemNode, parentList: ListNode): boolean {
  const previousSibling = listItem.getPreviousSibling();

  if (!previousSibling || !$isListItemNode(previousSibling)) {
    // Can't indent if there's no previous sibling to nest under
    return true;
  }

  // Get the list type from the parent list
  const listType = parentList.getListType();

  // Check if the previous sibling already has a nested list
  const lastChild = previousSibling.getLastChild();
  let nestedList: ListNode;

  if ($isListNode(lastChild) && lastChild.getListType() === listType) {
    // Use existing nested list
    nestedList = lastChild;
  } else {
    // Create a new nested list with the same type as parent
    nestedList = $createListNode(listType);
    previousSibling.append(nestedList);
  }

  // Move the current list item to the nested list
  listItem.remove();
  nestedList.append(listItem);

  // Focus the moved list item
  listItem.selectEnd();

  return true;
}

function handleOutdent(listItem: ListItemNode, parentList: ListNode): boolean {
  const grandparent = parentList.getParent();

  if (!grandparent) {
    return true;
  }

  // Check if we're in a nested list (parent list is inside another list item)
  if ($isListItemNode(grandparent)) {
    const grandparentList = grandparent.getParent();
    if (!$isListNode(grandparentList)) {
      return true;
    }

    // Get all siblings after the current item
    const nextSiblings: ListItemNode[] = [];
    let sibling = listItem.getNextSibling();
    while (sibling) {
      const nextSibling = sibling.getNextSibling();
      if ($isListItemNode(sibling)) {
        nextSiblings.push(sibling);
        sibling.remove();
      }
      sibling = nextSibling;
    }

    // Move the current item to the grandparent list level
    listItem.remove();
    const grandparentIndex = grandparent.getIndexWithinParent();
    grandparentList.splice(grandparentIndex + 1, 0, [listItem]);

    // If there are next siblings, create a new nested list for them
    if (nextSiblings.length > 0) {
      const listType = parentList.getListType();
      const newNestedList = $createListNode(listType);

      nextSiblings.forEach((item) => {
        newNestedList.append(item);
      });

      listItem.append(newNestedList);
    }

    // Clean up empty parent list
    if (parentList.getChildrenSize() === 0) {
      parentList.remove();
    }

    // Focus the moved list item
    listItem.selectEnd();

    return true;
  } else {
    // We're at the top level, can't outdent further
    // Optionally, you could convert to a regular paragraph here
    return true;
  }
}
