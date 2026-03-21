import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const approvals = [
  {
    id: 1,
    type: "Leave Request",
    employee: "Amit Verma",
    details: "Casual Leave - Dec 26-27",
    submitted: "2 hours ago",
  },
  {
    id: 2,
    type: "Expense Claim",
    employee: "Neha Gupta",
    details: "Travel Reimbursement - ₹4,500",
    submitted: "5 hours ago",
  },
  {
    id: 3,
    type: "Task Review",
    employee: "Sanjay Mehta",
    details: "Q4 Marketing Report",
    submitted: "1 day ago",
  },
];

export function PendingApprovals() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          <h3 className="section-header">Pending Approvals</h3>
        </div>
        <span className="status-badge status-warning">{approvals.length} pending</span>
      </div>
      <div className="space-y-4">
        {approvals.map((approval, index) => (
          <div
            key={approval.id}
            className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {approval.type}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  by {approval.employee}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {approval.submitted}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {approval.details}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1 gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
