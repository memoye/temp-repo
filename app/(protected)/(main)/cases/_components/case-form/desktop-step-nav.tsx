import { cn } from "@/lib/utils";
import type { FormStep } from "@/types/common";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";

export function DesktopStepNavigation({
  steps,
  currentStepId,
  onStepClick,
}: {
  steps: FormStep[];
  currentStepId: string;
  onStepClick: (stepId: string) => void;
}) {
  return (
    <nav className="space-y-4">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        const isCompleted = steps.findIndex((s) => s.id === currentStepId) > index;

        return (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1.5">
              {isCompleted ? (
                <CheckCircle2Icon className="size-4 text-primary" />
              ) : (
                <CircleIcon
                  className={cn(
                    "size-4",
                    isCurrent ? "fill-primary text-primary" : "text-accent-foreground",
                  )}
                />
              )}
              {index < steps.length - 1 && (
                <div
                  className={`mt-0.5 mr-px h-8 w-px ${isCompleted ? "bg-primary" : "bg-accent-foreground"}`}
                />
              )}
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "text-left text-sm font-medium",
                  isCompleted || isCurrent ? "text-primary" : "text-accent-foreground",
                )}
              >
                {step.label}
              </button>
              <p className="text-xs text-accent-foreground">{step.description}</p>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
