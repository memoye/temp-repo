"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseFormSchema } from "@/schemas/cases-schema";
import { isEqual } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { InfoIcon } from "lucide-react";
import { PageWrapper } from "@/app/_components/page-wrapper";
import { BackButton } from "@/app/_components/back-button";
import { PageHeader } from "@/app/_components/page-header";
import { DesktopStepNavigation } from "../_components/case-form/desktop-step-nav";
import { MobileStepNavigation } from "../_components/case-form/mobile-step-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { CaseFormValues } from "@/types/cases";
import { newCaseSteps } from "@/config/new-case-steps";

const PERSISTENCE_KEY = "draft-case-form";

const defaultUser = {
  name: "",
  email: "",
  phoneNumber: "",
  dialCode: "",
  contactId: "",
  relationship: "",
  contactType: 1,
};

const initialValues: CaseFormValues = {
  generalInfo: {
    client: defaultUser,
    courtId: 0,
    description: "",
    documentFolder: {
      categoryId: 0,
      name: "",
    },
    firmId: "",
    name: "",
    practiceArea: {
      id: "",
      name: "",
    },
    openDate: null,
    closedDate: null,
    nextCourtDate: null,
    originatingLawyers: defaultUser,
    permission: {
      type: 0,
      permissions: [
        {
          value: "",
          userType: 0,
        },
      ],
    },
    state: {
      id: 0,
      name: "",
    },
    fileNumber: "",
    responsibleLawyers: [],
    status: 1,
  },
  relatedContacts: [],
};

