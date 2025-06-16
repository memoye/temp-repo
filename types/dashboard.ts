export type StatTrend = "up" | "down" | "neutral";
export interface QuickStat {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend?: StatTrend;
}
