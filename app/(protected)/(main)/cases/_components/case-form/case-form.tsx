// "use client";

// import type { CaseFormValues } from "@/types/cases";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm, FormProvider } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { caseFormSchema } from "@/schemas/case-form";
// import { Button } from "@/components/ui/button";
// import { formSteps } from "./steps-config";
// import { showErrorToast, showSuccessToast } from "@/lib/toast";
// import { DesktopStepNavigation } from "./desktop-step-nav";
// import { MobileStepNavigation } from "./mobile-step-nav";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { InfoIcon, Save, Trash2 } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { isEqual } from "@/lib/utils";
// import { useEffect, useState, useCallback } from "react";
// import { BackButton } from "@/app/_components/back-button";

// const PERSISTENCE_KEY = "draft-case-form";

// const initialValues: CaseFormValues = {
//   basicInfo: {
//     title: "",
//     caseNumber: "",
//     jurisdiction: "",
//     caseType: "other",
//   },
//   parties: {
//     plaintiff: "",
//     defendant: "",
//     attorneys: [],
//   },
//   details: {
//     description: "",
//     filingDate: new Date(),
//     status: "open",
//     priority: "medium",
//   },
//   documents: {
//     documents: [],
//   },
// };

// export function CaseForm() {
//   const { data: session, status } = useSession({ required: true });
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const currentStepId = searchParams.get("step") || formSteps[0].id;

//   const currentStepIndex = formSteps.findIndex((step) => step.id === currentStepId);
//   const currentStep = currentStepIndex >= 0 ? formSteps[currentStepIndex] : formSteps[0];

//   const [showDraftAlert, setShowDraftAlert] = useState(false);
//   // const [, setHasDraftData] = useState(false);
//   const [lastSavedData, setLastSavedData] = useState<CaseFormValues | null>(null);

//   const form = useForm<CaseFormValues>({
//     resolver: zodResolver(caseFormSchema),
//     defaultValues: initialValues,
//     mode: "onChange",
//   });

//   const { handleSubmit, trigger, formState, watch, reset } = form;
//   const { isValid } = formState;
//   const formData = watch();

//   const getDraftKey = useCallback(() => {
//     return session?.user?.id ? `${PERSISTENCE_KEY}-${session.user.id}` : null;
//   }, [session?.user?.id]);

//   const saveDraft = useCallback(() => {
//     const draftKey = getDraftKey();
//     if (!draftKey) return;

//     localStorage.setItem(draftKey, JSON.stringify(formData));
//     setLastSavedData(formData);
//     showSuccessToast("Draft saved", {
//       description: "Your progress has been saved to this device.",
//     });
//   }, [formData, getDraftKey]);

//   const clearDraft = useCallback(() => {
//     const draftKey = getDraftKey();
//     if (!draftKey) return;

//     localStorage.removeItem(draftKey);
//     // setHasDraftData(false);
//     setLastSavedData(null);
//     setShowDraftAlert(false);
//   }, [getDraftKey]);

//   const handleDiscardDraft = useCallback(() => {
//     clearDraft();
//     reset(initialValues);
//   }, [clearDraft, reset]);

//   const handleContinueDraft = useCallback(() => {
//     setShowDraftAlert(false);
//     // Keep the loaded draft data
//   }, []);

//   const handleDiscardAndExit = useCallback(() => {
//     clearDraft();
//     // The BackButton component will handle navigation
//   }, [clearDraft]);

//   // Auto-save logic with proper dependency management
//   useEffect(() => {
//     if (!session?.user?.id || status !== "authenticated") return;

//     const draftKey = getDraftKey();
//     if (!draftKey) return;

//     // Debounce the auto-save
//     const timer = setTimeout(() => {
//       // Check if current form data is equal to initial values
//       const isFormEmpty = isEqual(formData, initialValues);

//       // Check if current form data is equal to last saved data
//       const isUnchanged = lastSavedData && isEqual(formData, lastSavedData);

//       if (isFormEmpty) {
//         // Clear draft if form is empty
//         const existingDraft = localStorage.getItem(draftKey);
//         if (existingDraft) {
//           localStorage.removeItem(draftKey);
//           // setHasDraftData(false);
//           setLastSavedData(null);
//         }
//       } else if (!isUnchanged) {
//         // Save draft if there are changes
//         localStorage.setItem(draftKey, JSON.stringify(formData));
//         // setHasDraftData(true);
//         setLastSavedData(formData);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formData, session?.user?.id, status, lastSavedData]);

//   // Load draft on mount
//   useEffect(() => {
//     if (session?.user?.id && status === "authenticated") {
//       const draftKey = getDraftKey();
//       if (!draftKey) return;

