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
import { HelpCircleIcon, Trash2Icon } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AutoBlockPlugin } from "../plugins/auto-block-plugin";
import { FontColorToolbarPlugin } from "../plugins/toolbar/font-color-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "../plugins/toolbar/font-bg-toolbar-plugin";
import { SubSuperToolbarPlugin } from "../plugins/toolbar/sub-super-toolbar-plugin";
import { ClearFormattingToolbarPlugin } from "../plugins/toolbar/clear-formatting-toolbar-plugin";

interface PluginsProps {
  placeholder?: string;
  contentEditableClassName?: string;
  hasError?: boolean;
  showDelete?: boolean;
  maxLength?: Nullable<number>;
  showHelp?: boolean;
  hideToolbar?: boolean;
}

export function Plugins({
  placeholder,
  contentEditableClassName,
  hasError,
  maxLength,
  showDelete,
  hideToolbar,
  showHelp,
}: PluginsProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const showActions = maxLength != null || showDelete || showHelp;

  return (
    <div className="relative">
      {/* toolbar plugins */}
{  !hideToolbar &&    <ToolbarPlugin>
        {({ blockType: _ }) => (
          <div
            className={cn(
              "sticky top-0 z-10 flex justify-between gap-2 overflow-auto border-b p-1 pr-0! align-middle",
              hasError ? "border-destructive bg-destructive/10" : "border-input",
            )}
          >
            <div className="flex items-center gap-1 align-middle">
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={["h1", "h2", "h3", "h4"]} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatCheckList />
                <FormatQuote />
              </BlockFormatDropDown>

              <FontSizeToolbarPlugin />

              <div className="flex items-center -space-x-px">
                <FontBackgroundToolbarPlugin className="rounded-r-none" />
                <FontColorToolbarPlugin className="rounded-l-none" />
              </div>

              <Separator orientation="vertical" className="mx-0.5" />

              <div className="flex items-center -space-x-0">
                <FontFormatToolbarPlugin className="rounded-r-none" format="bold" />
                <FontFormatToolbarPlugin className="rounded-none" format="italic" />
                <FontFormatToolbarPlugin className="rounded-none" format="underline" />
                <FontFormatToolbarPlugin className="rounded-l-none" format="strikethrough" />
              </div>

              <SubSuperToolbarPlugin />

              <Separator orientation="vertical" className="mx-0.5" />

              <LinkToolbarPlugin />
            </div>
            <div
              className={cn(
                "sticky right-0 flex items-center border-l bg-background px-1",
                hasError ? "border-destructive" : "border-input",
              )}
            >
              <HistoryToolbarPlugin />
              <Separator orientation="vertical" className="mx-0.5" />
              <ClearFormattingToolbarPlugin />
            </div>
          </div>
        )}
      </ToolbarPlugin>}

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
        <AutoBlockPlugin />
        <AutoLinkPlugin />
        <CheckListPlugin />
        <ClickableLinkPlugin />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <HashtagPlugin />
        <HistoryPlugin />
        <KeyboardShortcutPlugin />
        <LinkPlugin />
        <ListPlugin />
      </div>

      {/* actions plugins */}
      {showActions && (
        <ActionsPlugin>
          <div className="flex items-center justify-between gap-2 overflow-auto border-t border-input p-1">
            <div className="flex flex-1 justify-start">
              {/* left side action buttons */}
              {maxLength != null && (
                <>
                  <MaxLengthPlugin maxLength={maxLength} />
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

              {!showHelp && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant={"ghost"}
                      className="size-6 text-muted-foreground"
                    >
                      <HelpCircleIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Help</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </ActionsPlugin>
      )}
    </div>
  );
}
