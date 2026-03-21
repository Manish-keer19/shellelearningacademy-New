import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, Eye, Calendar } from "lucide-react";

const payrollData = [
  {
    id: 1,
    employee: {
      name: "Priya Sharma",
      role: "Sales Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    },
    basic: 45000,
    incentive: 8000,
    commission: 21000,
    deductions: 5400,
    netPay: 68600,
    status: "Processed",
  },
  {
    id: 2,
    employee: {
      name: "Rahul Kumar",
      role: "Content Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    },
    basic: 38000,
    incentive: 5000,
    commission: 0,
    deductions: 4560,
    netPay: 38440,
    status: "Processed",
  },
  {
    id: 3,
    employee: {
      name: "Anita Patel",
      role: "Marketing Executive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita",
    },
    basic: 32000,
    incentive: 3500,
    commission: 9900,
    deductions: 3840,
    netPay: 41560,
    status: "Pending",
  },
  {
    id: 4,
    employee: {
      name: "Vikram Singh",
      role: "Support Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    },
    basic: 42000,
    incentive: 6000,
    commission: 19000,
    deductions: 5040,
    netPay: 61960,
    status: "Processed",
  },
  {
    id: 5,
    employee: {
      name: "Neha Gupta",
      role: "HR Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha",
    },
    basic: 48000,
    incentive: 0,
    commission: 0,
    deductions: 5760,
    netPay: 42240,
    status: "Processed",
  },
];

const Payroll = () => {
  const totalPayroll = payrollData.reduce((sum, p) => sum + p.netPay, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Payroll & Salary
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage salaries, incentives and payslips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            December 2024
          </Button>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Payroll</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹{(totalPayroll / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Basic</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹
            {(payrollData.reduce((s, p) => s + p.basic, 0) / 100000).toFixed(2)}
            L
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Incentives</p>
          <p className="text-2xl font-bold text-primary mt-1">
            ₹
            {(
              payrollData.reduce((s, p) => s + p.incentive + p.commission, 0) /
              1000
            ).toFixed(0)}
            K
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Deductions</p>
          <p className="text-2xl font-bold text-destructive mt-1">
            ₹
            {(payrollData.reduce((s, p) => s + p.deductions, 0) / 1000).toFixed(
              0,
            )}
            K
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Employee
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Basic
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Incentive
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Commission
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Deductions
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Net Pay
                </TableHead>
                <TableHead className="font-semibold text-foreground text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={item.employee.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {item.employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.employee.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.employee.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    ₹{item.basic.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    ₹{item.incentive.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-primary font-medium">
                    ₹{item.commission.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    -₹{item.deductions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">
                    ₹{item.netPay.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`status-badge ${
                        item.status === "Processed"
                          ? "status-active"
                          : "status-warning"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
