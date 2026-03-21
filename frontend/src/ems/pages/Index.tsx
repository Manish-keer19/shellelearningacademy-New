import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { KPICard } from "@/ems/components/dashboard/KPICard";
import { RevenueChart } from "@/ems/components/dashboard/RevenueChart";
import { PerformanceChart } from "@/ems/components/dashboard/PerformanceChart";
import { TopPerformers } from "@/ems/components/dashboard/TopPerformers";
import { PendingApprovals } from "@/ems/components/dashboard/PendingApprovals";
import { AttendanceOverview } from "@/ems/components/dashboard/AttendanceOverview";
import { Users, UserCheck, ListTodo, IndianRupee } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emsService from "@/service/ems.service";

const Dashboard = () => {
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  // Redirect employees to leads page
  useEffect(() => {
    if (user?.accountType === "Employee") {
      navigate("/ems/leads", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.accountType === "Employee") return;
      try {
        const res = await emsService.getDashboardStats();
        if (res.success) {
          setStats(res);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user]);

  // Get first name
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "User";

  const kpi = stats?.kpi || {
    totalEmployees: { value: 0, subtext: "+0 this month" },
    presentToday: { value: 0, subtext: "0% attendance" },
    activeTasks: { value: 0, subtext: "0 due today" },
    monthlyRevenue: { value: 0, subtext: "+0% vs last month" },
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {firstName}! Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Employees"
          value={kpi.totalEmployees.value}
          icon={Users}
          change={kpi.totalEmployees.subtext}
          changeType="positive"
        />
        <KPICard
          title="Present Today"
          value={kpi.presentToday.value}
          icon={UserCheck}
          change={kpi.presentToday.subtext}
          changeType="positive"
        />
        <KPICard
          title="Active Tasks"
          value={kpi.activeTasks.value}
          icon={ListTodo}
          change={kpi.activeTasks.subtext}
          changeType="neutral"
        />
        <KPICard
          title="Monthly Revenue"
          value={`₹${(kpi.monthlyRevenue.value / 100000).toFixed(1)}L`}
          icon={IndianRupee}
          change={kpi.monthlyRevenue.subtext}
          changeType="positive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={stats?.charts?.revenue} />
        <PerformanceChart data={stats?.charts?.performance} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <TopPerformers /> */}
        {/* <PendingApprovals /> */}
        {/* <AttendanceOverview /> */}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