export default function NewCasePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get("step") || newCaseSteps[0].id;

  const currentStepIndex = newCaseSteps.findIndex((step) => step.id === currentStepId);
  const currentStep = currentStepIndex >= 0 ? newCaseSteps[currentStepIndex] : newCaseSteps[0];

  const [showDraftAlert, setShowDraftAlert] = useState(false);

  const [lastSavedData, setLastSavedData] = useState<CaseFormValues | null>(null);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { handleSubmit, trigger: _, formState, watch, reset } = form;
  const { isValid } = formState;
  const formData = watch();

  const getDraftKey = useCallback(() => {
    return session?.user?.id ? `${PERSISTENCE_KEY}-${session.user.id}` : null;
  }, [session?.user?.id]);

  // const saveDraft = useCallback(() => {
  //   const draftKey = getDraftKey();
  //   if (!draftKey) return;

  //   localStorage.setItem(draftKey, JSON.stringify(formData));
  //   setLastSavedData(formData);
  //   showSuccessToast("Draft saved", {
  //     description: "Your progress has been saved to this device.",
  //   });
  // }, [formData, getDraftKey]);

  const clearDraft = useCallback(() => {
    const draftKey = getDraftKey();
    if (!draftKey) return;

    localStorage.removeItem(draftKey);
    // setHasDraftData(false);
    setLastSavedData(null);
    setShowDraftAlert(false);
  }, [getDraftKey]);

  const handleDiscardDraft = useCallback(() => {
    clearDraft();
    reset(initialValues);
  }, [clearDraft, reset]);

  const handleContinueDraft = useCallback(() => {
    setShowDraftAlert(false);
    // Keep the loaded draft data
  }, []);

  // const handleDiscardAndExit = useCallback(() => {
  //   clearDraft();
  //   // The BackButton component will handle navigation
  // }, [clearDraft]);

  // Auto-save logic with proper dependency management
  useEffect(() => {
    if (!session?.user?.id || status !== "authenticated") return;

    const draftKey = getDraftKey();
    if (!draftKey) return;

    // Debounce the auto-save
    const timer = setTimeout(() => {
      // Check if current form data is equal to initial values
      const isFormEmpty = isEqual(formData, initialValues);

      // Check if current form data is equal to last saved data
      const isUnchanged = lastSavedData && isEqual(formData, lastSavedData);

      if (isFormEmpty) {
        // Clear draft if form is empty
        const existingDraft = localStorage.getItem(draftKey);
        if (existingDraft) {
          localStorage.removeItem(draftKey);
          // setHasDraftData(false);
          setLastSavedData(null);
        }
      } else if (!isUnchanged) {
        // Save draft if there are changes
        localStorage.setItem(draftKey, JSON.stringify(formData));
        // setHasDraftData(true);
        setLastSavedData(formData);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, session?.user?.id, status]); // Removed problematic dependencies

  // Load draft on mount
  useEffect(() => {
    if (session?.user?.id && status === "authenticated") {
      const draftKey = getDraftKey();
      if (!draftKey) return;

      const draftData = localStorage.getItem(draftKey);
      // console.log({ initialValues, draftData: JSON.parse(draftData) });
      if (draftData && !isEqual(initialValues, JSON.parse(draftData))) {
        try {
          const parsedData = JSON.parse(draftData);
          // setHasDraftData(true);
          setLastSavedData(parsedData);
          setShowDraftAlert(true);
          reset(parsedData);
        } catch (error) {
          console.error("Failed to parse draft data:", error);
          localStorage.removeItem(draftKey);
        }
      }
    }
  }, [session?.user?.id, status, getDraftKey, reset]);

  useEffect(() => {
    if (showDraftAlert) {
      setShowDraftAlert(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return fetch("/api/cases", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      clearDraft(); // Clear draft on successful submission
      showSuccessToast("Case created successfully", {
        description: "The new case has been added to the system.",
      });
      router.push("/cases");
    },
    onError: (error) => {
      showErrorToast("Error creating case", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: CaseFormValues) => {
    mutation.mutate(data);
  };

  const goToStep = async (stepId: string) => {
    // Validate current step before navigating
    // const stepField = stepId.split(".")[0];
    const isValid = true; // await trigger(stepField as any);

    if (isValid) {
      router.push(`/cases/new?step=${stepId}`);
    }
  };

  const nextStep = async () => {
    // Trigger validation for the current step's fields
    const isValid = await form.trigger(currentStep.id as any);

    if (isValid && currentStepIndex < newCaseSteps.length - 1) {
      router.push(`/cases/new?step=${newCaseSteps[currentStepIndex + 1].id}`);
    } else if (!isValid) {
      // Scroll to the first error if validation fails
      const firstError = Object.keys(form.formState.errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(newCaseSteps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="relative flex">
      {/* Sticky Sidebar Navigation (Desktop) */}
      <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 space-y-6 border-r bg-sidebar p-4 py-6 group-has-[[data-collapsible=icon]]/sidebar-wrapper:top-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[calc(100vh-3rem)] @3xl/main:block">
        <BackButton fallback="/cases" className="w-fit border-0 px-0! hover:bg-transparent" />

        <div>
          <div className="mb-4">
            <h3 className="mb-1 text-sm font-semibold">Steps</h3>
            <p className="text-xs text-muted-foreground">
              Fill in required fields to create a new case.
            </p>
          </div>

          <DesktopStepNavigation
            steps={newCaseSteps}
            currentStepId={currentStepId}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <PageWrapper className="flex-1 py-4 @3xl/main:max-w-3xl">
        <Form {...form}>
          <PageHeader title="New Case" description="Add a new case to the system" />

          {showDraftAlert && (
            <Alert className="mb-4 border-l-4 border-warning bg-warning/15">
              <InfoIcon className="size-4" />
              <AlertTitle>Draft recovered!</AlertTitle>
              <AlertDescription className="flex flex-col items-center justify-between gap-4 @[620px]/main:flex-row">
                <p className="w-full text-sm">
                  You have unsaved changes from a previous session.
                </p>

                <div className="flex w-full justify-end gap-2 @[620px]/main:w-fit">
                  <Button variant="outline" size="sm" onClick={handleDiscardDraft}>
                    Discard
                  </Button>
                  <Button size="sm" variant="warning" onClick={handleContinueDraft}>
                    Continue
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Mobile Step Navigation */}
          <div className="@3xl/main:hidden">
            <MobileStepNavigation
              steps={newCaseSteps}
              currentStepId={currentStepId}
              onStepClick={goToStep}
            />
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-transparent px-0 @xl/page:rounded-lg @xl/page:bg-card @xl/page:px-4 @xl/page:py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h2 className="mb-1 text-lg font-bold">{currentStep.label}</h2>
                <p className="text-sm text-accent-foreground">{currentStep.description}</p>
              </div>

              <currentStep.component control={form.control} watch={form.watch} />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                >
                  Previous
                </Button>

                {currentStepIndex < newCaseSteps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={!isValid || mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit Case"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Form>
      </PageWrapper>
    </div>
  );
}
