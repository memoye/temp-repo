import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (shouldSave: boolean) => void;
  isSaving?: boolean;
  title?: string;
  description?: string;
  saveLabel?: string;
  discardLabel?: string;
  cancelLabel?: string;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  isSaving = false,
  title = "Unsaved Changes",
  description = "You have unsaved changes that will be lost if you continue. What would you like to do?",
  saveLabel = "Save & Continue",
  discardLabel = "Discard Changes",
  cancelLabel = "Cancel",
}: UnsavedChangesDialogProps) {
  const handleSaveAndContinue = () => {
    onConfirm(true);
  };

  const handleDiscardAndContinue = () => {
    onConfirm(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-left">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={isSaving} className="w-full sm:w-auto">
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDiscardAndContinue}
            disabled={isSaving}
            className="text-destructive-foreground w-full bg-destructive hover:bg-destructive/90 sm:w-auto"
          >
            {discardLabel}
          </AlertDialogAction>

          <AlertDialogAction
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              saveLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Alternative hook-based implementation for more complex scenarios
export function useUnsavedChangesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const showDialog = React.useCallback((action: () => void) => {
    setPendingAction(() => action);
    setIsOpen(true);
  }, []);

  const handleConfirm = React.useCallback(
    async (shouldSave: boolean) => {
      if (shouldSave) {
        setIsSaving(true);
        try {
          // This would be replaced with actual save logic
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsSaving(false);
          setIsOpen(false);
          pendingAction?.();
        } catch (error) {
          setIsSaving(false);
          // Handle save error - don't proceed with navigation
          console.error("Save failed:", error);
        }
      } else {
        setIsOpen(false);
        pendingAction?.();
      }
      setPendingAction(null);
    },
    [pendingAction],
  );

  const handleCancel = React.useCallback(() => {
    setIsOpen(false);
    setPendingAction(null);
  }, []);

  return {
    isOpen,
    isSaving,
    showDialog,
    handleConfirm,
    handleCancel,
    setIsOpen,
  };
}

// Enhanced version with form integration
interface UnsavedChangesProviderProps {
  children: React.ReactNode;
  hasUnsavedChanges: boolean;
  onSave?: () => Promise<boolean>;
}

export const UnsavedChangesContext = React.createContext<{
  hasUnsavedChanges: boolean;
  confirmNavigation: (action: () => void) => void;
} | null>(null);

export function UnsavedChangesProvider({
  children,
  hasUnsavedChanges,
  onSave,
}: UnsavedChangesProviderProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const confirmNavigation = React.useCallback(
    (action: () => void) => {
      if (hasUnsavedChanges) {
        setPendingAction(() => action);
        setIsDialogOpen(true);
      } else {
        action();
      }
    },
    [hasUnsavedChanges],
  );

  const handleConfirm = React.useCallback(
    async (shouldSave: boolean) => {
      if (shouldSave && onSave) {
        setIsSaving(true);
        try {
          const success = await onSave();
          if (success) {
            setIsDialogOpen(false);
            pendingAction?.();
          }
        } catch (error) {
          console.error("Save failed:", error);
        } finally {
          setIsSaving(false);
        }
      } else {
        setIsDialogOpen(false);
        pendingAction?.();
      }
      setPendingAction(null);
    },
    [onSave, pendingAction],
  );

  // Browser navigation protection
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, confirmNavigation }}>
      {children}
      <UnsavedChangesDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirm}
        isSaving={isSaving}
      />
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = React.useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return context;
}
