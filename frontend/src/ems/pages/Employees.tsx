import { useState, useEffect } from "react";
import { DashboardLayout } from "@/ems/components/layout/DashboardLayout";
import { EmsDashboardSkeleton } from "@/ems/components/EmsDashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/ems/lib/utils";
import emsService from "@/service/ems.service";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [iscreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // @ts-ignore
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    accountType: "Employee",
    contactNo: "",
    department: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await emsService.getAllStaff();
      if (response && response.users) {
        setEmployees(response.users);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await emsService.createUser(formData);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsCreateOpen(false);
        setFormData({
          fullName: "",
          email: "",
          accountType: "Employee",
          contactNo: "",
          department: "",
        });
        fetchEmployees();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const canCreateManager = user?.accountType === "Super Admin";

  if (isLoading) {
    return <EmsDashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Employees & Staff
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your team members and their roles
          </p>
        </div>

        <Dialog open={iscreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add {canCreateManager ? "Staff" : "Employee"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Add New {canCreateManager ? "Staff Member" : "Employee"}
              </DialogTitle>
              <DialogDescription>
                Create a new account. They will receive an email with login
                credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Phone
                </Label>
                <Input
                  id="contact"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="+91..."
                />
              </div>

              {canCreateManager && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, accountType: val })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Filter className="w-4 h-4" />
              <span className="sm:inline">Filters</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              <span className="sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Name & Email
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Target (₹)
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Achieved (₹)
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Commission (₹)
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <TableRow
                    key={employee._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={employee.image} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {employee.fullName
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {employee.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          employee.accountType === "Manager"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                        )}
                      >
                        {employee.accountType}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.contactNo || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.employeePerformance?.monthlyTarget || 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.employeePerformance?.achievedTarget || 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.employeePerformance?.totalCommissionEarned || 0}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "status-badge",
                          employee.active ? "status-active" : "status-inactive",
                        )}
                      >
                        {employee.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