//       const draftData = localStorage.getItem(draftKey);
//       if (draftData) {
//         try {
//           const parsedData = JSON.parse(draftData);
//           // setHasDraftData(true);
//           setLastSavedData(parsedData);
//           setShowDraftAlert(true);
//           reset(parsedData);
//         } catch (error) {
//           console.error("Failed to parse draft data:", error);
//           localStorage.removeItem(draftKey);
//         }
//       }
//     }
//   }, [session?.user?.id, status, getDraftKey, reset]);

//   // Hide alert when moving to next step
//   useEffect(() => {
//     if (showDraftAlert) {
//       setShowDraftAlert(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentStepId]);

//   const mutation = useMutation({
//     mutationFn: (data: any) => {
//       return fetch("/api/cases", {
//         method: "POST",
//         body: JSON.stringify(data),
//       });
//     },
//     onSuccess: () => {
//       clearDraft(); // Clear draft on successful submission
//       showSuccessToast("Case created successfully", {
//         description: "The new case has been added to the system.",
//       });
//       router.push("/cases");
//     },
//     onError: (error) => {
//       showErrorToast("Error creating case", {
//         description: error.message,
//       });
//     },
//   });

//   const onSubmit = (data: CaseFormValues) => {
//     mutation.mutate(data);
//   };

//   const goToStep = async (stepId: string) => {
//     // Validate current step before navigating
//     const stepField = stepId.split(".")[0];
//     const isValid = await trigger(stepField as any);

//     if (isValid) {
//       router.push(`/cases/new?step=${stepId}`);
//     }
//   };

//   const nextStep = async () => {
//     // Trigger validation for the current step's fields
//     const isValid = await form.trigger(currentStep.id as any);

//     if (isValid && currentStepIndex < formSteps.length - 1) {
//       router.push(`/cases/new?step=${formSteps[currentStepIndex + 1].id}`);
//     } else if (!isValid) {
//       // Scroll to the first error if validation fails
//       const firstError = Object.keys(form.formState.errors)[0];
//       if (firstError) {
//         document.getElementById(firstError)?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//     }
//   };

//   const prevStep = () => {
//     if (currentStepIndex > 0) {
//       goToStep(formSteps[currentStepIndex - 1].id);
//     }
//   };

//   return (
//     <FormProvider {...form}>
//       {showDraftAlert && (
//         <Alert className="mb-4 border-l-4 border-warning bg-warning/15">
//           <InfoIcon className="size-4" />
//           <AlertTitle>Draft recovered!</AlertTitle>
//           <AlertDescription className="flex flex-col items-center justify-between gap-4 @[620px]/main:flex-row">
//             <p className="w-full text-sm">You have unsaved changes from a previous session.</p>

//             <div className="flex w-full justify-end gap-2 @[620px]/main:w-fit">
//               <Button variant="outline" size="sm" onClick={handleDiscardDraft}>
//                 Discard
//               </Button>
//               <Button size="sm" variant="warning" onClick={handleContinueDraft}>
//                 Continue
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Top Action Buttons */}
//       <div className="mb-6 flex items-center justify-between">
//         <BackButton fallback="/cases" />

//         <div className="flex gap-2">
//           <Button variant="outline" onClick={saveDraft} disabled={!session?.user?.id}>
//             <Save className="mr-2 h-4 w-4" />
//             Save Draft
//           </Button>

//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="destructive">
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Discard & Exit
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Discard changes?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   All unsaved changes will be lost. This action cannot be undone.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction variant="destructive" onClick={handleDiscardAndExit}>
//                   Discard
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row">
//         {/* Desktop Step Navigation (left sidebar) */}
//         <div className="hidden w-64 border-r p-4 md:block">
//           <DesktopStepNavigation
//             steps={formSteps}
//             currentStepId={currentStepId}
//             onStepClick={goToStep}
//           />
//         </div>

//         {/* Mobile Step Navigation (accordion) */}
//         <div className="md:hidden">
//           <MobileStepNavigation
//             steps={formSteps}
//             currentStepId={currentStepId}
//             onStepClick={goToStep}
//           />
//         </div>

//         {/* Form Content */}
//         <div className="flex-1">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             <div>
//               <h2 className="text-2xl font-bold">{currentStep.label}</h2>
//               <p className="text-muted-foreground">{currentStep.description}</p>
//             </div>

//             <currentStep.component control={form.control} watch={form.watch} />

//             <div className="flex justify-between">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={prevStep}
//                 disabled={currentStepIndex === 0}
//               >
//                 Previous
//               </Button>

//               {currentStepIndex < formSteps.length - 1 ? (
//                 <Button type="button" onClick={nextStep}>
//                   Next
//                 </Button>
//               ) : (
//                 <Button type="submit" disabled={!isValid || mutation.isPending}>
//                   {mutation.isPending ? "Submitting..." : "Submit Case"}
//                 </Button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </FormProvider>
//   );
// }
