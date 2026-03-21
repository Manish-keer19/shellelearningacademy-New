import { Users, UserCheck, UserX, Clock } from "lucide-react";

const stats = [
  { label: "Total", value: 156, icon: Users, color: "text-foreground" },
  { label: "Present", value: 142, icon: UserCheck, color: "text-success" },
  { label: "Absent", value: 8, icon: UserX, color: "text-destructive" },
  { label: "Late", value: 6, icon: Clock, color: "text-warning" },
];

export function AttendanceOverview() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <h3 className="section-header mb-6">Today's Attendance</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Attendance Rate</span>
          <span className="font-semibold text-success">91.2%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: "91.2%" }}
          />
        </div>
      </div>
    </div>
  );
}
