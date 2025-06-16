"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormStep } from "@/types/common";
import { CheckCircle2, Circle } from "lucide-react";

export function MobileStepNavigation({
  steps,
  currentStepId,
  onStepClick,
}: {
  steps: FormStep[];
  currentStepId: string;
  onStepClick: (stepId: string) => void;
}) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <Accordion type="single" collapsible defaultValue={currentStepId} className="w-full">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        const isCompleted = currentStepIndex > index;

        return (
          <AccordionItem key={step.id} value={step.id}>
            <AccordionTrigger className="px-4 py-3">
              <div className="flex items-center space-x-3">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isCurrent ? (
                  <div className="h-5 w-5 rounded-full bg-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="text-left">
                  <div
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="text-sm text-primary underline"
              >
                {isCurrent ? "Currently editing" : "Go to this step"}
              </button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
