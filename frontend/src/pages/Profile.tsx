
import { useAppSelector } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus, Settings, User, Loader2, Award, Zap, GraduationCap } from "lucide-react";
import { courseService } from "@/service/course.service";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";

// --- Reusable Component for Quick Actions ---

const QuickActionCard = ({ Icon, title, description, onClick }) => (
    <Card
        className="bg-card/90 backdrop-blur-sm border-border/70 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        onClick={onClick}
    >
        <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground font-bold">
                <Icon className="w-5 h-5 text-primary" />
                {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
    </Card>
);


const Profile = () => {
    const { user, token, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [coursesWithProgress, setCoursesWithProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- Course Data Fetching Logic ---
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
            return;
        }

        const fetchCoursesProgress = async () => {
            if (!user.courses || !token) return;

            setIsLoading(true);
            try {
                let coursesData = [];
                const isUserAdmin = user.accountType === 'Admin';

                if (isUserAdmin) {
                    // Admin: courses are IDs, fetch details
                    coursesData = await Promise.all(
                        user.courses.map(async (courseId) => {
                            try {
                                const res = await courseService.getCourseById(courseId);
                                return {
                                    ...res.data,
                                    progress: 100, // Assume created courses are "complete" for display
                                    completedLectures: 'N/A',
                                    totalLectures: 'N/A'
                                };
                            } catch (error) {
                                console.error(`Error fetching admin course ${courseId}:`, error);
                                return null;
                            }
                        })
                    );
                } else {
                    // Student: courses are objects, fetch progress
                    coursesData = await Promise.all(
                        user.courses.map(async (course) => {
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
                                    totalLectures
                                };
                            } catch (error) {
                                console.error(`Error fetching student course progress ${course._id}:`, error);
                                return {
                                    ...course,
                                    progress: 0,
                                    completedLectures: 0,
                                    totalLectures: 0
                                };
                            }
                        })
                    );
                }
                setCoursesWithProgress(coursesData.filter(Boolean));
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.courses && token) {
            fetchCoursesProgress();
        }
    }, [user, token, navigate, authLoading]);

    // --- Loading and User Info ---

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const isAdmin = user.accountType === 'Admin';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

    // --- Main Render ---

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-foreground">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8 pt-32">

                {/* 1. Header & User Info */}
                <div className="mb-12">
                    <Card className="bg-card/90 backdrop-blur-lg border-primary/20 shadow-xl">
                        <CardHeader className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-primary/50 shadow-md">
                                    <AvatarImage src={user.image} alt={fullName} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">{fullName}</h1>
                                    <p className="text-lg text-muted-foreground mb-3">{user.email}</p>
                                    <Badge
                                        className={`mt-2 text-base font-semibold px-4 py-1.5 ${isAdmin ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                                    >
                                        {user.accountType}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* 2. Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <QuickActionCard
                            Icon={User}
                            title="Dashboard"
                            description="View platform metrics & progress overview"
                            onClick={() => navigate('/dashboard')}
                        />
                        <QuickActionCard
                            Icon={Settings}
                            title="Account Settings"
                            description="Update profile, password, and preferences"
                            onClick={() => navigate('/settings')}
                        />
                        <QuickActionCard
                            Icon={BookOpen}
                            title="Browse Courses"
                            description="Explore new topics and expand your knowledge"
                            onClick={() => navigate('/all-courses')}
                        />
                        {isAdmin && (
                            <QuickActionCard
                                Icon={Plus}
                                title="Create Course"
                                description="Publish a new course to the academy"
                                onClick={() => navigate('/create-course')}
                            />
                        )}
                        {isAdmin && (
                            <QuickActionCard
                                Icon={GraduationCap}
                                title="Manage Content"
                                description="Edit or manage existing course materials"
                                onClick={() => navigate('/manage-courses')}
                            />
                        )}
                        {/* --- NEW: Add Category Action --- */}
                        {isAdmin && (
                            <QuickActionCard
                                Icon={Award} // Using Award icon for category/certification management
                                title="Add Category"
                                description="Organize courses by adding new categories"
                                onClick={() => navigate('/add-category')}
                            />
                        )}
                        {/* --- NEW: Create Job Action --- */}
                        {isAdmin && (
                            <QuickActionCard
                                Icon={Zap}
                                title="Create Job"
                                description="Post new job opportunities for students"
                                onClick={() => navigate('/create-job')}
                            />
                        )}
                        {/* --- NEW: Manage Jobs Action --- */}
                        {isAdmin && (
                            <QuickActionCard
                                Icon={Settings}
                                title="Manage Jobs"
                                description="Edit and manage existing job postings"
                                onClick={() => navigate('/manage-jobs')}
                            />
                        )}
                    </div>
                </div>

                {/* 3. My Courses / Created Courses */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">{isAdmin ? 'Created Courses' : 'My Courses'}</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (coursesWithProgress && coursesWithProgress.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coursesWithProgress.map((course: any, index: number) => (
                                <Card
                                    key={course._id || index}
                                    className="overflow-hidden bg-card/90 backdrop-blur-lg border-border/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {course.thumbnail && (
                                        <div className="aspect-video overflow-hidden rounded-t-lg">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName || `Course ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold line-clamp-2">{course.courseName || course.title || `Course ${index + 1}`}</CardTitle>
                                        <CardDescription className="text-sm line-clamp-2">{course.courseDescription || course.description || "Course description"}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!isAdmin && (
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-foreground">Progress</span>
                                                    <span className="font-bold text-primary">{course.progress || 0}%</span>
                                                </div>
                                                <Progress value={course.progress || 0} className="h-2 bg-muted" indicatorColor="bg-primary" />
                                                <div className="text-xs text-muted-foreground">
                                                    {course.completedLectures || 0} of {course.totalLectures || 0} lessons completed
                                                </div>
                                            </div>
                                        )}
                                        {isAdmin && (
                                            <div className="text-sm text-muted-foreground mb-4">
                                                <span className="font-semibold text-primary">Status: Published</span> | Students: {course.studentsEnrolled?.length || 0}
                                            </div>
                                        )}
                                        <Button
                                            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                            onClick={() => navigate(isAdmin ? `/course/${course._id || course.id}` : `/course-learning/${course._id || course.id}`)}
                                        >
                                            {isAdmin ? 'View Details & Manage' : 'Continue Learning'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <Card className="bg-card/90 backdrop-blur-lg border-border/70 shadow-lg">
                            <CardContent className="text-center py-12">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                                <h3 className="text-xl font-bold mb-2">{isAdmin ? 'No Courses Created' : 'No Courses Enrolled'}</h3>
                                <p className="text-base text-muted-foreground mb-4">
                                    {isAdmin
                                        ? 'Use the "Create Course" action to publish your first content.'
                                        : "You haven't enrolled in any courses yet. Browse our catalog to get started!"
                                    }
                                </p>
                                <Button onClick={() => navigate(isAdmin ? '/create-course' : '/all-courses')} className="bg-primary hover:bg-primary/90">
                                    {isAdmin ? 'Create Course' : 'Browse Catalog'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;