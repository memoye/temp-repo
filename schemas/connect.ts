import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "Email is required." })
  .trim()
  .email({ message: "Invalid email." });

export const addressSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export const onboardFirmSchema = z.object({
  name: z
    .string({ required_error: "Firm name is required." })
    .trim()
    .min(3, { message: "Firm name is required." }),
  firstName: z
    .string({ required_error: "First name is required." })
    .trim()
    .min(1, { message: "First name is required." }),
  surName: z
    .string({ required_error: "Last name is required." })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters." }),
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .min(10, { message: "Please enter a valid phone number." }),
  email: emailSchema,
  dialCode: z.string({ required_error: "Select your country." }),
  firmSizeId: z
    .number({ required_error: "Firm size is required." })
    .min(1, "Select a firm size from the list."),
  practiceAreas: z.array(z.string()).min(1, "At least one practice area is required"),
  address: addressSchema,
  referralCode: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, { message: "Please enter your password." }),
});

export const onboardInvitedUserSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required." })
      .trim()
      .min(1, { message: "First name is required." }),
    surName: z
      .string({ required_error: "First name is required." })
      .trim()
      .min(1, { message: "Last name is required." }),
    phoneNumber: z
      .string({ required_error: "Phone number is required." })
      .trim()
      .min(10, { message: "Please enter a valid phone number." }),
    dialCode: z.string({ required_error: "Select your country." }),
    isGenerateInviteLink: z.boolean().optional(),
    email: z.string().email("Please enter a valid email address").optional(),
    password: z
      .string({
        required_error: "Password is required.",
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
        "Password must meet the requirements.",
      ),
    confirmPassword: z.string({
      required_error: "Confirm your password.",
    }),
    code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Password matching validation
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // Conditional email validation
    if (data.isGenerateInviteLink === true && !data.email) {
      ctx.addIssue({
        code: "custom",
        message: "Email is required when generating invite link",
        path: ["email"],
      });
    }
  });

export const passwordCreationSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required.",
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
        "Password must meet the requirements.",
      ),
    confirmPassword: z.string({
      required_error: "Confirm your password.",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const inviteUserSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .trim()
    .min(1, { message: "First name is required." }),
  email: emailSchema,
  roles: z
    .array(
      z.object({
        id: z.string().min(1, "Select a role from the list."),
        name: z.string().min(1, "Select a role from the list."),
      }),
    )
    .min(1, "At least one role must be selected."),
});

export const roleFormSchema = z.object({
  organizationId: z
    .string()
    .min(1, "Could not find organization. Please refresh and try again"),
  permissions: z.array(z.number()).min(1, "At least one permission is required."),
});
