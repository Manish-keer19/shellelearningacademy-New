// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { Plus, Edit, Trash2, Eye, Users, DollarSign, BookOpen, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// import { courseService } from '@/service/course.service';
// import { useAppSelector } from '@/hooks/redux';
// import { Navbar } from '@/components/Navbar';

// const ManageCourses = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { token } = useAppSelector((state) => state.auth);

//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchCourses = async () => {
//     if (!token) return;
//     try {
//       setIsLoading(true);
//       const res = await courseService.getAdminCourses(token);
//       setCourses(res.data || []);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch courses",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     try {
//       setDeletingId(courseId);
//       await courseService.deleteCourse(courseId, token);
//       toast({
//         title: "Success",
//         description: "Course deleted successfully"
//       });
//       fetchCourses();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Failed to delete course",
//         variant: "destructive"
//       });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, [token]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-shell-darker via-shell-dark to-shell-dark  mt-20">
//         <Navbar/>
//         <div className="container mx-auto px-4 py-12 flex items-center justify-center">
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
//             <p>Loading your courses...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-shell-darker via-shell-dark to-shell-dark mt-20">
//       <Navbar/>
      
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">
//                 <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                   Manage Courses
//                 </span>
//               </h1>
//               <p className="text-muted-foreground">Create, edit, and manage your courses</p>
//             </div>
//             <Button 
//               onClick={() => navigate('/create-course')}
//               className="bg-gradient-to-r from-primary to-accent"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create New Course
//             </Button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <Card className="bg-card/80 backdrop-blur-lg border-border">
//               <CardContent className="p-6">
//                 <div className="flex items-center space-x-2">
//                   <BookOpen className="w-8 h-8 text-primary" />
//                   <div>
//                     <p className="text-2xl font-bold">{courses.length}</p>
//                     <p className="text-sm text-muted-foreground">Total Courses</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-card/80 backdrop-blur-lg border-border">
//               <CardContent className="p-6">
//                 <div className="flex items-center space-x-2">
//                   <Eye className="w-8 h-8 text-green-500" />
//                   <div>
//                     <p className="text-2xl font-bold">{courses.filter(c => c.status === 'Published').length}</p>
//                     <p className="text-sm text-muted-foreground">Published</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-card/80 backdrop-blur-lg border-border">
//               <CardContent className="p-6">
//                 <div className="flex items-center space-x-2">
//                   <Edit className="w-8 h-8 text-yellow-500" />
//                   <div>
//                     <p className="text-2xl font-bold">{courses.filter(c => c.status === 'Draft').length}</p>
//                     <p className="text-sm text-muted-foreground">Drafts</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-card/80 backdrop-blur-lg border-border">
//               <CardContent className="p-6">
//                 <div className="flex items-center space-x-2">
//                   <Users className="w-8 h-8 text-blue-500" />
//                   <div>
//                     <p className="text-2xl font-bold">
//                       {courses.reduce((total, course) => total + (course.studentsEnrolled?.length || 0), 0)}
//                     </p>
//                     <p className="text-sm text-muted-foreground">Total Students</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Courses Grid */}
//           {courses.length === 0 ? (
//             <Card className="bg-card/80 backdrop-blur-lg border-border">
//               <CardContent className="p-12 text-center">
//                 <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//                 <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
//                 <p className="text-muted-foreground mb-6">Create your first course to get started</p>
//                 <Button 
//                   onClick={() => navigate('/create-course')}
//                   className="bg-gradient-to-r from-primary to-accent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create Your First Course
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {courses.map((course: any) => (
//                 <Card key={course._id} className="bg-card/80 backdrop-blur-lg border-border hover:shadow-lg transition-all duration-200">
//                   <div className="aspect-video relative overflow-hidden rounded-t-lg">
//                     <img 
//                       src={course.thumbnail || '/placeholder.svg'} 
//                       alt={course.courseName}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute top-2 right-2">
//                       <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
//                         {course.status}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-lg line-clamp-2">{course.courseName}</CardTitle>
//                     <p className="text-sm text-muted-foreground line-clamp-2">
//                       {course.courseDescription}
//                     </p>
//                   </CardHeader>
                  
//                   <CardContent className="pt-0">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                         <div className="flex items-center space-x-1">
//                           <Users className="w-4 h-4" />
//                           <span>{course.studentsEnrolled?.length || 0}</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <DollarSign className="w-4 h-4" />
//                           <span>${course.price}</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => navigate(`/course/${course._id}`)}
//                         className="flex-1"
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => navigate(`/edit-course/${course._id}`)}
//                         className="flex-1"
//                       >
//                         <Edit className="w-4 h-4 mr-1" />
//                         Edit
//                       </Button>
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="text-destructive hover:bg-destructive/10"
//                             disabled={deletingId === course._id}
//                           >
//                             {deletingId === course._id ? (
//                               <Loader2 className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="w-4 h-4" />
//                             )}
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>Delete Course</AlertDialogTitle>
//                             <AlertDialogDescription>
//                               Are you sure you want to delete "{course.courseName}"? This action cannot be undone.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => handleDeleteCourse(course._id)}
//                               className="bg-destructive hover:bg-destructive/90"
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageCourses;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, Users, DollarSign, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Functional Hook
import { courseService } from '@/service/course.service'; // Functional Mock Service
import { useAppSelector } from '@/hooks/redux'; // Assumed Redux Hook
import { Navbar } from '@/components/Navbar';

// --- Helper Components for Styling ---

interface Course {
    _id: string;
    courseName: string;
    courseDescription: string;
    thumbnail: string;
    studentsEnrolled: any[];
    status: 'Published' | 'Draft';
    finalPrice?: number;
    originalPrice: number;
    discountedPrice?: number;
    courseLevel: string;
}

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

// --- Main Component ---

const ManageCourses = () => {
    const navigate = useNavigate();
    const { toast } = useToast(); 
    // NOTE: Replace with real user token selector in production
    const { token } = { token: "MOCK_ADMIN_TOKEN" }; 

    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // --- Dynamic Calculations ---
    const publishedCount = courses.filter(c => c.status === 'Published').length;
    const draftCount = courses.filter(c => c.status === 'Draft').length;
    const totalStudents = courses.reduce((total, course) => total + (course.studentsEnrolled?.length || 0), 0);
    const totalCourses = courses.length;

    // --- Core Logic: Fetching Data ---
    const fetchCourses = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const res = await courseService.getAdminCourses(token);
            setCourses(res.data || []);
        } catch (error: any) {
            console.error("Failed to fetch courses:", error);
            toast({ title: "Error", description: "Failed to fetch courses", variant: "destructive" });
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Core Logic: Deleting Course ---
    const handleDeleteCourse = async (courseId: string) => {
        try {
            setDeletingId(courseId); 
            
            // Send request to delete
            await courseService.deleteCourse(courseId, token); 
            
            // Successful response: Update UI optimistically
            setCourses(prev => prev.filter(c => c._id !== courseId));
            
            toast({ title: "Success", description: "Course deleted successfully" });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [token]);

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-foreground">
                <Navbar/>
                <div className="container mx-auto px-4 py-32 flex items-center justify-center">
                    <div className="text-center bg-card p-10 rounded-xl shadow-lg">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                        <p className="font-medium text-foreground">Loading your courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-foreground">
            <Navbar/>
            
            <div className="container mx-auto px-4 py-12 pt-32">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-1 text-foreground">
                                <span className="text-primary">Manage</span> Courses
                            </h1>
                            <p className="text-lg text-muted-foreground">Create, edit, and monitor your academy's content.</p>
                        </div>
                        <Button 
                            onClick={() => navigate('/create-course')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-6 rounded-xl shadow-md shadow-primary/30 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Course
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard 
                            icon={BookOpen} 
                            label="Total Courses" 
                            value={totalCourses} 
                            colorClass="text-primary" 
                        />
                        <StatCard 
                            icon={Eye} 
                            label="Published" 
                            value={publishedCount} 
                            colorClass="text-green-500" 
                        />
                        <StatCard 
                            icon={Edit} 
                            label="Drafts" 
                            value={draftCount} 
                            colorClass="text-yellow-500" 
                        />
                        <StatCard 
                            icon={Users} 
                            label="Total Students" 
                            value={totalStudents} 
                            colorClass="text-blue-500" 
                        />
                    </div>

                    {/* Courses Grid */}
                    {totalCourses === 0 ? (
                        <Card className="bg-card/90 backdrop-blur-lg border-border shadow-2xl">
                            <CardContent className="p-12 text-center">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                                <h3 className="text-xl font-bold mb-2 text-foreground">No courses created yet</h3>
                                <p className="text-muted-foreground mb-6">Create your first course to populate your academy!</p>
                                <Button 
                                    onClick={() => navigate('/create-course')}
                                    className="bg-primary hover:bg-primary/90 font-semibold"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Course
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Card key={course._id} className="bg-card/90 backdrop-blur-lg border-border/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                    {/* Thumbnail */}
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                        <img 
                                            src={course.thumbnail || 'https://via.placeholder.com/600x337/4C7C33/FFFFFF?text=Course+Image'} 
                                            alt={course.courseName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge 
                                                variant={course.status === 'Published' ? 'default' : 'secondary'} 
                                                className={`font-bold ${course.status === 'Draft' ? 'bg-yellow-500/80 text-white' : 'bg-green-500 hover:bg-green-600'}`}
                                            >
                                                {course.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl font-bold line-clamp-2 transition-colors hover:text-primary">{course.courseName}</CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                                            {course.courseDescription}
                                        </p>
                                    </CardHeader>
                                    
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/70">
                                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4 text-blue-500" />
                                                    <span className='font-semibold text-foreground'>{course.studentsEnrolled?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="w-4 h-4 text-primary" />
                                                    {/* Displaying the best price available */}
                                                    <span className='font-bold text-primary'>₹{course.finalPrice || course.discountedPrice || course.originalPrice}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs font-semibold">
                                                {course.courseLevel || 'Level N/A'}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => navigate(`/course-detail/${course._id}`)}
                                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                            >
                                                <Eye className="w-4 h-4 mr-1" /> View
                                            </Button>
                                            <Button
                                                onClick={() => navigate(`/edit-course/${course._id}`)}
                                                variant="outline"
                                                className="flex-1 text-primary border-primary hover:bg-primary/10 font-semibold"
                                            >
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="flex-shrink-0 w-10 h-10"
                                                        disabled={deletingId === course._id}
                                                    >
                                                        {deletingId === course._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className='text-xl text-destructive font-bold'>Confirm Deletion</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to permanently delete **"{course.courseName}"**? This action cannot be undone, and all associated student data will be lost.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteCourse(course._id)}
                                                            className="bg-destructive hover:bg-destructive/90 font-semibold"
                                                        >
                                                            Yes, Delete Course
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;