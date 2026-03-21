

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Clock, ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { courseService } from "@/service/course.service";
import toast from "react-hot-toast";
// Assuming axiosInstance is handled within courseService

// --- Utility Functions (Kept dynamic) ---

const inferLevel = (courseName: string): string => {
    const lowerName = courseName.toLowerCase();
    if (lowerName.includes("beginner")) return "Beginner";
    if (lowerName.includes("intermediate") || lowerName.includes("advanced")) return "Advanced";
    return "All Levels";
};

const inferCategory = (courseName: string): string => {
    const lowerName = courseName.toLowerCase();
    if (lowerName.includes("marketing")) return "Digital Marketing";
    if (lowerName.includes("python") || lowerName.includes("programming")) return "Programming";
    if (lowerName.includes("data") || lowerName.includes("analytics")) return "Data Science";
    return "General";
};

// --- Types (Using the transformed data structure) ---

interface CourseData {
    id: string;
    title: string;
    description: string;
    instructor: string;
    rating: number;
    reviews: number;
    duration: string;
    level: string;
    price: number;
    discountPercent: number;
    image: string;
}

// --- Reusable Components (Now fully dynamic) ---

const MainCourseCard: React.FC<{ course: CourseData }> = ({ course }) => (
    <div className="w-full bg-card rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl">
        {/* Large Image */}
        <Link to={`/course-detail/${course.id}`} className="group block relative aspect-video cursor-pointer">
            <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            />
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-base font-bold shadow-lg">
                ₹{course.price.toLocaleString()}
            </div>
            {/* Discount Badge */}
            {course.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    {course.discountPercent}% OFF
                </div>
            )}
        </Link>
        {/* Content */}
        <div className="p-5 sm:p-8">
            <h3 className="text-2xl font-extrabold text-foreground mb-2 line-clamp-2 transition-colors duration-300 hover:text-primary">
                {course.title}
            </h3>
            <p className="text-base text-muted-foreground mb-4">{course.instructor}</p>
            {/* Rating and Details */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-5 border-b border-border">
                <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground text-lg">{course.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} weeks</span>
                    </div>
                    <span className="text-border text-xl">•</span>
                    <span className="capitalize bg-muted px-2 py-0.5 rounded text-xs text-foreground font-semibold">{course.level}</span>
                </div>
            </div>
            {/* Button */}
            <Link to={`/course-detail/${course.id}`}>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300">
                    View Course
                    <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
            </Link>
        </div>
    </div>
);

const PreviewCourseCard: React.FC<{ course: CourseData, nextSlide: () => void }> = ({ course, nextSlide }) => (
    // Clicking the preview card navigates the carousel (improving UX)
    <div className="w-full bg-card rounded-2xl shadow-lg overflow-hidden border group cursor-pointer" onClick={nextSlide}>
        {/* Smaller Image */}
        <div className="relative aspect-video">
            <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />
            {/* Overlay to indicate interactivity */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-bold">NEXT UP</p>
            </div>
        </div>
        {/* Compact Content */}
        <div className="p-4">
            <h4 className="text-base font-bold text-foreground mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
                {course.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
            <div className="flex items-center space-x-1 text-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-xs">({course.reviews})</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 capitalize">{course.level} • {course.duration} weeks</p>
        </div>
    </div>
);


// --- Main FeaturedCourses Component ---

const FeaturedCourses = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const res = await courseService.getAllCourses();
            const coursesData = res.data || [];
            
            // --- DYNAMIC DATA TRANSFORMATION ---
            const transformedCourses: CourseData[] = coursesData.map((course: any) => ({
                id: course._id,
                title: course.courseName,
                description: course.courseDescription || "Explore this comprehensive course.",
                instructor: "By Industry Experts", // Static as the API doesn't provide instructor name here
                rating: course.ratingAndReviews?.length > 0
                    ? course.ratingAndReviews.reduce((acc: number, review: any) => acc + (review.rating || 0), 0) / course.ratingAndReviews.length
                    : 4.5, // Default rating if no reviews
                reviews: course.ratingAndReviews?.length || 0,
                duration: course.courseDuration || "Varies",
                level: inferLevel(course.courseName),
                price: course.finalPrice || course.price || 0,
                discountPercent: course.discountPercent || 0,
                image: course.thumbnail || "https://via.placeholder.com/800x450/4C7C33/FFFFFF?text=Featured+Course",
            }));
            // --- END TRANSFORMATION ---

            // Sort by newest and take top 6
            const sortedCourses = transformedCourses
                .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                .slice(0, 6); 
            
            setCourses(sortedCourses);
        } catch (error) {
            // Using a more structured error message
            toast.error("Failed to load featured courses. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const nextSlide = () => {
        if (courses.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % courses.length);
        }
    };

    const prevSlide = () => {
        if (courses.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
        }
    };

    const hasMultipleCourses = courses.length > 1;
    
    // Safety check for array access
    if (courses.length === 0 && !isLoading) {
        return (
            <section className="py-20 bg-gradient-to-b from-background to-secondary/10 min-h-[500px]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center py-16 bg-card rounded-xl shadow-lg border border-border">
                        <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">No Featured Courses Found</h3>
                        <p className="text-muted-foreground mt-1">Check back later or view all courses for a complete list.</p>
                    </div>
                </div>
            </section>
        );
    }
    
    // Extract the courses for the current slide
    const mainCourse = courses[currentIndex];
    const nextCourseIndex = (currentIndex + 1) % courses.length;
    const nextCourse = courses[nextCourseIndex];

    // --- Main Render ---
    return (
        <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header and Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-foreground">Featured Courses</h2>
                        <p className="text-lg text-muted-foreground mt-2">Handpicked courses to accelerate your learning journey</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/all-courses">
                            <Button variant="outline" className="h-10 text-primary border-primary hover:bg-primary/10 transition-colors group">
                                View All Courses
                                <BookOpen className="w-4 h-4 ml-2 group-hover:scale-105 transition-transform" />
                            </Button>
                        </Link>
                        {/* Navigation Arrows */}
                        {hasMultipleCourses && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border"
                                    aria-label="Previous course"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border"
                                    aria-label="Next course"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Courses Container - Main Slider Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Large Card */}
                    <div className="lg:col-span-2">
                        {/* Safety check before rendering */}
                        {mainCourse && <MainCourseCard course={mainCourse} />}
                    </div>

                    {/* Preview Small Card */}
                    {hasMultipleCourses && nextCourse && (
                        <div className="lg:col-span-1 hidden lg:block">
                            <PreviewCourseCard course={nextCourse} nextSlide={nextSlide} />
                            
                            {/* Optional: Add a second smaller preview card (for 3+ courses) */}
                            {courses.length > 2 && (
                                <div className="mt-6">
                                    <PreviewCourseCard 
                                        course={courses[(nextCourseIndex + 1) % courses.length]} 
                                        nextSlide={nextSlide} 
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCourses;