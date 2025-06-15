interface SettingsItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  disabled?: boolean;
  hidden?: boolean;
  permissions?: string[];
  // Optional badge for new/coming soon features
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}
