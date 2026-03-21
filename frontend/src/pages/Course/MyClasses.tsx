import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, Video, FileText, Clock, CheckCircle2, XCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { courseClassService } from '@/service/courseClass.service';
import { format, isPast } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface CourseClass {
    _id: string;
    className: string;
    classDescription: string;
    classUrl: string;
    classDate: string;
    recordingUrl?: string;
    documentFile?: {
        secure_url: string;
        public_id: string;
    };
}

interface Course {
    _id: string;
    courseName: string;
    thumbnail?: string;
}

const MyClasses: React.FC = () => {
    const { toast } = useToast();
    const { accessToken, user } = useSelector((state: RootState) => state.auth);
    const [courses, setCourses] = useState<Course[]>([]);
    const [classesData, setClassesData] = useState<{ [courseId: string]: CourseClass[] }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.courses && Array.isArray(user.courses)) {
            fetchCoursesAndClasses();
        }
    }, [user]);

    const fetchCoursesAndClasses = async () => {
        try {
            setIsLoading(true);
            const enrolledCourses = user?.courses || [];

            // Fetch classes for each enrolled course
            const classesPromises = enrolledCourses.map(async (course: any) => {
                try {
                    const res = await courseClassService.getClassesByCourse(course._id, accessToken!);
                    return { courseId: course._id, classes: res.data || [] };
                } catch (error) {
                    console.error(`Failed to fetch classes for course ${course._id}`, error);
                    return { courseId: course._id, classes: [] };
                }
            });

            const classesResults = await Promise.all(classesPromises);
            const classesMap: { [courseId: string]: CourseClass[] } = {};

            classesResults.forEach(({ courseId, classes }) => {
                classesMap[courseId] = classes;
            });

            setCourses(enrolledCourses);
            setClassesData(classesMap);
        } catch (error) {
            console.error("Failed to fetch courses and classes", error);
            toast({
                title: "Error",
                description: "Failed to load your classes",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getClassStatus = (classDate: string) => {
        const date = new Date(classDate);
        const now = new Date();
        const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffHours > 24) return { status: 'upcoming', color: 'bg-blue-500', text: 'Upcoming' };
        if (diffHours > 0 && diffHours <= 24) return { status: 'soon', color: 'bg-orange-500', text: 'Starting Soon' };
        return { status: 'missed', color: 'bg-red-500', text: 'Missed' };
    };

    const handleDownloadFile = async (url: string, fileName: string) => {
        toast({ title: "Preparing download...", description: "Please wait while we prepare your file." });
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

            toast({ title: "Download started" });
        } catch (error) {
            console.error("Download failed:", error);
            toast({ title: "Download failed", description: "Failed to download the document.", variant: "destructive" });
        }
    };

    const renderClassCard = (cls: CourseClass, course: Course) => {
        const classStatus = getClassStatus(cls.classDate);
        const isMissed = classStatus.status === 'missed';

        return (
            <Card key={cls._id} className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Course Thumbnail */}
                        {course.thumbnail && (
                            <div className="flex-shrink-0">
                                <img
                                    src={course.thumbnail}
                                    alt={course.courseName}
                                    className="w-full md:w-32 md:h-32 rounded-lg object-cover"
                                />
                            </div>
                        )}

                        {/* Class Details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-1">{cls.className}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{course.courseName}</p>
                                </div>
                                <Badge className={`${classStatus.color} text-white ml-2`}>
                                    {classStatus.text}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {cls.classDescription}
                            </p>

                            {/* Date & Time */}
                            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-md">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {cls.classDate ? format(new Date(cls.classDate), "PPp") : "Invalid Date"}
                                </span>
                            </div>

                            {/* Action Links */}
                            <div className="flex flex-wrap gap-3">
                                {/* Meeting Link - Only show if not missed or if missed but no recording */}
                                {(!isMissed || !cls.recordingUrl) && (
                                    <a
                                        href={cls.classUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Join Live Class
                                    </a>
                                )}

                                {/* Recording Link - Show for missed classes */}
                                {isMissed && cls.recordingUrl && (
                                    <a
                                        href={cls.recordingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        <Video className="w-4 h-4" />
                                        Watch Recording
                                    </a>
                                )}

                                {/* Document Links */}
                                {cls.documentFile?.secure_url && (
                                    <>
                                        {/* Open in New Tab */}
                                        <a
                                            href={cls.documentFile.secure_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Open Docs
                                        </a>

                                        <Button
                                            onClick={() => handleDownloadFile(cls.documentFile.secure_url, cls.className)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium border-0 h-auto"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Docs
                                        </Button>
                                    </>
                                )}

                                {/* Show message if missed and no resources */}
                                {isMissed && !cls.recordingUrl && !cls.documentFile?.secure_url && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <XCircle className="w-4 h-4" />
                                        <span>Recording and documents not yet available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const getAllClasses = () => {
        const allClasses: Array<{ class: CourseClass; course: Course }> = [];
        courses.forEach(course => {
            const classes = classesData[course._id] || [];
            classes.forEach(cls => {
                allClasses.push({ class: cls, course });
            });
        });
        return allClasses.sort((a, b) => new Date(b.class.classDate).getTime() - new Date(a.class.classDate).getTime());
    };

    const getUpcomingClasses = () => {
        return getAllClasses().filter(({ class: cls }) => {
            const status = getClassStatus(cls.classDate);
            return status.status === 'upcoming' || status.status === 'soon';
        });
    };

    const getMissedClasses = () => {
        return getAllClasses().filter(({ class: cls }) => {
            const status = getClassStatus(cls.classDate);
            return status.status === 'missed';
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-16 sm:mt-20">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                        My Classes
                    </h1>
                    <p className="text-muted-foreground">
                        View all your scheduled classes, recordings, and documents
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Loading your classes...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">You are not enrolled in any courses yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                            <TabsTrigger value="all">
                                All ({getAllClasses().length})
                            </TabsTrigger>
                            <TabsTrigger value="upcoming">
                                Upcoming ({getUpcomingClasses().length})
                            </TabsTrigger>
                            <TabsTrigger value="missed">
                                Missed ({getMissedClasses().length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {getAllClasses().length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No classes scheduled</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                getAllClasses().map(({ class: cls, course }) => renderClassCard(cls, course))
                            )}
                        </TabsContent>

                        <TabsContent value="upcoming" className="space-y-4">
                            {getUpcomingClasses().length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No upcoming classes</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                getUpcomingClasses().map(({ class: cls, course }) => renderClassCard(cls, course))
                            )}
                        </TabsContent>

                        <TabsContent value="missed" className="space-y-4">
                            {getMissedClasses().length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                        <p className="text-muted-foreground">Great! You haven't missed any classes</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                getMissedClasses().map(({ class: cls, course }) => renderClassCard(cls, course))
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MyClasses;
