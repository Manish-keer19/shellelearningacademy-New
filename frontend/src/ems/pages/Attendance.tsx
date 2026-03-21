import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/ems/lib/utils";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Sample attendance data
const attendanceData: Record<string, "present" | "absent" | "late" | "leave"> =
  {
    "2024-12-02": "present",
    "2024-12-03": "present",
    "2024-12-04": "late",
    "2024-12-05": "present",
    "2024-12-06": "present",
    "2024-12-09": "present",
    "2024-12-10": "absent",
    "2024-12-11": "present",
    "2024-12-12": "present",
    "2024-12-13": "late",
    "2024-12-16": "leave",
    "2024-12-17": "leave",
    "2024-12-18": "present",
    "2024-12-19": "present",
    "2024-12-20": "present",
    "2024-12-23": "present",
    "2024-12-24": "present",
  };

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const stats = [
    { label: "Present", value: 18, icon: UserCheck, color: "text-success" },
    { label: "Absent", value: 1, icon: UserX, color: "text-destructive" },
    { label: "Late", value: 2, icon: Clock, color: "text-warning" },
    {
      label: "On Leave",
      value: 2,
      icon: AlertCircle,
      color: "text-muted-foreground",
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Attendance
        </h1>
        <p className="text-muted-foreground mt-1">
          Track and manage employee attendance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg bg-muted flex items-center justify-center",
                stat.color,
              )}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-header">
            {months[month]} {year}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {/* Day Headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-1 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-3" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateKey = getDateKey(day);
            const status = attendanceData[dateKey];
            const isWeekend =
              new Date(year, month, day).getDay() === 0 ||
              new Date(year, month, day).getDay() === 6;
            const isToday = day === 24 && month === 11 && year === 2024;

            return (
              <div
                key={day}
                className={cn(
                  "p-1 sm:p-3 rounded-lg text-center transition-all cursor-pointer hover:bg-muted",
                  isWeekend && "text-muted-foreground",
                  isToday && "ring-2 ring-primary ring-offset-2",
                  status === "present" && "bg-accent",
                  status === "absent" && "bg-destructive/10",
                  status === "late" && "bg-warning/10",
                  status === "leave" && "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium",
                    status === "present" && "text-primary",
                    status === "absent" && "text-destructive",
                    status === "late" && "text-warning",
                  )}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <span className="text-sm text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/10" />
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/10" />
            <span className="text-sm text-muted-foreground">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span className="text-sm text-muted-foreground">Leave</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
