import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/ems/lib/utils";

const performers = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Sales Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    score: 98,
    trend: "up",
    badge: "Top Performer",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    role: "Content Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    score: 94,
    trend: "up",
    badge: null,
  },
  {
    id: 3,
    name: "Anita Patel",
    role: "Marketing Exec",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita",
    score: 91,
    trend: "up",
    badge: null,
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Support Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    score: 67,
    trend: "down",
    badge: "Needs Attention",
  },
];

export function TopPerformers() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="section-header">Performance Insights</h3>
      </div>
      <div className="space-y-4">
        {performers.map((performer, index) => (
          <div
            key={performer.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-sm font-medium text-muted-foreground w-4">
              {index + 1}
            </span>
            <Avatar className="w-10 h-10">
              <AvatarImage src={performer.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {performer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {performer.name}
                </p>
                {performer.badge && (
                  <span
                    className={cn(
                      "status-badge text-[10px]",
                      performer.badge === "Top Performer"
                        ? "status-active"
                        : "status-warning"
                    )}
                  >
                    {performer.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{performer.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {performer.score}%
              </span>
              {performer.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
