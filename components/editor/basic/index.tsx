"use client";

import type { EditorState, SerializedEditorState } from "lexical";
import { LexicalComposer, type InitialConfigType } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { editorTheme } from "@/components/ui/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { cn } from "@/lib/utils";
import { FloatingLinkContext } from "@/context/editor/floating-link-context";
import type { Nullable } from "@/types/utils";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

interface EditorProps {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: Nullable<EditorState>) => void;
  onSerializedChange?: (editorSerializedState: Nullable<SerializedEditorState>) => void;
  className?: string;
  placeholder?: string;
  hasError?: boolean;
  contentEditableClassName?: string;
  maxLength?: Nullable<number>;
}

/**
 * For simple form fields like `description`, `notes`, etc.
 */
export function BasicEditor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  className,
  placeholder,
  hasError,
  contentEditableClassName,
  maxLength,
}: EditorProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border",
        hasError ? "border-destructive!" : "border-input",
        className,
      )}
    >
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <FloatingLinkContext>
            <Plugins
              contentEditableClassName={cn("dark:bg-input/30", contentEditableClassName)}
              hasError={hasError}
              placeholder={placeholder}
              maxLength={maxLength}
            />
            <OnChangePlugin
              ignoreSelectionChange={true}
              onChange={(editorState) => {
                if (editorState.isEmpty()) {
                  onChange?.(null);
                  onSerializedChange?.(null);
                } else {
                  onChange?.(editorState);
                  onSerializedChange?.(editorState.toJSON());
                }
              }}
            />
          </FloatingLinkContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
