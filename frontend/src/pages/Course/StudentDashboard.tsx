import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Clock,
    Play,
    CheckCircle,
    TrendingUp,
    Award,
    Loader2,
    Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studentService } from '@/service/student.service';
import { courseService } from '@/service/course.service';
import { useAppSelector } from '@/hooks/redux';
import { Navigation } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CourseSearch from "./CourseSearch";
import { StudentDashboardSkeleton } from "@/components/DashboardSkeleton";

// --- Helper Component: Reusable Stat Card ---
const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: React.ElementType, label: string, value: string | number, colorClass: string }) => (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default rounded-xl">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground mb-1 font-medium">{label}</p>
                <p className="text-3xl font-extrabold text-foreground">{value}</p>
            </div>
            {/* Icon container uses theme color based on props */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </div>
    </Card>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { token, user } = useAppSelector((state) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEnrolled: 0,
        completedCourses: 0,
        totalProgress: 0,
        certificatesEarned: 0
    });

    const fetchEnrolledCourses = async () => {
        if (!token) {
            navigate('/auth'); // Redirect if no token
            return;
        }

        try {
            setIsLoading(true);

            // 1. Fetch all courses for recommendations (runs concurrently with enrolled check)
            const [coursesRes, enrolledRes] = await Promise.all([
                courseService.getAllCourses(),
                studentService.getEnrolledCourses(token).catch(err => ({ data: { courses: user?.courses || [] } }))
            ]);

            setAllCourses(coursesRes.data || []);
            let userEnrolledCourses = enrolledRes.data?.courses || [];

            // 2. Fetch progress for each enrolled course
            const coursesWithProgress = await Promise.all(
                userEnrolledCourses.map(async (course) => {
                    try {
                        const progressRes = await courseService.getFullCourseDetails(course._id, token);
                        const completedVideos = progressRes.data?.completedVideos || [];
                        const totalLectures = course.courseContent?.reduce((total, section) =>
                            total + (section.subSection?.length || 0), 0) || 0;
                        const progress = totalLectures > 0 ? (completedVideos.length / totalLectures) * 100 : 0;

                        return {
                            ...course,
                            progress: Math.round(progress),
                            completedLectures: completedVideos.length,
                            totalLectures,
                            lastAccessed: new Date().toISOString()
                        };
                    } catch (error) {
                        return {
                            ...course,
                            progress: 0,
                            completedLectures: 0,
                            totalLectures: course.courseContent?.reduce((total, section) =>
                                total + (section.subSection?.length || 0), 0) || 0,
                            lastAccessed: new Date().toISOString()
                        };
                    }
                })
            );

            const validCourses = coursesWithProgress.filter(c => c && c._id);
            setEnrolledCourses(validCourses);

            // 3. Calculate Stats
            const totalEnrolled = validCourses.length;
            const completedCourses = validCourses.filter(c => c.progress === 100).length;
            const totalProgress = totalEnrolled > 0 ? validCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / totalEnrolled : 0;

            setStats({
                totalEnrolled,
                completedCourses,
                totalProgress: Math.round(totalProgress),
                certificatesEarned: completedCourses
            });

        } catch (error: any) {
            console.error("Dashboard fetch error:", error);
            toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, [token]);

    // --- Conditional Render: Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
                <Navigation />
                <StudentDashboardSkeleton />
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background text-foreground">
            <Navigation />
            <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">

                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold mb-2 text-foreground">
                        Welcome back, <span className="text-primary">{user?.firstName || 'Student'}!</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Continue your learning journey and track your progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={BookOpen}
                        label="Enrolled Courses"
                        value={stats.totalEnrolled}
                        colorClass="text-primary"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Completed"
                        value={stats.completedCourses}
                        colorClass="text-green-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Avg Progress"
                        value={`${stats.totalProgress}%`}
                        colorClass="text-orange-500"
                    />
                    <StatCard
                        icon={Award}
                        label="Certificates"
                        value={stats.certificatesEarned}
                        colorClass="text-purple-500"
                    />
                </div>

                {/* Search Section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-4 mb-4">
                        <Search className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">Discover New Courses</h2>
                    </div>
                    {/* CourseSearch is assumed to be a working search input component */}
                    <CourseSearch placeholder="Search for new courses to enroll..." />
                </div>

                {/* Enrolled Courses / Continue Learning */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-foreground">Continue Learning</h2>
                        <Button variant="link" className='text-primary' onClick={() => navigate('/all-courses')}>
                            View All Courses
                        </Button>
                    </div>

                    {stats.totalEnrolled === 0 ? (
                        <Card className="bg-card/90 backdrop-blur-lg border-border/70 shadow-lg">
                            <CardContent className="p-12 text-center">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                                <h3 className="text-xl font-bold mb-2">No Courses Enrolled Yet</h3>
                                <p className="text-base text-muted-foreground mb-6">
                                    Start your learning journey by enrolling in a course.
                                </p>
                                <Button
                                    onClick={() => navigate('/all-courses')}
                                    className="bg-primary hover:bg-primary/90 font-semibold"
                                >
                                    Explore Courses
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.slice(0, 3).map((course: any) => (
                                <Card key={course._id} className="overflow-hidden bg-card/90 backdrop-blur-lg border-border/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={course.thumbnail || 'https://via.placeholder.com/600x337/4C7C33/FFFFFF?text=Course+Image'}
                                            alt={course.courseName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge
                                                className={`font-semibold ${course.progress === 100 ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                                            >
                                                {course.progress === 100 ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-5">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 transition-colors hover:text-primary">
                                            {course.courseName}
                                        </h3>

                                        <div className="space-y-3 mb-4 pt-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-foreground">Progress</span>
                                                <span className="font-bold text-primary">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2 bg-muted" indicatorColor="bg-primary" />

                                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    <span>{course.completedLectures || 0}/{course.totalLectures || 0} lectures</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>Last accessed today</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                            onClick={() => navigate(`/course-learning/${course._id}`)}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended Courses */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-foreground">Recommended for You</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {allCourses.slice(0, 4).map((course: any) => (
                            <Card key={course._id} className="bg-card/90 backdrop-blur-lg border-border/70 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1" onClick={() => navigate(`/course-detail/${course._id}`)}>
                                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                    <img
                                        src={course.thumbnail || 'https://via.placeholder.com/600x337/4C7C33/FFFFFF?text=Recommended+Course'}
                                        alt={course.courseName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2 line-clamp-2 transition-colors hover:text-primary">
                                        {course.courseName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                                        by {course.instructor?.firstName} {course.instructor?.lastName || 'Expert'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-xs font-medium">
                                            {course.category?.name || 'General'}
                                        </Badge>
                                        <span className="font-bold text-primary text-sm">
                                            ₹{(course.finalPrice || course.price || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StudentDashboard;