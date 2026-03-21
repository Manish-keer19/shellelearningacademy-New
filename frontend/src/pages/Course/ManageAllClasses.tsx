import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Calendar, Link as LinkIcon, ExternalLink, ChevronDown, ChevronUp, BookOpen, Search, X, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { courseClassService } from '@/service/courseClass.service';
import { courseService } from '@/service/course.service';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface Course {
    _id: string;
    courseName: string;
    courseDescription?: string;
    thumbnail?: string;
}

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

const ManageAllClasses: React.FC = () => {
    const { toast } = useToast();
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
    const [classes, setClasses] = useState<{ [courseId: string]: CourseClass[] }>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClassId, setCurrentClassId] = useState<string | null>(null);
    const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        className: '',
        classDescription: '',
        classUrl: '',
        classDate: '',
        recordingUrl: '',
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | null>(null);

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await courseService.getCoursesBasicInfo();
            if (response.success) {
                setCourses(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
            toast({
                title: "Error",
                description: "Failed to load courses",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClassesForCourse = async (courseId: string) => {
        try {
            const res = await courseClassService.getClassesByCourse(courseId, accessToken!);
            setClasses(prev => ({ ...prev, [courseId]: res.data }));
        } catch (error) {
            console.error("Failed to fetch classes", error);
            toast({
                title: "Error",
                description: "Failed to load classes",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleToggleCourse = (courseId: string) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
        } else {
            setExpandedCourseId(courseId);
            if (!classes[courseId]) {
                fetchClassesForCourse(courseId);
            }
        }
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            className: '',
            classDescription: '',
            classUrl: '',
            classDate: '',
            recordingUrl: '',
        });
        setDocumentFile(null);
        setExistingDocumentUrl(null);
        setIsEditing(false);
        setCurrentClassId(null);
        setCurrentCourseId(null);
    };

    const handleOpenDialog = (courseId: string) => {
        resetForm();
        setCurrentCourseId(courseId);
        setIsDialogOpen(true);
    };

    const handleEditClass = (courseId: string, cls: CourseClass) => {
        let localDateTimeString = '';
        if (cls.classDate) {
            const date = new Date(cls.classDate);
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            localDateTimeString = localDate.toISOString().slice(0, 16);
        }

        setFormData({
            className: cls.className,
            classDescription: cls.classDescription,
            classUrl: cls.classUrl,
            classDate: localDateTimeString,
            recordingUrl: cls.recordingUrl || '',
        });
        setExistingDocumentUrl(cls.documentFile?.secure_url || null);
        setDocumentFile(null);
        setCurrentClassId(cls._id);
        setCurrentCourseId(courseId);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a PDF file only.",
                    variant: "destructive",
                });
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Please upload a file smaller than 10MB.",
                    variant: "destructive",
                });
                return;
            }
            setDocumentFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.className || !formData.classDate || !formData.classUrl) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const localDate = new Date(formData.classDate);
            const utcDateString = localDate.toISOString();

            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('className', formData.className);
            formDataToSend.append('classDescription', formData.classDescription);
            formDataToSend.append('classUrl', formData.classUrl);
            formDataToSend.append('classDate', utcDateString);
            if (formData.recordingUrl) {
                formDataToSend.append('recordingUrl', formData.recordingUrl);
            }

            // Only append file if it's actually a File object
            console.log('📄 documentFile:', documentFile);
            console.log('📄 documentFile type:', typeof documentFile);
            console.log('📄 documentFile instanceof File:', documentFile instanceof File);

            if (documentFile && documentFile instanceof File) {
                console.log('✅ Appending document file:', documentFile.name);
                formDataToSend.append('documentFile', documentFile);
            } else {
                console.log('⚠️ No valid document file to append');
            }

            // Log FormData contents
            console.log('📦 FormData contents:');
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0], ':', pair[1]);
            }

            if (isEditing && currentClassId) {
                formDataToSend.append('classId', currentClassId);
                await courseClassService.updateClass(formDataToSend, accessToken!);
                toast({ title: "Class Updated Successfully" });
            } else {
                formDataToSend.append('courseId', currentCourseId!);
                await courseClassService.createClass(formDataToSend, accessToken!);
                toast({ title: "Class Created Successfully" });
            }
            setIsDialogOpen(false);
            if (currentCourseId) {
                fetchClassesForCourse(currentCourseId);
            }
            resetForm();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save class",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClass = async (courseId: string, classId: string) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;

        try {
            setIsLoading(true);
            await courseClassService.deleteClass({ classId, courseId }, accessToken!);
            toast({ title: "Class Deleted Successfully" });
            fetchClassesForCourse(courseId);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete class",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Navbar />

            {/* Main Container - Fully Responsive */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mt-16 sm:mt-20">

                {/* Page Header */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                        Manage Classes
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        View all courses and manage their classes in one place
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 sm:mb-8">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search courses by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-12 h-12 sm:h-14 text-sm sm:text-base shadow-md border-2 focus:border-primary transition-all duration-300"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-3 ml-1">
                            Found <span className="font-bold text-primary">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary"></div>
                        <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <Card className="text-center py-12 sm:py-16">
                        <CardContent>
                            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-sm sm:text-base">No courses found</p>
                        </CardContent>
                    </Card>
                ) : (
                    /* Courses Grid - Responsive */
                    <div className="grid gap-4 sm:gap-5 lg:gap-6">
                        {filteredCourses.map((course) => (
                            <Card
                                key={course._id}
                                className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                            >
                                {/* Course Header - Stack on Mobile, Row on Desktop */}
                                <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-muted/50 to-transparent">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                                        {/* Thumbnail */}
                                        {course.thumbnail && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.courseName}
                                                    className="w-full sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover shadow-md"
                                                />
                                            </div>
                                        )}

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">
                                                {course.courseName}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                                Course ID: <span className="font-mono">{course._id}</span>
                                            </p>
                                            {course.courseDescription && (
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                    {course.courseDescription}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons - Improved Mobile Layout */}
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            {/* Add Class Button - Full width on mobile, prominent */}
                                            <Button
                                                onClick={() => handleOpenDialog(course._id)}
                                                className="w-full sm:w-auto h-11 sm:h-9 font-semibold"
                                                size="default"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Class
                                            </Button>

                                            {/* Show/Hide Button - Full width on mobile */}
                                            <Button
                                                onClick={() => handleToggleCourse(course._id)}
                                                variant="outline"
                                                className="w-full sm:w-auto h-10 sm:h-9"
                                                size="default"
                                            >
                                                {expandedCourseId === course._id ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4 mr-2" />
                                                        Hide Classes
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4 mr-2" />
                                                        Show Classes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Classes Section */}
                                {expandedCourseId === course._id && (
                                    <div className="border-t bg-muted/30">
                                        {!classes[course._id] ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                <p className="mt-3 text-xs sm:text-sm text-muted-foreground">Loading classes...</p>
                                            </div>
                                        ) : classes[course._id].length === 0 ? (
                                            <div className="text-center py-12 px-4">
                                                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
                                                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                                                    No classes scheduled for this course.
                                                </p>
                                                <Button
                                                    onClick={() => handleOpenDialog(course._id)}
                                                    size="sm"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add First Class
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="p-4 sm:p-5 lg:p-6">
                                                {/* Desktop Table View */}
                                                <div className="hidden lg:block overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[25%]">Class Name</TableHead>
                                                                <TableHead className="w-[20%]">Date & Time</TableHead>
                                                                <TableHead className="w-[15%]">Meeting</TableHead>
                                                                <TableHead className="w-[15%]">Recording</TableHead>
                                                                <TableHead className="w-[15%]">Documents</TableHead>
                                                                <TableHead className="w-[10%] text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {classes[course._id].map((cls) => (
                                                                <TableRow key={cls._id}>
                                                                    <TableCell>
                                                                        <div className="font-semibold">{cls.className}</div>
                                                                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                                                            {cls.classDescription}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                            <span className="text-sm">
                                                                                {cls.classDate ? format(new Date(cls.classDate), "PPp") : "Invalid"}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <a
                                                                            href={cls.classUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                                                                        >
                                                                            Join <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {cls.recordingUrl ? (
                                                                            <a
                                                                                href={cls.recordingUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1 text-green-600 hover:underline text-sm"
                                                                            >
                                                                                View <ExternalLink className="w-3 h-3" />
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-xs text-muted-foreground">Not added</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {cls.documentFile?.secure_url ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <a
                                                                                    href={cls.documentFile.secure_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                                                                                >
                                                                                    Open <ExternalLink className="w-3 h-3" />
                                                                                </a>
                                                                                <button
                                                                                    onClick={() => handleDownloadFile(cls.documentFile.secure_url, cls.className)}
                                                                                    className="inline-flex items-center gap-1 text-purple-600 hover:underline text-sm bg-transparent border-0 p-0 cursor-pointer"
                                                                                >
                                                                                    Download <Download className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-xs text-muted-foreground">Not added</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleEditClass(course._id, cls)}
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                                onClick={() => handleDeleteClass(course._id, cls._id)}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Mobile/Tablet Card View */}
                                                <div className="lg:hidden space-y-3 sm:space-y-4">
                                                    {classes[course._id].map((cls) => (
                                                        <Card key={cls._id} className="bg-background/50 backdrop-blur-sm">
                                                            <CardContent className="p-4 sm:p-5">
                                                                {/* Class Name */}
                                                                <div className="mb-3">
                                                                    <h4 className="font-bold text-base sm:text-lg mb-1">
                                                                        {cls.className}
                                                                    </h4>
                                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                                        {cls.classDescription}
                                                                    </p>
                                                                </div>

                                                                {/* Date & Time */}
                                                                <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-md">
                                                                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                                                    <span className="text-xs sm:text-sm font-medium">
                                                                        {cls.classDate ? format(new Date(cls.classDate), "PPp") : "Invalid Date"}
                                                                    </span>
                                                                </div>

                                                                {/* Meeting Link */}
                                                                <a
                                                                    href={cls.classUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm sm:text-base mb-4 font-medium"
                                                                >
                                                                    <LinkIcon className="w-4 h-4" />
                                                                    Join Meeting
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>

                                                                {/* Recording Link */}
                                                                {cls.recordingUrl && (
                                                                    <a
                                                                        href={cls.recordingUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 text-green-600 hover:underline text-sm sm:text-base mb-2 font-medium"
                                                                    >
                                                                        <LinkIcon className="w-4 h-4" />
                                                                        View Recording
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                )}

                                                                {/* Document Links */}
                                                                {cls.documentFile?.secure_url && (
                                                                    <>
                                                                        <a
                                                                            href={cls.documentFile.secure_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm sm:text-base mb-2 font-medium"
                                                                        >
                                                                            <ExternalLink className="w-4 h-4" />
                                                                            Open Docs
                                                                        </a>
                                                                        <button
                                                                            onClick={() => handleDownloadFile(cls.documentFile.secure_url, cls.className)}
                                                                            className="inline-flex items-center gap-2 text-purple-600 hover:underline text-sm sm:text-base mb-4 font-medium bg-transparent border-0 p-0 cursor-pointer"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                            Download Docs
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {/* Action Buttons */}
                                                                <div className="flex gap-2 pt-3 border-t">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="flex-1"
                                                                        size="sm"
                                                                        onClick={() => handleEditClass(course._id, cls)}
                                                                    >
                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClass(course._id, cls._id)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Class Dialog - Fully Responsive */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl lg:text-2xl">
                                {isEditing ? "Edit Class" : "Schedule New Class"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="className" className="text-sm sm:text-base font-medium">
                                    Class Name *
                                </Label>
                                <Input
                                    id="className"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Introduction to React"
                                    className="h-10 sm:h-11 text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="classDate" className="text-sm sm:text-base font-medium">
                                    Date & Time *
                                </Label>
                                <Input
                                    id="classDate"
                                    name="classDate"
                                    type="datetime-local"
                                    value={formData.classDate}
                                    onChange={handleInputChange}
                                    className="h-10 sm:h-11 text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="classUrl" className="text-sm sm:text-base font-medium">
                                    Meeting URL *
                                </Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                        <LinkIcon className="h-4 w-4" />
                                    </span>
                                    <Input
                                        id="classUrl"
                                        name="classUrl"
                                        value={formData.classUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://zoom.us/..."
                                        className="rounded-l-none h-10 sm:h-11 text-sm sm:text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="classDescription" className="text-sm sm:text-base font-medium">
                                    Description *
                                </Label>
                                <Textarea
                                    id="classDescription"
                                    name="classDescription"
                                    value={formData.classDescription}
                                    onChange={handleInputChange}
                                    placeholder="Brief agenda or class description..."
                                    rows={4}
                                    className="text-sm sm:text-base resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recordingUrl" className="text-sm sm:text-base font-medium">
                                    Recording URL (Google Drive)
                                </Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                        <LinkIcon className="h-4 w-4" />
                                    </span>
                                    <Input
                                        id="recordingUrl"
                                        name="recordingUrl"
                                        value={formData.recordingUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://drive.google.com/..."
                                        className="rounded-l-none h-10 sm:h-11 text-sm sm:text-base"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Optional: Add Google Drive link for class recording
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documentFile" className="text-sm sm:text-base font-medium">
                                    Class Document (PDF)
                                </Label>
                                <Input
                                    id="documentFile"
                                    name="documentFile"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
                                />
                                {documentFile && (
                                    <p className="text-xs text-green-600 font-medium">
                                        Selected: {documentFile.name} ({(documentFile.size / 1024).toFixed(2)} KB)
                                    </p>
                                )}
                                {existingDocumentUrl && !documentFile && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">
                                            Current document:
                                        </p>
                                        <a
                                            href={existingDocumentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                                        >
                                            View PDF <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Optional: Upload a PDF document for this class (max 10MB)
                                </p>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="w-full sm:w-auto h-11 text-sm sm:text-base"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto h-11 text-sm sm:text-base"
                                >
                                    {isLoading ? "Saving..." : (isEditing ? "Update Class" : "Schedule Class")}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Footer />
        </div>
    );
};

export default ManageAllClasses;
