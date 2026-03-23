import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  GraduationCap,
  Play,
  Settings,
  Users,
  CheckCircle,
  Search,
  Loader2,
  Zap,
  Calendar,
  Sparkles,
  UserPlus,
  FileCheck,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux";
import { courseService } from "@/service/course.service";
import { studentService } from "@/service/student.service";
import { useNavigate, Link } from "react-router-dom";
import CourseSearch from "./Course/CourseSearch"; // Assuming this component exists
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

// --- Helper Components for Clean Code ---

// 1. Detailed Stat Card (Used for Student and Admin views)
const DetailedStatCard = ({ icon: Icon, label, value, colorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Card className="p-6 bg-card/90 backdrop-blur-sm border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-medium">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-foreground">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 ${colorClass}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  </motion.div>
);

// 2. Quick Action Card
const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  action,
  colorClass,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
  >
    <Card
      className="bg-card/90 backdrop-blur-sm border border-border/70 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
      onClick={action}
    >
      <div className="p-6 text-center">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center mx-auto mb-4 shadow-md`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  </motion.div>
);

// 3. Continue Learning Course Card
const ContinueLearningCard = ({ course, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Card className="overflow-hidden bg-card/90 backdrop-blur-sm border border-border/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={
            course.thumbnail ||
            "https://via.placeholder.com/600x337/4C7C33/FFFFFF?text=Course+Image"
          }
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={`font-semibold ${course.progress === 100 ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}`}
          >
            {course.progress === 100 ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {course.courseName}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Progress</span>
            <span className="font-bold text-primary">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2 bg-muted" />

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {course.completedClasses}/{course.totalClasses} Classes
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last accessed today</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          onClick={() => navigate(`/view-course/${course._id}`)}
        >
          <Play className="w-4 h-4 mr-2" />
          {course.progress === 0 ? "Start Course" : "Continue Learning"}
        </Button>
      </div>
    </Card>
  </motion.div>
);

// --- Main Dashboard Component ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [viewType, setViewType] = useState<"student" | "admin">("student");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  // Detailed Student Stats
  const [studentStats, setStudentStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    totalProgress: 0,
    certificatesEarned: 0,
  });

  // Detailed Admin Stats
  const [adminStats, setAdminStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    certificatesIssued: 0,
    courseCompletions: 0,
  });

  // Color mapping for stats icons and backgrounds (using primary and official palettes)
  const STATS_COLORS = {
    blue: { icon: BookOpen, text: "text-blue-500", bg: "bg-blue-500/10" },
    green: { icon: Award, text: "text-green-500", bg: "bg-green-500/10" },
    orange: { icon: Clock, text: "text-orange-500", bg: "bg-orange-500/10" },
    purple: {
      icon: TrendingUp,
      text: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  };

  // --- Data Fetching Logic (Simplified & Focused) ---

  const fetchStudentStats = async () => {
    if (!accessToken || user?.accountType !== "Student") return;
    setIsLoadingStats(true);
    try {
      // Combined Fetch for all courses (for recommendations) and enrolled data
      const [coursesRes, enrolledRes] = await Promise.all([
        courseService.getAllCourses(),
        studentService
          .getEnrolledCourses(accessToken)
          .catch(() => ({ data: { courses: user?.courses || [] } })),
      ]);

      setAllCourses(coursesRes.data || []);
      let userEnrolledCourses = enrolledRes.data?.courses || [];

      // --- Progress Calculation ---
      const coursesWithProgress = await Promise.all(
        userEnrolledCourses.map(async (course) => {
          try {
            const progressRes = await courseService.getFullCourseDetails(
              course._id,
              accessToken,
            );
            const completedVideos = progressRes.data?.completedVideos || [];
            const completedClasses = progressRes.data?.completedClasses || [];

            const totalLectures =
              course.courseContent?.reduce(
                (total, section) => total + (section.subSection?.length || 0),
                0,
              ) || 0;

            // Get course details to access upcomingClasses
            const courseDetails =
              progressRes.data?.courseDetails ||
              (Array.isArray(progressRes.data)
                ? progressRes.data[0]
                : progressRes.data);
            const totalClasses = courseDetails?.upcomingClasses?.length || 0;

            // Calculate progress based on classes only (matching EnrolledCourseView)
            const progress =
              totalClasses > 0
                ? (completedClasses.length / totalClasses) * 100
                : 0;

            return {
              ...course,
              progress: Math.round(progress),
              completedLectures: completedVideos.length,
              totalLectures,
              completedClasses: completedClasses.length,
              totalClasses,
              lastAccessed: new Date().toISOString(),
            };
          } catch (error) {
            const totalLectures =
              course.courseContent?.reduce(
                (total, section) => total + (section.subSection?.length || 0),
                0,
              ) || 0;
            return {
              ...course,
              progress: 0,
              completedLectures: 0,
              totalLectures,
              completedClasses: 0,
              totalClasses: 0,
              lastAccessed: new Date().toISOString(),
            };
          }
        }),
      );

      const validCourses = coursesWithProgress.filter((c) => c && c._id);
      setEnrolledCourses(validCourses);

      // Final Stats Calculation
      const totalEnrolled = validCourses.length;
      const completedCourses = validCourses.filter(
        (c) => c.progress === 100,
      ).length;
      const totalProgress =
        totalEnrolled > 0
          ? validCourses.reduce((sum, c) => sum + (c.progress || 0), 0) /
            totalEnrolled
          : 0;

      setStudentStats({
        totalEnrolled,
        completedCourses,
        totalProgress: Math.round(totalProgress),
        certificatesEarned: completedCourses,
      });
    } catch (error) {
      console.error("Error fetching student dashboard:", error);
      toast.error("Failed to fetch dashboard statistics.");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchAdminStats = async () => {
    if (!accessToken || user?.accountType !== "Admin") return;
    setIsLoadingStats(true);
    try {
      const coursesRes = await courseService.getAdminCourses(accessToken);
      const adminCourses = coursesRes.data || [];

      const totalStudents = adminCourses.reduce(
        (sum, course) => sum + (course.studentsEnrolled?.length || 0),
        0,
      );

      setAdminStats({
        totalCourses: adminCourses.length,
        totalStudents: totalStudents,
        certificatesIssued: Math.floor(totalStudents * 0.3), // Mock calculation
        courseCompletions: Math.floor(totalStudents * 0.6), // Mock calculation
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to fetch admin statistics.");
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    // Don't redirect while still loading auth state from localStorage
    if (isLoading) return;

    if (!accessToken) {
      navigate("/auth");
      return;
    }
    const accountType = user?.accountType === "Admin" ? "admin" : "student";
    setViewType(accountType);

    if (accountType === "student") {
      fetchStudentStats();
    } else {
      fetchAdminStats();
    }
  }, [navigate, accessToken, user, isLoading]);

  // --- Data Mappers for Rendering ---

  const studentStatsData = [
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: studentStats.totalEnrolled.toString(),
      colorClass: "text-primary",
    },
    {
      icon: CheckCircle,
      label: "Completed Courses",
      value: studentStats.completedCourses.toString(),
      colorClass: "text-green-500",
    },
    {
      icon: TrendingUp,
      label: "Avg. Progress",
      value: `${studentStats.totalProgress}%`,
      colorClass: "text-orange-500",
    },
    {
      icon: Award,
      label: "Certificates Earned",
      value: studentStats.certificatesEarned.toString(),
      colorClass: "text-purple-500",
    },
  ];

  const adminStatsData = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: adminStats.totalCourses.toString(),
      colorClass: "text-blue-500",
    },
    {
      icon: Users,
      label: "Total Students",
      value: adminStats.totalStudents.toString(),
      colorClass: "text-primary",
    },
    {
      icon: Award,
      label: "Certificates Issued",
      value: adminStats.certificatesIssued.toString(),
      colorClass: "text-purple-500",
    },
    {
      icon: GraduationCap,
      label: "Course Completions",
      value: adminStats.courseCompletions.toString(),
      colorClass: "text-orange-500",
    },
  ];

  const studentActions = [
    {
      title: "Browse Courses",
      description: "Explore new paths to expand your skills.",
      icon: BookOpen,
      action: () => navigate("/all-courses"),
      colorClass: "from-primary to-green-500",
    },
    {
      title: "My Certificates",
      description: "View and download your earned awards.",
      icon: Award,
      action: () => navigate("/certificates"),
      colorClass: "from-green-500 to-green-600",
    },
    {
      title: "Learning Path",
      description: "Track your overall learning progress.",
      icon: GraduationCap,
      action: () => navigate("/learning-path"),
      colorClass: "from-purple-500 to-purple-600",
    },
    {
      title: "Community",
      description: "Join discussions and connect with learners.",
      icon: Users,
      action: () => navigate("/community"),
      colorClass: "from-orange-500 to-orange-600",
    },
  ];

  const adminActions = [
    {
      title: "Certificate Management",
      description: "Create, verify, and manage student certificates.",
      icon: FileCheck,
      action: () => navigate("/certificate-management"),
      colorClass: "from-emerald-500 to-teal-600",
    },
    {
      title: "Hero Images",
      description: "Upload & manage hero section slider images.",
      icon: ImageIcon,
      action: () => navigate("/admin/hero-images"),
      colorClass: "from-sky-500 to-blue-600",
    },
    {
      title: "Create Course",
      description: "Build and publish a new learning module.",
      icon: BookOpen,
      action: () => navigate("/create-course"),
      colorClass: "from-primary to-green-500",
    },
    {
      title: "User Enrollment",
      description: "Create users and enroll them in courses.",
      icon: UserPlus,
      action: () => navigate("/admin/user-enrollment"),
      colorClass: "from-cyan-500 to-blue-600",
    },
    {
      title: "Create Workshop",
      description: "Schedule a new workshop or event.",
      icon: Calendar,
      action: () => navigate("/create-workshop"),
      colorClass: "from-pink-500 to-rose-500",
    },
    {
      title: "Workshop Management",
      description: "Manage all workshops - Create, Update, Delete.",
      icon: Settings,
      action: () => navigate("/workshop-management"),
      colorClass: "from-violet-500 to-purple-600",
    },
    {
      title: "Workshop Applications",
      description: "View and manage workshop registrations.",
      icon: Users,
      action: () => navigate("/workshop-registrations"),
      colorClass: "from-blue-500 to-blue-600",
    },
    {
      title: "Nexa Leads",
      description: "View all leads captured from Nexa AI.",
      icon: Sparkles,
      action: () => navigate("/leads"),
      colorClass: "from-indigo-500 to-purple-600",
    },
    {
      title: "Manage Courses",
      description: "Edit, update, or delete content.",
      icon: Settings,
      action: () => navigate("/manage-courses"),
      colorClass: "from-purple-500 to-purple-600",
    },
    {
      title: "Manage Classes",
      description: "Schedule and manage classes for all courses.",
      icon: Calendar,
      action: () => navigate("/manage-all-classes"),
      colorClass: "from-teal-500 to-cyan-600",
    },
    {
      title: "Add Category",
      description: "Organize content with new course categories.",
      icon: Zap,
      action: () => navigate("/add-category"),
      colorClass: "from-orange-500 to-orange-600",
    },
    {
      title: "Create Job",
      description: "Post new job opportunities for students.",
      icon: GraduationCap,
      action: () => navigate("/create-job"),
      colorClass: "from-teal-500 to-teal-600",
    },
    {
      title: "Manage Jobs",
      description: "Edit and manage existing job postings.",
      icon: Settings,
      action: () => navigate("/manage-jobs"),
      colorClass: "from-red-500 to-red-600",
    },
  ];

  // --- Render Sections ---

  const WelcomeSection = () => (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-foreground">
        Welcome Back,{" "}
        <span className="text-primary">
          {user?.firstName || (viewType === "admin" ? "Admin" : "Learner")}!
        </span>
      </h1>
      <p className="text-xl text-muted-foreground">
        {viewType === "admin"
          ? "Platform Command Center"
          : "Continue your learning journey"}{" "}
        🚀
      </p>
    </motion.div>
  );

  const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {viewType === "admin"
        ? adminStatsData.map((stat, index) => (
            <DetailedStatCard key={index} {...stat} />
          ))
        : studentStatsData.map((stat, index) => (
            <DetailedStatCard key={index} {...stat} />
          ))}
    </div>
  );

  const QuickActionsSection = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        {viewType === "admin" && (
          <h2 className="text-3xl font-bold text-foreground">Quick Actions</h2>
        )}
        {/* <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" onClick={() => navigate(viewType === 'admin' ? '/manage-courses' : '/all-courses')}>
                    {viewType === 'admin' ? 'Go to Manager' : 'Browse All'}
                </Button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {viewType === "admin" &&
          adminActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        {/* {viewType === 'admin'
                    ? adminActions.map((action, index) => <QuickActionCard key={index} {...action} />)
                    : studentActions.map((action, index) => <QuickActionCard key={index} {...action} />)
                } */}
      </div>
    </div>
  );

  const StudentMainLearningSection = () => {
    // Only render the student-specific main blocks
    if (viewType !== "student") return null;

    return (
      <>
        {/* 1. Search/Discovery */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Discover New Courses
            </h2>
          </div>
          {/* Assuming CourseSearch is an input component */}
          <CourseSearch placeholder="Search for new courses to enroll..." />
        </div>

        {/* 2. Continue Learning */}
        <div className="mb-12">
          {/* <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-foreground">Continue Learning</h2>
                        {enrolledCourses.length > 0 && (
                            <Button variant="link" className="text-primary" onClick={() => navigate('/my-courses')}>View All</Button>
                        )}
                    </div> */}

          {isLoadingStats ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 3).map((course: any, index) => (
                <ContinueLearningCard
                  key={course._id || index}
                  course={course}
                  navigate={navigate}
                />
              ))}
              {enrolledCourses.length === 0 && (
                <Card className="lg:col-span-3 p-8 text-center bg-card/90 backdrop-blur-sm border-border/70 shadow-lg">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Button
                    onClick={() => navigate("/all-courses")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Browse Courses
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* 3. Recommended Courses */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Slicing the available courses for recommendation display */}
            {allCourses.slice(0, 4).map((course: any, index: number) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="bg-card/90 backdrop-blur-sm border-border/70 hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                  onClick={() => navigate(`/course-detail/${course._id}`)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={
                        course.thumbnail ||
                        "https://via.placeholder.com/600x337/4C7C33/FFFFFF?text=Recommended+Course"
                      }
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 transition-colors hover:text-primary">
                      {course.courseName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      by {course.instructor?.firstName}{" "}
                      {course.instructor?.lastName || "Expert"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {course.category?.name || "General"}
                      </Badge>
                      <span className="font-bold text-primary text-sm">
                        ₹
                        {(
                          course.finalPrice ||
                          course.price ||
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const AdminMainOverview = () => {
    // Only render the admin-specific main blocks
    if (viewType !== "admin") return null;

    return (
      <>
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              Platform Overview
            </h2>
            {/* <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">View Reports</Button> */}
          </div>
          <Card className="bg-card/90 backdrop-blur-sm border-border/70 p-6 shadow-md">
            <p className="text-muted-foreground">
              Monitor key metrics, recent student activity, and course
              performance metrics here.
            </p>
          </Card>
        </div>
      </>
    );
  };

  // --- Final Render ---

  if (isLoadingStats && accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <Navbar />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <WelcomeSection />

        <StatsGrid />

        <QuickActionsSection />

        {viewType === "student" && <StudentMainLearningSection />}
        {viewType === "admin" && <AdminMainOverview />}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
