// import { CasesTable } from "../cases/_components/cases-table";
import { auth } from "@/auth";
import {
  AlertTriangleIcon,
  Calendar,
  ChevronRight,
  ClockIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  ReceiptIcon,
  ScaleIcon,
} from "lucide-react";
import { QuickStats } from "./_components/quick-stats";
import { QuickStat } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";

const quickStats = [
  { id: "cases", label: "Active Cases", value: 34, change: "+12%", trend: "up" },
  {
    id: "revenue",
    label: "Pending Invoices",
    value: formatCurrency(24_350),
    change: "+8%",
    trend: "up",
  },
  {
    id: "time",
    label: "Hours This Month",
    value: 156.5,
    change: "-5%",
    trend: "down",
  },
  { id: "clients", label: "Active Clients", value: 28, change: "+3%", trend: "neutral" },
] satisfies QuickStat[];

const recentCases = [
  {
    id: "C-2024-001",
    client: "ABC Corp",
    type: "Contract Dispute",
    status: "Discovery",
    priority: "High",
    dueDate: "2024-06-20",
  },
  {
    id: "C-2024-002",
    client: "Johnson Estate",
    type: "Probate",
    status: "Filing",
    priority: "Medium",
    dueDate: "2024-06-25",
  },
  {
    id: "C-2024-003",
    client: "Smith Industries",
    type: "Employment Law",
    status: "Negotiation",
    priority: "High",
    dueDate: "2024-06-18",
  },
];

const upcomingDeadlines = [
  {
    case: "ABC Corp Contract Dispute",
    task: "Discovery Response Due",
    date: "2024-06-18",
    days: 3,
  },
  {
    case: "Johnson Estate Probate",
    task: "Court Filing Deadline",
    date: "2024-06-20",
    days: 5,
  },
  {
    case: "Smith Industries Employment",
    task: "Mediation Session",
    date: "2024-06-22",
    days: 7,
  },
];

const recentActivity = [
  {
    action: "New case created",
    details: "Personal Injury - Williams vs. City",
    time: "2 hours ago",
  },
  { action: "Invoice sent", details: "$3,250 to ABC Corp", time: "4 hours ago" },
  {
    action: "Document uploaded",
    details: "Contract Amendment - Smith Industries",
    time: "6 hours ago",
  },
  { action: "Time entry logged", details: "2.5 hours - Case research", time: "1 day ago" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-xl font-bold">
          Hi, {session?.user?.given_name} {session?.user?.family_name}! 👋
        </h1>

        <p className="text-foreground-light font-medium">
          {/* {session?.user?.Tenant.endsWith("s") ? `${user_info?.Tenant}'` : `${user_info?.Tenant}'s`}{" "} */}
          {/* Chronica Workspace. */}
          Welcome to Chronica! Designed to transform the way you manage your law firm.
          {/* <br /> Here are some simple steps to get you started. */}
        </p>
      </section>

      <div className="space-y-6">
        {/* Quick Stats */}
        <QuickStats initialData={quickStats} />

        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => {
            const TrendIcon = getTrendIcon(stat.trend);
            const trendColorClass = getTrendColor(stat.trend);
            const changeText = formatChange(stat.change, stat.trend);

            return (
              <div key={index} className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className={`mt-1 flex items-center text-sm ${trendColorClass}`}>
                      <TrendIcon className="mr-1 h-4 w-4" />
                      <span className="font-medium">{changeText}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <stat.icon className="h-6 w-6 text-background" />
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Recent Cases */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Cases</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-accent-foreground hover:text-foreground">
                      <FilterIcon className="h-4 w-4" />
                    </button>
                    <button className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary">
                      <PlusIcon className="mr-1 h-4 w-4" />
                      New Case
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Case ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-accent-foreground uppercase">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-background">
                    {recentCases.map((case_, index) => (
                      <tr key={index} className="cursor-pointer hover:bg-muted">
                        <td className="backgroundspace-nowrap px-6 py-4 text-sm font-medium text-primary">
                          {case_.id}
                        </td>
                        <td className="backgroundspace-nowrap px-6 py-4 text-sm text-foreground">
                          {case_.client}
                        </td>
                        <td className="backgroundspace-nowrap px-6 py-4 text-sm text-accent-foreground">
                          {case_.type}
                        </td>
                        <td className="backgroundspace-nowrap px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                            {case_.status}
                          </span>
                        </td>
                        <td className="backgroundspace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              case_.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {case_.priority}
                          </span>
                        </td>
                        <td className="backgroundspace-nowrap px-6 py-4 text-sm text-accent-foreground">
                          {case_.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t p-6">
                <button className="flex items-center text-sm font-medium text-primary hover:text-primary">
                  View All Cases <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              </div>
              <div className="space-y-4 p-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="mt-2 size-2 rounded-full bg-primary"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-accent-foreground">{activity.details}</p>
                      <p className="mt-1 text-xs text-accent-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-6">
                <button className="flex items-center text-sm font-medium text-primary hover:text-primary">
                  View All Activity <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <button className="flex flex-col items-center rounded-lg p-4 text-center transition-colors hover:bg-muted">
                    <ScaleIcon className="mb-2 h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">New Case</span>
                  </button>
                  <button className="flex flex-col items-center rounded-lg p-4 text-center transition-colors hover:bg-muted">
                    <ReceiptIcon className="mb-2 h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium text-foreground">Create Invoice</span>
                  </button>
                  <button className="flex flex-col items-center rounded-lg p-4 text-center transition-colors hover:bg-muted">
                    <ClockIcon className="mb-2 h-8 w-8 text-purple-600" />
                    <span className="text-sm font-medium text-foreground">Log Time</span>
                  </button>
                  <button className="flex flex-col items-center rounded-lg p-4 text-center transition-colors hover:bg-muted">
                    <FileTextIcon className="mb-2 h-8 w-8 text-orange-600" />
                    <span className="text-sm font-medium text-foreground">New Document</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="border-b p-6">
                <div className="flex items-center">
                  <AlertTriangleIcon className="mr-2 h-5 w-5 text-destructive" />
                  <h2 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h2>
                </div>
              </div>
              <div className="space-y-4 p-6">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-start space-x-3 rounded-lg p-3 hover:bg-muted"
                  >
                    <div
                      className={`mt-2 size-2 rounded-full ${
                        deadline.days <= 3
                          ? "bg-destructive"
                          : deadline.days <= 7
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {deadline.task}
                      </p>
                      <p className="truncate text-sm text-accent-foreground">
                        {deadline.case}
                      </p>
                      <p className="mt-1 text-xs text-accent-foreground">
                        {deadline.days} days remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-6">
                <button className="flex items-center text-sm font-medium text-primary/90 hover:text-primary">
                  View All Deadlines <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="rounded-lg border bg-background shadow-sm">
              <div className="border-b p-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-muted">
                  <div className="h-12 w-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Client Meeting</p>
                    <p className="text-sm text-accent-foreground">
                      ABC Corp - Contract Review
                    </p>
                    <p className="text-xs text-accent-foreground">10:00 AM - 11:30 AM</p>
                  </div>
                </div>
                <div className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-muted">
                  <div className="h-12 w-2 rounded-full bg-success"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Court Appearance</p>
                    <p className="text-sm text-accent-foreground">Smith vs. Johnson Hearing</p>
                    <p className="text-xs text-accent-foreground">2:00 PM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-muted">
                  <div className="h-12 w-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Team Meeting</p>
                    <p className="text-sm text-accent-foreground">Weekly Case Review</p>
                    <p className="text-xs text-accent-foreground">5:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
