import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Clock,
    Play,
    Loader2,
    Calendar,
    ChevronDown,
    CheckCircle,
    BookOpen,
    Video,
    ArrowRight,
    ArrowLeft,
    Download,
    ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { courseService } from "@/service/course.service";
import { useAppSelector } from "@/hooks/redux"; // Assuming this hook exists
import { EnrolledCourseViewSkeleton } from "@/components/DashboardSkeleton";

const EnrolledCourseView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAppSelector((state: any) => state.auth);

    const [course, setCourse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
    const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
    const [completedClasses, setCompletedClasses] = useState<Set<string>>(new Set());
    const [markingClassId, setMarkingClassId] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalLectures: 0,
        completedLectures: 0,
        totalClasses: 0,
        completedClasses: 0,
        progress: 0
    });

    const fetchCourseDetails = useCallback(async () => {
        if (!courseId) return;
        setIsLoading(true);
        try {
            // Using getFullCourseDetails which should now return including upcomingClasses
            const response = await courseService.getFullCourseDetails(courseId, accessToken);
            // Handling potential difference in API structure depending on how it was implemented
            // Assuming response.data.courseDetails or response.data[0] based on previous files
            const courseData = response.data.courseDetails || (Array.isArray(response.data) ? response.data[0] : response.data);

            if (!courseData) {
                throw new Error("No course data found");
            }

            setCourse(courseData);

            const completedVids = response.data.completedVideos || [];
            const completedCls = response.data.completedClasses || [];
            setCompletedLectures(new Set(completedVids));
            setCompletedClasses(new Set(completedCls));

            // Calculate progress based on fetched data initially
            const totalLectures = courseData.courseContent?.reduce((acc: number, sec: any) => acc + (sec.subSection?.length || 0), 0) || 0;
            const totalClasses = courseData.upcomingClasses?.length || 0;
            const totalItems = totalLectures + totalClasses;
            const completedItems = completedVids.length + completedCls.length;

            setStats({
                totalLectures,
                completedLectures: completedVids.length,
                totalClasses,
                completedClasses: completedCls.length,
                progress: totalClasses > 0 ? Math.round((completedCls.length / totalClasses) * 100) : 0
            });

        } catch (error) {
            console.error("Error fetching course:", error);
            toast.error("Failed to load course details");
        } finally {
            setIsLoading(false);
        }
    }, [courseId, accessToken]);

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    const toggleSection = (index: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            newSet.has(index) ? newSet.delete(index) : newSet.add(index);
            return newSet;
        });
    };



    const handleClassCompletion = async (classId: string) => {
        if (!accessToken) return;

        if (completedClasses.has(classId)) {
            return; // Already completed
        }

        setMarkingClassId(classId);

        try {
            const res = await courseService.markClassComplete(courseId!, classId, accessToken);
            if (res?.success) {
                setCompletedClasses(prev => {
                    const newSet = new Set(prev);
                    newSet.add(classId);
                    return newSet;
                });

                // Re-calculate progress based on classes only
                setStats(prev => {
                    const newCompletedClasses = prev.completedClasses + 1;
                    return {
                        ...prev,
                        completedClasses: newCompletedClasses,
                        progress: prev.totalClasses > 0 ? Math.round((newCompletedClasses / prev.totalClasses) * 100) : 0
                    };
                });
                toast.success("Class marked as completed");
            }
        } catch (error) {
            console.error("Error marking class complete:", error);
            toast.error("Failed to mark class as complete");
        } finally {
            setMarkingClassId(null);
        }
    };

    const handleDownloadFile = async (url: string, fileName: string) => {
        const toastId = toast.loading("Preparing download...");
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9 _-]/g, ' ').trim() || 'document';
            link.setAttribute('download', `${sanitizedFileName}.pdf`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success("Download started", { id: toastId });
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download file", { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <EnrolledCourseViewSkeleton />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-6xl">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 -ml-2 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Hero / Header Section */}
                <div className="mb-8">
                    <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">Enrolled Course</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{course.courseName}</h1>
                    <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-3xl leading-relaxed">{course.courseDescription}</p>

                    {/* Progress Bar */}
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 max-w-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Course Progress</span>
                            <span className="text-sm font-bold text-primary">{stats.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            {/* <span>{stats.completedLectures}/{stats.totalLectures} Lectures</span> */}
                            {/* <span>•</span> */}
                            <span>{stats.completedClasses}/{stats.totalClasses} Classes</span>
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Upcoming Classes Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        Upcoming Live Classes
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Join your scheduled sessions</p>
                                </div>
                            </div>

                            {course.upcomingClasses && course.upcomingClasses.length > 0 ? (
                                <div className="space-y-4">
                                    {course.upcomingClasses
                                        .filter((cls: any) => new Date(cls.classDate) > new Date())
                                        .sort((a: any, b: any) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime())
                                        .map((cls: any) => {
                                            const isCompleted = completedClasses.has(cls._id);
                                            return (
                                                <Card key={cls._id} className={`group overflow-hidden border transition-all duration-300 hover:shadow-md ${isCompleted ? 'bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800' : 'border-border hover:border-primary/40 bg-card'}`}>
                                                    <CardContent className="p-0">
                                                        {/* Color accent bar */}
                                                        <div className={`h-1.5 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-primary to-primary/60'}`} />

                                                        <div className="p-6">
                                                            {/* Header with badge and date */}
                                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                                {isCompleted ? (
                                                                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-semibold px-3 py-1">
                                                                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                        Completed
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1">
                                                                        <Play className="w-3.5 h-3.5 mr-1.5" />
                                                                        Live Session
                                                                    </Badge>
                                                                )}
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-1.5 font-medium">
                                                                        <Calendar className="w-4 h-4" />
                                                                        {new Date(cls.classDate).toLocaleDateString(undefined, {
                                                                            weekday: 'short',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 font-medium">
                                                                        <Clock className="w-4 h-4" />
                                                                        {new Date(cls.classDate).toLocaleTimeString(undefined, {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Class title and description */}
                                                            <div className="mb-5">
                                                                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                                                                    {cls.className}
                                                                </h3>
                                                                {cls.classDescription && (
                                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                                        {cls.classDescription}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex flex-wrap gap-3">
                                                                {new Date(cls.classDate) > new Date() && (
                                                                    <Button className="bg-primary hover:bg-primary/90 shadow-sm" asChild>
                                                                        <a href={cls.classUrl} target="_blank" rel="noopener noreferrer">
                                                                            <Play className="w-4 h-4 mr-2" />
                                                                            Join Class
                                                                        </a>
                                                                    </Button>
                                                                )}
                                                                {!isCompleted && (
                                                                    <Button
                                                                        variant="outline"
                                                                        className="border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
                                                                        onClick={() => handleClassCompletion(cls._id)}
                                                                        disabled={markingClassId === cls._id}
                                                                    >
                                                                        {markingClassId === cls._id ? (
                                                                            <>
                                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                                Marking...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                                Mark as Done
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            ) : (
                                <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
                                    <CardContent className="p-12 text-center">
                                        <div className="max-w-sm mx-auto">
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Calendar className="w-8 h-8 text-primary/40" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Classes</h3>
                                            <p className="text-muted-foreground text-sm">
                                                No live classes scheduled at the moment. Check back later for updates!
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Previous Classes Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <div className="p-2 bg-muted/50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        Previous Classes
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Review your past sessions</p>
                                </div>
                            </div>

                            {course.upcomingClasses && course.upcomingClasses.filter((cls: any) => new Date(cls.classDate) <= new Date()).length > 0 ? (
                                <div className="space-y-4">
                                    {course.upcomingClasses
                                        .filter((cls: any) => new Date(cls.classDate) <= new Date())
                                        .sort((a: any, b: any) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime())
                                        .map((cls: any) => {
                                            const isCompleted = completedClasses.has(cls._id);
                                            return (
                                                <Card key={cls._id} className={`group overflow-hidden border transition-all duration-300 hover:shadow-md ${isCompleted ? 'bg-gradient-to-br from-green-50/30 to-green-100/20 dark:from-green-950/10 dark:to-green-900/5 border-green-200/60 dark:border-green-800/60' : 'bg-muted/20 border-border/50 hover:border-border'}`}>
                                                    <CardContent className="p-0">
                                                        {/* Color accent bar */}
                                                        <div className={`h-1.5 ${isCompleted ? 'bg-gradient-to-r from-green-500/70 to-emerald-500/70' : 'bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10'}`} />

                                                        <div className="p-6">
                                                            {/* Header with badge and date */}
                                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                                {isCompleted ? (
                                                                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-semibold px-3 py-1">
                                                                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                        Attended
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-muted-foreground/20 font-semibold px-3 py-1">
                                                                        Past Class
                                                                    </Badge>
                                                                )}
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-1.5 font-medium">
                                                                        <Calendar className="w-4 h-4" />
                                                                        {new Date(cls.classDate).toLocaleDateString(undefined, {
                                                                            weekday: 'short',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 font-medium">
                                                                        <Clock className="w-4 h-4" />
                                                                        {new Date(cls.classDate).toLocaleTimeString(undefined, {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Class title and description */}
                                                            <div className="mb-5">
                                                                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                                                                    {cls.className}
                                                                </h3>
                                                                {cls.classDescription && (
                                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                                        {cls.classDescription}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex flex-wrap gap-3">
                                                                {/* Recording Link */}
                                                                {cls.recordingUrl && (
                                                                    <Button
                                                                        variant="outline"
                                                                        className="border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
                                                                        asChild
                                                                    >
                                                                        <a href={cls.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                                            <Video className="w-4 h-4 mr-2" />
                                                                            Watch Recording
                                                                        </a>
                                                                    </Button>
                                                                )}

                                                                {/* Document Links */}
                                                                {cls.documentFile?.secure_url && (
                                                                    <>
                                                                        {/* Open in New Tab */}
                                                                        {/* <Button
                                                                            variant="outline"
                                                                            className="border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                                                                            asChild
                                                                        >
                                                                            <a href={cls.documentFile.secure_url} target="_blank" rel="noopener noreferrer">
                                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                                Open Docs
                                                                            </a>
                                                                        </Button> */}


                                                                        <Button
                                                                            variant="outline"
                                                                            className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50"
                                                                            onClick={() => handleDownloadFile(cls.documentFile.secure_url, cls.className)}
                                                                        >
                                                                            <Download className="w-4 h-4 mr-2" />
                                                                            Download Docs
                                                                        </Button>
                                                                    </>
                                                                )}

                                                                {/* Mark as Done */}
                                                                {!isCompleted && (
                                                                    <Button
                                                                        variant="outline"
                                                                        className="border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
                                                                        onClick={() => handleClassCompletion(cls._id)}
                                                                        disabled={markingClassId === cls._id}
                                                                    >
                                                                        {markingClassId === cls._id ? (
                                                                            <>
                                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                                Marking...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                                Mark as Done
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                )}

                                                                {/* Show message if no resources available */}
                                                                {!cls.recordingUrl && !cls.documentFile?.secure_url && isCompleted && (
                                                                    <div className="w-full p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                                                                        <p className="text-sm text-muted-foreground text-center">
                                                                            📚 Recording and documents will be available soon
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            ) : (
                                <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-dashed border-2">
                                    <CardContent className="p-12 text-center">
                                        <div className="max-w-sm mx-auto">
                                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Calendar className="w-8 h-8 text-muted-foreground/40" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">No Previous Classes</h3>
                                            <p className="text-muted-foreground text-sm">
                                                You haven't attended any classes yet. Check your upcoming classes above!
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <Separator />

                        {/* Course Content Outline */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-primary" />
                                Course Curriculum
                            </h2>
                            <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
                                {course.courseContent?.map((section: any, idx: number) => {
                                    const isOpen = expandedSections.has(idx);
                                    return (
                                        <div key={section._id} className="border-b border-border/60 last:border-0">
                                            <button
                                                onClick={() => toggleSection(idx)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-full ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">{section.sectionName}</h3>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{section.subSection?.length || 0} Lessons</p>
                                                    </div>
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="bg-muted/10 divide-y divide-border/30">
                                                    {section.subSection?.map((lesson: any) => {
                                                        const isCompleted = completedLectures.has(lesson._id);
                                                        return (
                                                            <div
                                                                key={lesson._id}
                                                                className="p-3 pl-14 flex items-center gap-3"
                                                            >
                                                                <CheckCircle
                                                                    className={`w-5 h-5 transition-all ${isCompleted ? 'text-green-500 fill-green-500/10' : 'text-muted-foreground'}`}
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                                                                    {lesson.timeDuration && (
                                                                        <p className="text-xs text-muted-foreground">{lesson.timeDuration} min</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/30 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    Course Instructor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
                                    <p className="text-xl font-bold text-foreground mb-1">
                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Industry Expert
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                                        10+ Years of Experience
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Section */}
                        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="text-primary">💬</span>
                                    Need Support?
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Have questions about the content or schedule? Reach out to our support team:
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                                        <a href="mailto:support@shellelearningacademy.com" className="text-sm font-medium text-primary hover:underline break-all">
                                            support@shellelearningacademy.com
                                        </a>
                                    </div>
                                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">WhatsApp / Call</p>
                                        <a href="tel:+919406688303" className="text-sm font-medium text-primary hover:underline">
                                            +91 94066 88303
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EnrolledCourseView;