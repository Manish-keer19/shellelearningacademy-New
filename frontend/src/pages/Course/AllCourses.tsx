import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Star,
  Loader2,
  Frown,
  Filter,
  FilterX,
  X,
  Users,
  BookOpen,
  Palette,
  Code2,
  TrendingUp,
  Megaphone,
  Database,
  Briefcase,
  Zap,
  Layout,
  Home,
  ChevronRight,
  ArrowLeft,
  Grid3x3,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { courseService } from "@/service/course.service";

// 0. Category Configuration Helper
const getCategoryConfig = (title: string) => {
  const lower = title.toLowerCase().trim();
  if (
    lower.includes("ui/ux") ||
    lower.includes("design") ||
    lower.includes("front-end")
  )
    return {
      icon: Palette,
      color: "from-pink-500 to-pink-600",
      hue: "text-pink-600 dark:text-pink-400",
      bgLight: "bg-pink-50 dark:bg-pink-950/20",
    };
  if (
    lower.includes("program") ||
    lower.includes("code") ||
    lower.includes("dev")
  )
    return {
      icon: Code2,
      color: "from-blue-500 to-blue-600",
      hue: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/20",
    };
  if (
    lower.includes("stock") ||
    lower.includes("finance") ||
    lower.includes("invest")
  )
    return {
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      hue: "text-orange-600 dark:text-orange-400",
      bgLight: "bg-orange-50 dark:bg-orange-950/20",
    };
  if (
    lower.includes("marketing") ||
    lower.includes("seo") ||
    lower.includes("ads")
  )
    return {
      icon: Megaphone,
      color: "from-purple-500 to-purple-600",
      hue: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-950/20",
    };
  if (
    lower.includes("data") ||
    lower.includes("analytics") ||
    lower.includes("scien")
  )
    return {
      icon: Database,
      color: "from-indigo-500 to-indigo-600",
      hue: "text-indigo-600 dark:text-indigo-400",
      bgLight: "bg-indigo-50 dark:bg-indigo-950/20",
    };
  if (
    lower.includes("management") ||
    lower.includes("business") ||
    lower.includes("leadership")
  )
    return {
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      hue: "text-green-600 dark:text-green-400",
      bgLight: "bg-green-50 dark:bg-green-950/20",
    };
  if (lower.includes("web"))
    return {
      icon: Layout,
      color: "from-teal-500 to-teal-600",
      hue: "text-teal-600 dark:text-teal-400",
      bgLight: "bg-teal-50 dark:bg-teal-950/20",
    };

  // Default
  return {
    icon: Zap,
    color: "from-yellow-500 to-yellow-600",
    hue: "text-yellow-600 dark:text-yellow-400",
    bgLight: "bg-yellow-50 dark:bg-yellow-950/20",
  };
};

// 0.5 Category Card Component - Compact & Premium Design
const CategoryCard = ({
  category,
  onClick,
}: {
  category: any;
  onClick: () => void;
}) => {
  const Icon = category.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-card to-card/50 rounded-xl p-6 text-center border border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with gradient background - Smaller & More Compact */}
        <div
          className={`inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
        >
          <Icon className="w-7 h-7" />
        </div>

        {/* Category Title - More Compact */}
        <h3
          className={`font-bold text-base ${category.hue} mb-2 leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center`}
        >
          {category.title}
        </h3>

        {/* Course Count - Sleeker Design */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 group-hover:border-primary/30 transition-colors">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">
            {category.count} {category.count === 1 ? "Course" : "Courses"}
          </span>
        </div>

        {/* Hover indicator - Subtle */}
        <div className="mt-3 h-5 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View All →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// 1. Reusable Course Card Component (Updated for better UI/UX and pricing)
const CourseCard = ({ course }) => {
  // Determine Star Color based on rating (better UI/UX)
  const starColor =
    course.rating >= 4.5
      ? "fill-green-500 text-green-500"
      : course.rating >= 4.0
        ? "fill-yellow-500 text-yellow-500"
        : "fill-orange-500 text-orange-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl overflow-hidden shadow-xl border border-border/70 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image with Price Badge */}
      <Link
        to={`/course-detail/${course.id}`}
        className="relative block aspect-video overflow-hidden"
      >
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1280x720/ECECEC/9CA3AF?text=No+Image";
          }}
        />
        {course.discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
            {course.discountPercent}% OFF
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category Badge - NEW */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            {course.category}
          </span>
        </div>

        <h3 className="font-bold text-lg line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Industry Expert Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm text-primary">
              Industry Expert
            </span>
          </div>
        </div>

        {/* Course Duration */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span className="font-medium">{course.duration}</span>
        </div>

        {/* Rating, Students, Level */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {/* Rating */}
          <div className="flex items-center space-x-1 text-sm">
            <Star className={`w-4 h-4 ${starColor}`} />
            <span className="font-bold text-foreground">
              {course.rating.toFixed(1)}
            </span>
          </div>
          {/* Students */}
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {course.students.toLocaleString()}
            </span>
          </div>
          {/* Level */}
          <div className="text-xs">
            <span className="capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
              {course.level}
            </span>
          </div>
        </div>

        {/* Enhanced Price Display */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex flex-col">
            {course.originalPrice > course.discountedPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  ₹{course.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  Save ₹
                  {(
                    course.originalPrice - course.discountedPrice
                  ).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-extrabold text-primary">
                ₹{course.discountedPrice.toLocaleString()}
              </span>
              {course.discountPercent > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                  {course.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 2. Loading Skeleton (No changes needed)
const CourseCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-48 bg-muted/50" />
    <div className="p-5 space-y-4">
      <div className="h-4 bg-muted rounded w-4/5" />
      <div className="h-3 bg-muted rounded w-2/3" />
      <div className="flex justify-between pt-2 border-t border-muted/50">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-3 bg-muted rounded w-1/5" />
      </div>
    </div>
  </div>
);

// 3. Filter Section Wrapper (No changes needed)
const FilterCard = ({ title, children }) => (
  <Card className="shadow-lg border border-border/70">
    <CardHeader className="p-4 border-b border-border/70">
      <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-3">{children}</CardContent>
  </Card>
);

// 4. Mobile Filter Drawer Component (No changes needed)
const MobileFilterDrawer = ({
  isOpen,
  onClose,
  children,
  clearFilters,
  isFiltered,
}) => (
  <>
    {/* Backdrop */}
    {isOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />
    )}

    {/* Drawer Panel */}
    <div
      className={`fixed top-0 left-0 w-full max-w-sm h-full overflow-y-auto bg-card z-50 shadow-2xl transition-transform duration-300 lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="sticky top-0 bg-card p-4 border-b border-border flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Filter className="w-6 h-6 text-primary" /> Apply Filters
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close filters"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {isFiltered && (
          <Button
            onClick={clearFilters}
            variant="destructive"
            className="w-full font-bold"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
        {/* Filters passed as children */}
        {children}
        <Button
          onClick={onClose}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        >
          Show Results
        </Button>
      </div>
    </div>
  </>
);

// --- Main AllCourses Component ---

const AllCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"categories" | "courses">(
    "categories",
  ); // NEW: Track view mode

  const levels = useMemo(
    () => ["Beginner", "Intermediate", "Advanced", "All Levels"],
    [],
  );

  // --- Data Fetching and Initialization ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          courseService.getAllCourses(),
          courseService.getAllCategories(),
        ]);

        const coursesData = coursesRes.data || [];
        const mappedCourses = coursesData.map((course) => {
          return {
            id: course._id,
            title: course.courseName,
            instructorEmail: course.instructor?.email || "N/A",
            instructorName: "Manish Keer",
            rating: parseFloat(course.ratingValue) || 4.5,
            reviews: parseInt(course.reviewCount) || 25,
            students: parseInt(course.studentCount) || 50,
            duration: course.courseDuration || "Varies",
            level: course.courseLevel || "All Levels",
            category: course.category?.name || "Uncategorized",
            image:
              course.thumbnail ||
              "https://via.placeholder.com/800x450/4C7C33/FFFFFF?text=Course+Image",
            price: course.finalPrice || 0,
            originalPrice: course.originalPrice || course.finalPrice || 0,
            discountedPrice: course.finalPrice || 0,
            discountPercent: course.discountPercent || 0,
          };
        });

        setCourses(mappedCourses);

        // Enrich categories with icons and colors
        const enrichedCategories = (categoriesRes.data || [])
          .filter((cat: any) => cat && cat.name)
          .map((cat: any) => {
            const courseCount = mappedCourses.filter(
              (c) => c.category === cat.name,
            ).length;
            return {
              id: cat._id,
              name: cat.name,
              title: cat.name,
              count: courseCount,
              ...getCategoryConfig(cat.name),
            };
          })
          .filter((cat: any) => cat.count > 0); // Only show categories with courses

        setCategories(enrichedCategories);

        // Check URL params to determine initial view
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          setSelectedCategories(new Set([categoryParam]));
          setViewMode("courses"); // Show courses if category is in URL
        } else {
          setViewMode("categories"); // Show categories by default
        }

        const searchParam = searchParams.get("search");
        if (searchParam) {
          setSearchTerm(searchParam);
          setViewMode("courses"); // Show courses if searching
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to fetch courses or categories.");
        setCourses([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // --- Filter Handlers ---
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value.trim() && value.length >= 2) {
      newParams.set("search", value.trim());
      setViewMode("courses"); // Switch to courses view when searching
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value, checked) => {
    setSelectedCategories((prevSet) => {
      const newSet = new Set(prevSet);
      if (checked) newSet.add(value);
      else newSet.delete(value);
      return newSet;
    });
  };

  const handleLevelChange = (value, checked) => {
    setSelectedLevels((prevSet) => {
      const newSet = new Set(prevSet);
      if (checked) newSet.add(value);
      else newSet.delete(value);
      return newSet;
    });
  };

  // NEW: Handle category card click
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategories(new Set([categoryName]));
    setViewMode("courses");
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", categoryName);
    setSearchParams(newParams);
  };

  // NEW: Handle back to categories
  const handleBackToCategories = () => {
    setViewMode("categories");
    setSelectedCategories(new Set());
    setSelectedLevels(new Set());
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
      count: cat.count,
    }));
  }, [categories]);

  // --- Main Filtering Logic ---
  const filteredCourses = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const minSearchLength = 2;

    return courses.filter((course) => {
      const matchesSearch =
        lowerSearch.length < minSearchLength ||
        course.title.toLowerCase().includes(lowerSearch) ||
        course.category.toLowerCase().includes(lowerSearch) ||
        course.level.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        selectedCategories.size === 0 ||
        selectedCategories.has(course.category);
      const matchesLevel =
        selectedLevels.size === 0 || selectedLevels.has(course.level);
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, selectedCategories, selectedLevels, courses]);

  const totalCourses = courses.length;
  const showingCourses = filteredCourses.length;
  const isFiltered =
    selectedCategories.size > 0 ||
    selectedLevels.size > 0 ||
    searchTerm.length >= 2;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories(new Set());
    setSelectedLevels(new Set());
    setSearchParams(new URLSearchParams());
    setViewMode("categories"); // Reset to categories view
  };

  const skeletonCount = 8; // Increased skeleton count to fit new layout

  // --- Filter UI Component ---
  const FilterUI = ({ onClear }) => (
    <>
      <div className="space-y-6">
        {/* Clear Filters Button */}
        <div className="hidden lg:block">
          {isFiltered && (
            <Button
              onClick={onClear}
              variant="destructive"
              className="w-full font-bold shadow-md hover:shadow-lg"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <FilterCard title="Categories">
          {categoryOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between space-x-2 text-sm"
            >
              <Label
                htmlFor={`cat-${option.value}`}
                className="cursor-pointer flex-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                {option.value}
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-xs">
                  ({option.count})
                </span>
                <Checkbox
                  id={`cat-${option.value}`}
                  checked={selectedCategories.has(option.value)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(option.value, checked)
                  }
                />
              </div>
            </div>
          ))}
        </FilterCard>

        {/* Level Filter */}
        <FilterCard title="Course Level">
          {levels.map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${value}`}
                checked={selectedLevels.has(value)}
                onCheckedChange={(checked) => handleLevelChange(value, checked)}
              />
              <Label
                htmlFor={`level-${value}`}
                className="text-sm cursor-pointer font-medium text-foreground hover:text-primary transition-colors"
              >
                {value}
              </Label>
            </div>
          ))}
        </FilterCard>
      </div>
    </>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        clearFilters={clearFilters}
        isFiltered={isFiltered}
      >
        <FilterUI onClear={clearFilters} />
      </MobileFilterDrawer>

      <main className="container mx-auto px-4 pt-20 pb-20 max-w-screen-2xl">
        {/* Breadcrumb Navigation */}
        {viewMode === "courses" && (
          <div className="flex items-center gap-2 text-sm mb-6 pt-8">
            <Home className="w-4 h-4 text-muted-foreground" />
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <button
              onClick={handleBackToCategories}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              All Categories
            </button>
            {selectedCategories.size > 0 && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-semibold">
                  {Array.from(selectedCategories)[0]}
                </span>
              </>
            )}
          </div>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16 pt-8"
        >
          {viewMode === "categories" ? (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 lg:mb-4 text-foreground">
                Explore <span className="text-primary">Course Categories</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Choose from our diverse range of expertly curated categories and
                start your learning journey today
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-3 lg:mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCategories}
                  className="gap-1.5 text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Categories</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 lg:mb-4 text-foreground px-4">
                {selectedCategories.size > 0 ? (
                  <>
                    <span className="text-primary">
                      {Array.from(selectedCategories)[0]}
                    </span>{" "}
                    Courses
                  </>
                ) : (
                  <>
                    Discover Your Next{" "}
                    <span className="text-primary">Learning Path</span>
                  </>
                )}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                {selectedCategories.size > 0
                  ? `Explore our comprehensive ${Array.from(selectedCategories)[0]} courses taught by industry experts`
                  : "Explore our comprehensive catalog of high-quality, mentor-led courses across all major domains."}
              </p>
            </>
          )}
        </motion.div>

        {/* CATEGORIES VIEW */}
        {viewMode === "categories" && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-6 animate-pulse border border-border/50"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted" />
                    <div className="h-4 bg-muted w-3/4 mx-auto mb-2 rounded" />
                    <div className="h-6 bg-muted w-20 mx-auto rounded-full" />
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => handleCategoryClick(category.name)}
                    />
                  ))}
                </div>

                {/* Premium Stats Section */}
                <div className="mt-20">
                  {/* Section Header */}
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Our Learning{" "}
                      <span className="text-primary">Platform</span>
                    </h2>
                    <p className="text-muted-foreground">
                      Join thousands of learners on their journey to success
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories Stat */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Grid3x3 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground group-hover:scale-105 transition-transform duration-300">
                            {categories.length}
                          </h3>
                          <p className="text-base font-semibold text-muted-foreground">
                            Categories Available
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            Diverse learning paths
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Total Courses Stat */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-2xl p-8 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground group-hover:scale-105 transition-transform duration-300">
                            {courses.length}
                          </h3>
                          <p className="text-base font-semibold text-muted-foreground">
                            Total Courses
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            Expert-led content
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Students Enrolled Stat */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-2xl p-8 border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Users className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground group-hover:scale-105 transition-transform duration-300">
                            {courses
                              .reduce((sum, c) => sum + c.students, 0)
                              .toLocaleString()}
                          </h3>
                          <p className="text-base font-semibold text-muted-foreground">
                            Students Enrolled
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            Active learners worldwide
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Additional Info Banner */}
                  <div className="mt-8 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-foreground">
                          New courses added weekly
                        </span>
                      </div>
                      <div className="hidden md:block w-px h-6 bg-border" />
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-foreground">
                          Industry-expert instructors
                        </span>
                      </div>
                      <div className="hidden md:block w-px h-6 bg-border" />
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          Certificate on completion
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-card rounded-xl shadow-lg border border-border">
                <Frown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">
                  No Categories Available
                </h3>
                <p className="text-muted-foreground mt-2">
                  Please check back later for new categories.
                </p>
              </div>
            )}
          </>
        )}

        {/* COURSES VIEW */}
        {viewMode === "courses" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 1. Desktop Sidebar Filters - Hidden on Mobile */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="sticky top-20">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
                  <Filter className="w-6 h-6 text-primary" /> Filters
                </h2>
                <FilterUI onClear={clearFilters} />
              </div>
            </div>

            {/* 2. Main Content Area - Full Width on Mobile */}
            <div className="w-full lg:w-3/4">
              {/* Mobile-Optimized Header - Non-sticky on mobile */}
              <div className="mb-6 space-y-4">
                {/* Search Bar - Full width on mobile */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-10 h-12 text-base shadow-sm focus-visible:ring-primary w-full"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                {/* Filter Button & Course Count Row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Course Count */}
                  <p className="text-sm font-semibold text-muted-foreground">
                    <span className="text-foreground">{showingCourses}</span> of{" "}
                    {totalCourses} courses
                  </p>

                  {/* Mobile Filter Toggle Button - Compact */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2 text-primary border-primary hover:bg-primary/10"
                    onClick={() => setIsMobileFilterOpen(true)}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {isFiltered && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Content Display - Full Width Grid on Mobile */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: skeletonCount }).map((_, i) => (
                    <CourseCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-xl shadow-lg border border-border">
                  <Frown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground">
                    No Courses Found
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto px-4">
                    Your current filters or search term match no courses. Try
                    adjusting your filters or clearing your search.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 px-4">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      Clear Filters
                    </Button>
                    <Button onClick={handleBackToCategories} variant="default">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Categories
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllCourses;
