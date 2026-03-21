import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, GripVertical, Clock, User, MoreVertical } from "lucide-react";
import { cn } from "@/ems/lib/utils";

const columns = [
  {
    id: "pending",
    title: "Pending",
    color: "bg-muted",
    tasks: [
      {
        id: 1,
        title: "Update course curriculum",
        priority: "High",
        dueDate: "Dec 26",
        assignee: {
          name: "Priya",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        },
      },
      {
        id: 2,
        title: "Review student feedback",
        priority: "Medium",
        dueDate: "Dec 27",
        assignee: {
          name: "Rahul",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
        },
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-primary/10",
    tasks: [
      {
        id: 3,
        title: "Create marketing campaign",
        priority: "High",
        dueDate: "Dec 25",
        assignee: {
          name: "Anita",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita",
        },
      },
      {
        id: 4,
        title: "Prepare Q4 report",
        priority: "Medium",
        dueDate: "Dec 28",
        assignee: {
          name: "Sanjay",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sanjay",
        },
      },
      {
        id: 5,
        title: "Update website content",
        priority: "Low",
        dueDate: "Dec 30",
        assignee: {
          name: "Neha",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha",
        },
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-warning/10",
    tasks: [
      {
        id: 6,
        title: "New course outline",
        priority: "High",
        dueDate: "Dec 24",
        assignee: {
          name: "Vikram",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
        },
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    color: "bg-accent",
    tasks: [
      {
        id: 7,
        title: "Setup LMS integration",
        priority: "High",
        dueDate: "Dec 20",
        assignee: {
          name: "Kavita",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavita",
        },
      },
      {
        id: 8,
        title: "Employee onboarding docs",
        priority: "Medium",
        dueDate: "Dec 18",
        assignee: {
          name: "Amit",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
        },
      },
    ],
  },
];

const Tasks = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Tasks & Workflow
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track team tasks
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", column.color)} />
                <h3 className="font-semibold text-foreground">
                  {column.title}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({column.tasks.length})
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                      <span
                        className={cn(
                          "status-badge text-[10px]",
                          task.priority === "High" && "status-error",
                          task.priority === "Medium" && "status-warning",
                          task.priority === "Low" && "status-active",
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.dueDate}
                    </div>
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {task.assignee.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full p-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
