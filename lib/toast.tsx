import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from "lucide-react";
import { toast, type ExternalToast } from "sonner";

export const showSuccessToast = (message: string | React.ReactNode, data?: ExternalToast) =>
  toast.success(message, {
    icon: <CheckCircleIcon className="size-5 text-success" />,
    ...{
      dismissible: true,
      classNames: {
        toast: "border-success",
        closeButton: "border-success text-success ",
      },
      ...data,
    },
  });

export const showErrorToast = (message: string | React.ReactNode, data?: ExternalToast) =>
  toast.error(message, {
    icon: <XCircleIcon className="size-5 text-destructive" />,
    ...{
      dismissible: true,
      classNames: {
        toast: "border-destructive",
        closeButton: "border-destructive text-destructive",
      },
      ...data,
    },
  });

export const showInfoToast = (message: string | React.ReactNode, data?: ExternalToast) =>
  toast.info(message, {
    icon: <InfoIcon className="size-5 text-primary" />,
    ...{
      dismissible: true,
      ...data,
      classNames: {
        toast: "border-primary",
        closeButton: "border-primary text-primary ",
      },
    },
  });

export const showLoadingToast = (message: string | React.ReactNode, data?: ExternalToast) =>
  toast.loading(message, data);

export const showWarningToast = (message: string | React.ReactNode, data?: ExternalToast) =>
  toast.warning(message, {
    icon: <AlertCircleIcon className="size-5 text-warning" />,
    ...{
      dismissible: true,
      ...data,
      classNames: {
        toast: "border-warning",
        closeButton: "border-warning text-warning ",
      },
    },
  });

export const dismissToast = (id?: number | string) => toast.dismiss(id);

export const renderList = (list: string[]) => (
  <ul>
    {list.map((item, i) => (
      <li className="list-inside list-disc text-sm text-muted-foreground" key={i}>
        {item}
      </li>
    ))}
  </ul>
);
