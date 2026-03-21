import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  PalmtreeIcon,
} from "lucide-react";
import { cn } from "@/ems/lib/utils";

const leaveRequests = [
  {
    id: 1,
    employee: {
      name: "Amit Verma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
    },
    type: "Casual Leave",
    dates: "Dec 26-27, 2024",
    days: 2,
    reason: "Personal work",
    status: "pending",
    appliedOn: "Dec 23, 2024",
  },
  {
    id: 2,
    employee: {
      name: "Neha Gupta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha",
    },
    type: "Sick Leave",
    dates: "Dec 20, 2024",
    days: 1,
    reason: "Not feeling well",
    status: "approved",
    appliedOn: "Dec 19, 2024",
  },
  {
    id: 3,
    employee: {
      name: "Sanjay Mehta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sanjay",
    },
    type: "Privilege Leave",
    dates: "Jan 2-6, 2025",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    appliedOn: "Dec 22, 2024",
  },
];

const leaveBalance = [
  { type: "Casual Leave", used: 6, total: 12, color: "bg-primary" },
  { type: "Sick Leave", used: 3, total: 10, color: "bg-warning" },
  { type: "Privilege Leave", used: 5, total: 15, color: "bg-success" },
];

const Leaves = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Leave Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and approve leave requests
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Apply Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Requests */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="section-header">Leave Requests</h3>
          {leaveRequests.map((request, index) => (
            <div
              key={request.id}
              className="bg-card rounded-xl border border-border p-5 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={request.employee.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {request.employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {request.employee.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Applied on {request.appliedOn}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "status-badge",
                    request.status === "approved" && "status-active",
                    request.status === "pending" && "status-warning",
                    request.status === "rejected" && "status-error",
                  )}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dates</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.dates}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.days} day{request.days > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.reason}
                  </p>
                </div>
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" className="flex-1 gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Leave Balance */}
        <div className="space-y-4">
          <h3 className="section-header">Leave Balance</h3>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="kpi-icon">
                <PalmtreeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Days Available</p>
              </div>
            </div>

            <div className="space-y-5">
              {leaveBalance.map((leave) => (
                <div key={leave.type}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">
                      {leave.type}
                    </span>
                    <span className="text-muted-foreground">
                      {leave.used}/{leave.total} used
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        leave.color,
                      )}
                      style={{
                        width: `${(leave.used / leave.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="font-medium text-foreground mb-4">This Month</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    Pending Requests
                  </span>
                </div>
                <span className="font-semibold text-foreground">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">
                    Approved
                  </span>
                </div>
                <span className="font-semibold text-foreground">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Team on Leave
                  </span>
                </div>
                <span className="font-semibold text-foreground">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
