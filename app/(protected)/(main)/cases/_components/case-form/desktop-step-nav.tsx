import type { FormStep } from "@/types/common";
import { CheckCircle2, Circle } from "lucide-react";

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
            <div className="flex flex-col items-center pt-1">
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : isCurrent ? (
                <div className="h-5 w-5 rounded-full bg-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              {index < steps.length - 1 && (
                <div className={`h-8 w-0.5 ${isCompleted ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`text-left text-sm font-medium ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-green-600"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </button>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
