// 206

import { z } from "zod";

interface CharLenValidation {
  limit?: number;
  message?: string;
}

const MIN_RICH_TEXT_LENGTH = 206;
export function richTextFieldSchemaFactory({
  min,
  max,
}: Record<"min" | "max", CharLenValidation>) {
  const baseSchema = z.string().min(MIN_RICH_TEXT_LENGTH + (min.limit || 0), {
    message: min.message || `The description must be at least ${min.limit || 0} characters`,
  });

  if (!max?.limit) {
    return baseSchema;
  } else {
    return baseSchema.max(max.limit, {
      message: max.message || `The description must not exceed ${max.limit} characters`,
    });
  }
}
