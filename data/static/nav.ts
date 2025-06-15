import {
  BarChart3Icon,
  Calendar1Icon,
  ClockIcon,
  FileCheckIcon,
  FilesIcon,
  LayersIcon,
  LayoutDashboardIcon,
  NetworkIcon,
  ReceiptIcon,
  ScaleIcon,
  SettingsIcon,
  UsersIcon,
  UserSquare2Icon,
} from "lucide-react";

export const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Cases",
    url: "/cases",
    icon: ScaleIcon,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: UserSquare2Icon,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: FileCheckIcon,
  },
  {
    title: "Billing & Invoicing",
    url: "/invoices",
    icon: ReceiptIcon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar1Icon,
  },
  {
    title: "Document",
    url: "/documents",
    icon: FilesIcon,
  },
  {
    title: "Reporting & Analytics",
    url: "/reports",
    icon: BarChart3Icon,
  },
  {
    title: "Time Tracking",
    url: "/time-tracking",
    icon: ClockIcon,
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
  },
  {
    title: "CRM",
    icon: NetworkIcon,
    items: [
      {
        title: "Pipelines",
        url: "/pipelines",
      },
      {
        title: "Workflows",
        url: "/workflows",
      },
    ],
  },
  {
    title: "Template",
    url: "/template",
    icon: LayersIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];
