import { z } from "zod";
import { authCall as callBackend } from "@/lib/api";
import { eventScheduleSchema } from "@/schemas/schedule-schema";
import type { ApiResponse } from "@/types/common";

const base = `/events/api/v${process.env.NEXT_PUBLIC_API_VERSION}`;

export async function createEventSchedule(data: z.infer<typeof eventScheduleSchema>) {
  callBackend<ApiResponse<boolean>>(`@post${base}/schedule`, {
    body: data,
    resultMode: "onlySuccessWithException",
    throwOnError: true,
  });
}
