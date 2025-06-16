import { z } from "zod";
import { caseFormSchema } from "@/schemas/case-form";

export type CaseFormValues = z.infer<typeof caseFormSchema>;
