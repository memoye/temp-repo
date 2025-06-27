import { z } from "zod";
import { clientSchema } from "@/schemas/client-schema";

export type Client = z.infer<typeof clientSchema>;
