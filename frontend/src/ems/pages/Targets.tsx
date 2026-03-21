import { useState, useEffect } from "react";
import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { EmsDashboardSkeleton } from "@/ems/components/EmsDashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Award, IndianRupee, Loader2 } from "lucide-react";
import { cn } from "@/ems/lib/utils";
import emsService from "@/service/ems.service";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Targets = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [targetData, setTargetData] = useState({ employeeId: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // @ts-ignore
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      // If employee, maybe backend filters it? Or we filter here.
      // Admin/Manager gets all. Employee gets self?
      // existing endpoint /admin-ems/staff does filtering based on role?
      // Let's assume it returns relevant users.
      const response = await emsService.getAllStaff();
      if (response.success) {
        let users = response.users;
        // Filter out non-employees if necessary or just show everyone with performance stats
        if (user?.accountType === "Employee") {
          users = users.filter((u: any) => u._id === user._id);
        } else {
          // For manager, show employees
          users = users.filter((u: any) => u.accountType === "Employee");
        }
        setStaff(users);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTarget = async () => {
    if (!targetData.employeeId || !targetData.amount) {
      toast({
        title: "Error",
        description: "All fields required",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await emsService.assignTarget({
        employeeId: targetData.employeeId,
        targetAmount: parseFloat(targetData.amount),
      });
      toast({ title: "Success", description: "Target assigned successfully" });
      setIsTargetOpen(false);
      fetchStaff();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const totalTarget = staff.reduce(
    (sum, s) => sum + (s.employeePerformance?.monthlyTarget || 0),
    0,
  );
  const totalAchieved = staff.reduce(
    (sum, s) => sum + (s.employeePerformance?.achievedTarget || 0),
    0,
  );
  const totalCommission = staff.reduce(
    (sum, s) => sum + (s.employeePerformance?.totalCommissionEarned || 0),
    0,
  );
  const overallProgress =
    totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  if (isLoading) {
    return <EmsDashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Targets & Commissions
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track sales targets and commission payouts
          </p>
        </div>
        {(user?.accountType === "Manager" ||
          user?.accountType === "Super Admin") && (
          <Dialog open={isTargetOpen} onOpenChange={setIsTargetOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Target className="w-4 h-4" />
                Set Targets
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Monthly Target</DialogTitle>
                <DialogDescription>
                  Assign sales target to an employee.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Employee</Label>
                  <Select
                    value={targetData.employeeId}
                    onValueChange={(val) =>
                      setTargetData({ ...targetData, employeeId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Amount</Label>
                  <Input
                    type="number"
                    value={targetData.amount}
                    onChange={(e) =>
                      setTargetData({ ...targetData, amount: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAssignTarget} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Assign Target"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
        <div className="bg-card rounded-xl border border-border p-5 sm:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="kpi-icon">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {overallProgress.toFixed(1)}%
              </p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-muted-foreground">
              Achieved: ₹{(totalAchieved / 100000).toFixed(2)}L
            </span>
            <span className="text-muted-foreground">
              Target: ₹{(totalTarget / 100000).toFixed(2)}L
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="kpi-icon">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ₹{(totalCommission / 1000).toFixed(1)}K
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Total Commissions
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="kpi-icon">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {
              staff.filter((s) => {
                const t = s.employeePerformance?.monthlyTarget || 0;
                const a = s.employeePerformance?.achievedTarget || 0;
                return t > 0 && a / t >= 0.9;
              }).length
            }
          </p>
          <p className="text-sm text-muted-foreground mt-1">On Target (90%+)</p>
        </div>
      </div>

      {/* Individual Targets */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="section-header">Individual Performance</h3>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : staff.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No employees found.
            </div>
          ) : (
            staff.map((employee, index) => {
              const target = employee.employeePerformance?.monthlyTarget || 0;
              const achieved =
                employee.employeePerformance?.achievedTarget || 0;
              const commission =
                employee.employeePerformance?.totalCommissionEarned || 0;
              const progress = target > 0 ? (achieved / target) * 100 : 0;
              const remaining = Math.max(0, target - achieved);

              return (
                <div
                  key={employee._id}
                  className="p-6 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                      <AvatarImage src={employee.image} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {employee.fullName ? employee.fullName[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {employee.fullName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {employee.accountType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ₹{commission.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Commission
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Achieved: ₹{achieved.toFixed(0)}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          progress >= 90
                            ? "text-success"
                            : progress >= 70
                              ? "text-warning"
                              : "text-destructive",
                        )}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className={cn(
                        "h-2",
                        progress >= 90 && "[&>div]:bg-success",
                        progress >= 70 && progress < 90 && "[&>div]:bg-warning",
                        progress < 70 && "[&>div]:bg-destructive",
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Remaining: ₹{remaining.toFixed(0)}</span>
                      <span>Target: ₹{target.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Targets;
