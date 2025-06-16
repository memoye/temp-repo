import { z } from "zod";

export const caseBasicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caseNumber: z.string().min(1, "Case number is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  caseType: z.enum(["civil", "criminal", "family", "corporate", "other"]),
});

export const partiesSchema = z.object({
  plaintiff: z.string().min(1, "Plaintiff is required"),
  defendant: z.string().min(1, "Defendant is required"),
  attorneys: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      role: z.string().min(1, "Role is required"),
      contact: z.string().email("Invalid email").optional(),
    }),
  ),
});

export const caseDetailsSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  filingDate: z.date(),
  status: z.enum(["open", "closed", "pending", "appealed"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

export const documentsSchema = z.object({
  documents: z.array(
    z.object({
      name: z.string().min(1, "Document name is required"),
      type: z.string().min(1, "Document type is required"),
      file: z.any().optional(), // This would be more specific in a real implementation
    }),
  ),
});

// Combine all schemas
export const caseFormSchema = z.object({
  basicInfo: caseBasicInfoSchema,
  parties: partiesSchema,
  details: caseDetailsSchema,
  documents: documentsSchema,
});
