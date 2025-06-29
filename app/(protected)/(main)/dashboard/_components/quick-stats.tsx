import type { StatTrend } from "@/types/dashboard";
import { statMeta } from "@/config/stat-meta";
import { QuickStat } from "@/types/dashboard";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuickStatsProps = {
  initialData: QuickStat[];
};
export function QuickStats({ initialData }: QuickStatsProps) {
  const data = initialData;

  return (
    <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2 @7xl/main:grid-cols-4">
      {data.map((item, idx) => (
        <div key={idx} className="">
          <QuickStatItem {...item} />
        </div>
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
    <Card className="py-4">
      <div className="flex w-full items-center justify-between px-4">
        <div className="w-full space-y-4">
          <div className="flex w-full items-start justify-between">
            <CardHeader className="flex-1 px-0!">
              <CardTitle className="text-sm font-semibold text-accent-foreground">
                {label}
              </CardTitle>
              <CardDescription className="mt-1 text-2xl font-bold text-foreground">
                {value}
              </CardDescription>
            </CardHeader>

            <meta.icon className="size-6" style={{ color: `var(${meta.color})` }} />
          </div>

          <CardContent
            className="mt-1 flex items-center px-0 text-sm"
            style={{ color: `var(${statTrend.color})` }}
          >
            <p className="flex">
              <statTrend.icon className="mt-0.5 mr-1 size-4" />
              <span className="font-light">
                {trend === "neutral" ? "No change" : change} from last month
              </span>
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
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
