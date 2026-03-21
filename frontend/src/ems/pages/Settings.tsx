import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Shield,
  Clock,
  Calendar,
  Bell,
  Building,
  Save,
} from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="bg-muted p-1 flex-wrap h-auto gap-1">
          <TabsTrigger
            value="organization"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Building className="w-4 h-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Shield className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Clock className="w-4 h-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="leave"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
            <span className="sm:hidden">Leave</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="section-header mb-6">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input defaultValue="Shell E-Learning Academy" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="admin@shell.edu" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input defaultValue="www.shell-elearning.edu" />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="section-header mb-6">Role Permissions</h3>
            <div className="space-y-6">
              {["Super Admin", "Admin", "Manager", "Employee"].map((role) => (
                <div
                  key={role}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{role}</p>
                      <p className="text-sm text-muted-foreground">
                        {role === "Super Admin"
                          ? "Full access to all modules"
                          : role === "Admin"
                            ? "Access to most modules"
                            : role === "Manager"
                              ? "Team management access"
                              : "Limited access"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Permissions
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="section-header mb-6">Attendance Rules</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Work Start Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label>Work End Time</Label>
                  <Input type="time" defaultValue="18:00" />
                </div>
                <div className="space-y-2">
                  <Label>Grace Period (minutes)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label>Half Day After (hours)</Label>
                  <Input type="number" defaultValue="4" />
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Allow Remote Check-in
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Employees can mark attendance from anywhere
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Require Photo Verification
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Selfie required during check-in
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="section-header mb-6">Leave Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Casual Leave (per year)</Label>
                <Input type="number" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <Label>Sick Leave (per year)</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label>Privilege Leave (per year)</Label>
                <Input type="number" defaultValue="15" />
              </div>
            </div>
            <div className="space-y-4 pt-6 mt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Allow Negative Balance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Let employees take leave in advance
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Carry Forward Leave
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Unused leaves carry to next year
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="section-header mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Leave Requests",
                  desc: "Get notified when employees request leave",
                },
                {
                  title: "Task Updates",
                  desc: "Notifications for task status changes",
                },
                {
                  title: "Daily Reports",
                  desc: "Receive daily work report summaries",
                },
                {
                  title: "Attendance Alerts",
                  desc: "Alerts for late arrivals and absences",
                },
                {
                  title: "Target Achievements",
                  desc: "Celebrate when targets are met",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
