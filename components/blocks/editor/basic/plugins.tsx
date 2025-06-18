import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import { ContentEditable } from "@/components/ui/editor/content-editable";
import { KeyboardShortcutPlugin } from "../plugins/keyboard-shortcut-plugin";
import { ToolbarPlugin } from "../plugins/toolbar/toolbar-plugin";

import { FormatParagraph } from "../plugins/block-format/format-paragraph";
import { FormatHeading } from "../plugins/block-format/format-heading";
import { FormatNumberedList } from "../plugins/block-format/format-numbered-list";
import { FormatBulletedList } from "../plugins/block-format/format-bulleted-list";
import { FormatCheckList } from "../plugins/block-format/format-check-list";
import { FormatQuote } from "../plugins/block-format/format-quote";
import { HistoryToolbarPlugin } from "../plugins/toolbar/history-toolbar-plugin";
import { cn } from "@/lib/utils";
import { ActionsPlugin } from "../plugins/action/actions-plugin";
import { MaxLengthPlugin } from "../plugins/action/max-length-plugin";
import { CharacterLimitPlugin } from "../plugins/action/character-limit-plugin";
import { BlockFormatDropDown } from "../plugins/toolbar/block-format-toolbar-plugin";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { FontFormatToolbarPlugin } from "../plugins/toolbar/font-format-toolbar-plugin";
import { Separator } from "@/components/ui/separator";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { AutoLinkPlugin } from "../plugins/auto-link-plugin";
import { LinkPlugin } from "../plugins/link-plugin";
import { FloatingLinkEditorPlugin } from "../plugins/floating-link-editor-plugin";
import { LinkToolbarPlugin } from "../plugins/toolbar/link-toolbar-plugin";
import { FontSizeToolbarPlugin } from "../plugins/toolbar/font-size-toolbar-plugin";
import type { Nullable } from "@/types/utils";

interface PluginsProps {
  placeholder?: string;
  contentEditableClassName?: string;
  hasError?: boolean;
  showDelete?: boolean;
  maxLength?: Nullable<number>;
  onLimitReached?: () => void;
}

export function Plugins({
  placeholder,
  contentEditableClassName,
  hasError,
  maxLength,
  showDelete,
  onLimitReached,
}: PluginsProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const showActions = maxLength != null || showDelete;

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType: _ }) => (
          <div
            className={cn(
              "sticky top-0 z-10 flex justify-between gap-2 overflow-auto border-b p-1 pr-0! align-middle",
              hasError ? "border-destructive bg-destructive/10" : "border-input",
            )}
          >
            <div className="flex items-center gap-1 align-middle">
              <BlockFormatDropDown triggerClassName="bg-transparent!">
                <FormatParagraph />
                <FormatHeading levels={["h1", "h2", "h3", "h4"]} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatCheckList />
                <FormatQuote />
              </BlockFormatDropDown>

              <FontSizeToolbarPlugin />

              <Separator orientation="vertical" className="mx-0.5" />

              <FontFormatToolbarPlugin format="bold" />
              <FontFormatToolbarPlugin format="italic" />
              <FontFormatToolbarPlugin format="underline" />
              <FontFormatToolbarPlugin format="strikethrough" />

              <Separator orientation="vertical" className="mx-0.5" />

              <LinkToolbarPlugin />
            </div>

            <HistoryToolbarPlugin
              className={cn(
                "sticky right-0 border-l bg-transparent px-1 backdrop-blur-2xl",
                hasError ? "border-destructive" : "border-input",
              )}
            />
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div ref={onRef}>
              <ContentEditable
                className={contentEditableClassName}
                placeholder={placeholder || ""}
              />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <ListPlugin />
        <CheckListPlugin />
        <KeyboardShortcutPlugin />
        <HistoryPlugin />
        <HashtagPlugin />

        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
      </div>

      {/* actions plugins */}
      {showActions && (
        <ActionsPlugin>
          <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
            <div className="flex flex-1 justify-start">
              {/* left side action buttons */}
              {maxLength != null && (
                <>
                  <MaxLengthPlugin maxLength={maxLength} onLimitReached={onLimitReached} />
                  <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
                </>
              )}
            </div>

            <div>{/* center action buttons */}</div>

            <div className="flex flex-1 justify-end">
              {/* right side action buttons */}
              {showDelete && (
                <Button type="button" size="sm" variant={"ghost"} className="p-2">
                  <Trash2Icon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </ActionsPlugin>
      )}
    </div>
  );
}
