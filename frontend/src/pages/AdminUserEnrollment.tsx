import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, BookOpen, Loader2, CheckCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux";
import { adminService } from "@/service/admin.service";
import { useNavigate } from "react-router-dom";

const AdminUserEnrollment = () => {
    const navigate = useNavigate();
    const { user, accessToken, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("create");

    // Search and pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [courseSearchQuery, setCourseSearchQuery] = useState("");

    // Form states for creating new user
    const [newUserForm, setNewUserForm] = useState({
        fullName: "",
        email: "",
        password: "",
        contactNo: "",
        batch: "",
        state: "",
        college: "",
        courseId: "",
        accountType: "Student",
    });

    // Form state for enrolling existing user
    const [enrollForm, setEnrollForm] = useState({
        userId: "",
        courseId: "",
    });

    // Fetch courses and users on component mount
    useEffect(() => {
        // Wait for auth to finish loading before checking
        if (authLoading) {
            return;
        }

        if (!accessToken) {
            navigate("/auth");
            return;
        }

        if (user?.accountType !== "Admin") {
            toast.error("Access denied. Admin only.");
            navigate("/dashboard");
            return;
        }

        fetchCoursesAndUsers();
    }, [accessToken, user, navigate, authLoading]);

    const fetchCoursesAndUsers = async () => {
        setIsFetchingData(true);
        try {
            const [coursesRes, usersRes] = await Promise.all([
                adminService.getAllCoursesForEnrollment(accessToken),
                adminService.getAllUsers(accessToken),
            ]);

            setCourses(coursesRes.data || []);
            setUsers(usersRes.data || []);
        } catch (error: any) {
            console.error("Error fetching data:", error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setIsFetchingData(false);
        }
    };

    // Filtered and paginated users
    const filteredUsers = useMemo(() => {
        return users.filter((user: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                user.fullName?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.batch?.toLowerCase().includes(searchLower) ||
                user.college?.toLowerCase().includes(searchLower)
            );
        });
    }, [users, searchQuery]);

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Get available courses for selected user (exclude already enrolled courses)
    const availableCoursesForUser = useMemo(() => {
        if (!enrollForm.userId) return courses;

        const selectedUser = users.find((u: any) => u._id === enrollForm.userId);
        if (!selectedUser || !selectedUser.courses) return courses;

        // Get IDs of courses the user is already enrolled in
        const enrolledCourseIds = selectedUser.courses.map((c: any) => c._id);

        // Filter out already enrolled courses
        return courses.filter((course: any) => !enrolledCourseIds.includes(course._id));
    }, [courses, enrollForm.userId, users]);

    // Filtered courses for select dropdown
    const filteredCourses = useMemo(() => {
        if (!courseSearchQuery) return courses;
        return courses.filter((course: any) =>
            course.courseName?.toLowerCase().includes(courseSearchQuery.toLowerCase())
        );
    }, [courses, courseSearchQuery]);

    const handleCreateUserAndEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loadingToast = toast.loading("Creating user and enrolling...");

        try {
            const response = await adminService.createUserAndEnroll(
                newUserForm,
                accessToken
            );

            if (response.success) {
                toast.success(response.message, { id: loadingToast });
                // Reset form
                setNewUserForm({
                    fullName: "",
                    email: "",
                    password: "",
                    contactNo: "",
                    batch: "",
                    state: "",
                    college: "",
                    courseId: "",
                    accountType: "Student",
                });
                // Refresh users list
                await fetchCoursesAndUsers();
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            toast.error(
                error.response?.data?.message || "Failed to create user and enroll",
                { id: loadingToast }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnrollExistingUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loadingToast = toast.loading("Enrolling user in course...");

        try {
            const response = await adminService.enrollUserInCourse(
                enrollForm,
                accessToken
            );

            if (response.success) {
                toast.success(response.message, { id: loadingToast });
                // Reset form
                setEnrollForm({
                    userId: "",
                    courseId: "",
                });
                // Refresh users list
                await fetchCoursesAndUsers();
            }
        } catch (error: any) {
            console.error("Error enrolling user:", error);
            toast.error(
                error.response?.data?.message || "Failed to enroll user in course",
                { id: loadingToast }
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading screen while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
                    <p className="text-muted-foreground">Please wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
                        <span className="text-primary">Admin</span> User Enrollment
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Create new users and enroll them in courses without payment
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                                        Total Students
                                    </p>
                                    {isFetchingData ? (
                                        <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                                    ) : (
                                        <p className="text-3xl font-extrabold text-foreground">
                                            {users.length}
                                        </p>
                                    )}
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10">
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                                        Available Courses
                                    </p>
                                    {isFetchingData ? (
                                        <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                                    ) : (
                                        <p className="text-3xl font-extrabold text-foreground">
                                            {courses.length}
                                        </p>
                                    )}
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                                        Total Enrollments
                                    </p>
                                    {isFetchingData ? (
                                        <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                                    ) : (
                                        <p className="text-3xl font-extrabold text-foreground">
                                            {users.reduce(
                                                (acc, user: any) => acc + (user.courses?.length || 0),
                                                0
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/10">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content - Tabs */}
                <Card className="bg-card/90 backdrop-blur-sm border-border/70 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            User Enrollment Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="create" className="text-base">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Create & Enroll
                                </TabsTrigger>
                                <TabsTrigger value="enroll" className="text-base">
                                    <Users className="w-4 h-4 mr-2" />
                                    Enroll Existing
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Create New User and Enroll */}
                            <TabsContent value="create">
                                <form onSubmit={handleCreateUserAndEnroll} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="fullName"
                                                type="text"
                                                placeholder="Enter full name"
                                                value={newUserForm.fullName}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        fullName: e.target.value,
                                                    })
                                                }
                                                required
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter email address"
                                                value={newUserForm.email}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                required
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter password"
                                                value={newUserForm.password}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        password: e.target.value,
                                                    })
                                                }
                                                required
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Contact Number */}
                                        <div className="space-y-2">
                                            <Label htmlFor="contactNo">Contact Number</Label>
                                            <Input
                                                id="contactNo"
                                                type="tel"
                                                placeholder="Enter contact number"
                                                value={newUserForm.contactNo}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        contactNo: e.target.value,
                                                    })
                                                }
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Batch */}
                                        <div className="space-y-2">
                                            <Label htmlFor="batch">Batch</Label>
                                            <Input
                                                id="batch"
                                                type="text"
                                                placeholder="Enter batch (e.g., 2024)"
                                                value={newUserForm.batch}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        batch: e.target.value,
                                                    })
                                                }
                                                className="h-11"
                                            />
                                        </div>

                                        {/* State */}
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                placeholder="Enter state"
                                                value={newUserForm.state}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        state: e.target.value,
                                                    })
                                                }
                                                className="h-11"
                                            />
                                        </div>

                                        {/* College */}
                                        <div className="space-y-2">
                                            <Label htmlFor="college">College</Label>
                                            <Input
                                                id="college"
                                                type="text"
                                                placeholder="Enter college name"
                                                value={newUserForm.college}
                                                onChange={(e) =>
                                                    setNewUserForm({
                                                        ...newUserForm,
                                                        college: e.target.value,
                                                    })
                                                }
                                                className="h-11"
                                            />
                                        </div>

                                        {/* Account Type - Hidden, always Student */}
                                        <input type="hidden" value="Student" />

                                        {/* Course Selection */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="courseId">
                                                Enroll in Course (Optional)
                                            </Label>
                                            <Select
                                                value={newUserForm.courseId || undefined}
                                                onValueChange={(value) =>
                                                    setNewUserForm({ ...newUserForm, courseId: value })
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select a course to enroll (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courses.map((course: any) => (
                                                        <SelectItem key={course._id} value={course._id}>
                                                            {course.courseName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Creating User...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5 mr-2" />
                                                Create User & Enroll
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Tab 2: Enroll Existing User */}
                            <TabsContent value="enroll">
                                <form
                                    onSubmit={handleEnrollExistingUser}
                                    className="space-y-6"
                                >
                                    <div className="space-y-6">
                                        {/* User Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="userId">
                                                Select User <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={enrollForm.userId}
                                                onValueChange={(value) =>
                                                    setEnrollForm({ userId: value, courseId: "" })
                                                }
                                                required
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select a user to enroll" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map((user: any) => (
                                                        <SelectItem key={user._id} value={user._id}>
                                                            {user.fullName} ({user.email})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Course Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="enrollCourseId">
                                                Select Course <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={enrollForm.courseId}
                                                onValueChange={(value) =>
                                                    setEnrollForm({ ...enrollForm, courseId: value })
                                                }
                                                required
                                                disabled={!enrollForm.userId}
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder={enrollForm.userId ? "Select a course" : "Select a user first"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCoursesForUser.length > 0 ? (
                                                        availableCoursesForUser.map((course: any) => (
                                                            <SelectItem key={course._id} value={course._id}>
                                                                {course.courseName}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                                            {enrollForm.userId
                                                                ? "User is already enrolled in all available courses"
                                                                : "No courses available"}
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {enrollForm.userId && availableCoursesForUser.length === 0 && (
                                                <p className="text-xs text-amber-600 dark:text-amber-500">
                                                    This user is already enrolled in all available courses.
                                                </p>
                                            )}
                                        </div>

                                        {/* Display selected user's current enrollments */}
                                        {enrollForm.userId && (
                                            <Card className="bg-muted/50 border-border/50">
                                                <CardContent className="p-4">
                                                    <p className="text-sm font-medium mb-2">
                                                        Current Enrollments:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {users
                                                            .find((u: any) => u._id === enrollForm.userId)
                                                            ?.courses?.map((course: any) => (
                                                                <span
                                                                    key={course._id}
                                                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                                                                >
                                                                    {course.courseName}
                                                                </span>
                                                            )) || (
                                                                <span className="text-sm text-muted-foreground">
                                                                    No courses enrolled yet
                                                                </span>
                                                            )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Enrolling User...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Enroll User in Course
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card className="mt-12 bg-card/90 backdrop-blur-sm border-border/70 shadow-xl">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-2xl font-bold">
                                All Students ({filteredUsers.length})
                            </CardTitle>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, batch, or college..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 h-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isFetchingData ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {currentUsers.map((user: any) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={user.image}
                                                    alt={user.fullName}
                                                    className="w-12 h-12 rounded-full ring-2 ring-border"
                                                />
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {user.fullName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                    {user.batch && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Batch: {user.batch} {user.college && `• ${user.college}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-foreground">
                                                    {user.courses?.length || 0} Courses
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.accountType}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-12">
                                            <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                                            <p className="text-lg font-medium text-foreground mb-1">
                                                No students found
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {searchQuery ? "Try adjusting your search" : "Create your first student to get started"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                        <p className="text-sm text-muted-foreground">
                                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} students
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="h-9"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-1" />
                                                Previous
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const page = i + 1;
                                                    if (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <Button
                                                                key={page}
                                                                variant={currentPage === page ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => setCurrentPage(page)}
                                                                className="h-9 w-9 p-0"
                                                            >
                                                                {page}
                                                            </Button>
                                                        );
                                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                        return <span key={page} className="px-2 text-muted-foreground">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="h-9"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default AdminUserEnrollment;
