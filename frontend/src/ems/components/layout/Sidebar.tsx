import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Target,
  DollarSign,
  GraduationCap,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/ems/lib/utils";
import { useSelector } from "react-redux";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/ems",
    roles: ["Super Admin", "Manager"],
  },
  {
    icon: Users,
    label: "Employees",
    path: "/ems/employees",
    roles: ["Super Admin", "Manager"],
  },
  {
    icon: Target,
    label: "Leads & Sales",
    path: "/ems/leads",
    roles: ["Super Admin", "Manager", "Employee"],
  },
  {
    icon: DollarSign,
    label: "Targets & Commissions",
    path: "/ems/targets",
    roles: ["Super Admin", "Manager"],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const location = useLocation();
  // @ts-ignore
  const { user } = useSelector((state: any) => state.auth);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.accountType),
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in overflow-hidden">
              <span className="font-bold text-foreground text-sm leading-tight whitespace-nowrap">
                Shell E-Learning
              </span>
              <span className="text-xs text-muted-foreground">Academy</span>
            </div>
          )}
        </Link>
        {/* Mobile close button */}
        <button
          className="md:hidden ml-auto p-1 rounded-lg hover:bg-sidebar-accent text-muted-foreground"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "nav-item",
                    isActive && "nav-item-active",
                    collapsed && "justify-center px-2",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle — desktop only */}
      <div className="hidden md:block p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            collapsed && "justify-center px-2",
          )}
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
