import { cn } from "@/lib/utils";

interface RequirementProps {
  requirement: boolean;
  label: string;
}

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const PASSWORD_REQUIRMENTS = [
    {
      requirement: /[A-Z]/.test(password),
      label: "Must have at least 1 uppercase character",
    },
    {
      requirement: /[a-z]/.test(password),
      label: "Must have at least 1 lowercase character",
    },
    {
      requirement: /\d/.test(password),
      label: "Must have at least 1 number",
    },
    {
      requirement: password.length >= 8,
      label: "Must have at least 8 characters minimum.",
    },
    {
      requirement: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      label: "Must have at least 1 special character",
    },
  ];

  return (
    <div className="text-sm">
      <h2 className="mb-3 font-semibold">Password Requirements</h2>
      <ul className="space-y-4">
        {PASSWORD_REQUIRMENTS.map(({ label, requirement: req }) => (
          <PasswordRequirement key={label} label={label} requirement={req} />
        ))}
      </ul>
    </div>
  );
}

function PasswordRequirement({
  label,
  requirement: accepted,
}: RequirementProps) {
  return (
    <li className="flex items-start gap-2 text-sm font-medium min-[300px]:items-center">
      <span
        className={cn(
          "inline-block size-2 shrink-0 rounded-full border border-primary transition-colors",
          accepted ? "bg-primary" : "bg-[#eefafe]",
        )}
      />
      <span>{label}</span>
    </li>
  );
}
