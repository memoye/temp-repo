import type { StatTrend } from "@/types/dashboard";
import { statMeta } from "@/data/static/stat-meta";
import { QuickStat } from "@/types/dashboard";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type QuickStatsProps = {
  initialData: QuickStat[];
};
export function QuickStats({ initialData }: QuickStatsProps) {
  const data = initialData;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item, idx) => (
        <QuickStatItem key={idx} {...item} />
      ))}
    </div>
  );
}

type QuickStatItemProps = {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend?: StatTrend;
};
export function QuickStatItem({ id, label, value, change, trend }: QuickStatItemProps) {
  const meta = statMeta[(id as keyof typeof statMeta) || "unknown"];
  const statTrend = getStatTrend(trend);

  return (
    <div className="rounded-lg border bg-background px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-accent-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground xl:text-3xl">{value}</p>
          <div
            className="mt-1 flex items-center text-sm"
            style={{ color: `var(${statTrend.color})` }}
          >
            <statTrend.icon className="mr-1 size-4" />
            <span className="font-light">
              {trend === "neutral" ? "No change" : change} from last month
            </span>
          </div>
        </div>
        <div style={{ backgroundColor: `var(${meta.color})` }} className="rounded-lg p-3">
          <meta.icon className="size-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function getStatTrend(trend?: StatTrend) {
  switch (trend) {
    case "up":
      return { color: "--color-success", icon: TrendingUpIcon };
    case "down":
      return { color: "--color-destructive", icon: TrendingDownIcon };
    case "neutral":
      return { color: "--color-muted-foreground", icon: MinusIcon };
    default:
      return { color: "--color-muted-foreground", icon: MinusIcon };
  }
}
