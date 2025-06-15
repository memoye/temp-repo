import {
  ClockIcon,
  FileChartColumn,
  FileCheckIcon,
  FilesIcon,
  ReceiptIcon,
  ScaleIcon,
  UserSquare2Icon,
} from "lucide-react";

export const statMeta = {
  cases: { icon: ScaleIcon, color: "--color-blue-500" },
  clients: { icon: UserSquare2Icon, color: "--color-orange-500" },
  documents: { icon: FilesIcon, color: "--color-secondary" },
  revenue: { icon: ReceiptIcon, color: "--color-green-500" },
  tasks: { icon: FileCheckIcon, color: "--color-yellow-500" },
  time: { icon: ClockIcon, color: "--color-purple-500" },
  unknown: { icon: FileChartColumn, color: "--color-primary" },
};
