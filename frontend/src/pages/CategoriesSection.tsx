import { Palette, Code2, TrendingUp, Megaphone, Database, Briefcase, Zap, Layout } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/axiosInstance";

// --- Dynamic Configuration Mapping ---

/**
 * Maps category title strings to appropriate Lucide icons and Tailwind gradient classes.
 */
const getCategoryConfig = (title: string) => {
    const lower = title.toLowerCase().trim();
    if (lower.includes('ui/ux') || lower.includes('design') || lower.includes('front-end'))
        return { icon: Palette, color: 'from-pink-500 to-pink-600', hue: 'text-pink-600 dark:text-pink-400' };
    if (lower.includes('program') || lower.includes('code') || lower.includes('dev'))
        return { icon: Code2, color: 'from-blue-500 to-blue-600', hue: 'text-blue-600 dark:text-blue-400' };
    if (lower.includes('stock') || lower.includes('finance') || lower.includes('invest'))
        return { icon: TrendingUp, color: 'from-orange-500 to-orange-600', hue: 'text-orange-600 dark:text-orange-400' };
    if (lower.includes('marketing') || lower.includes('seo') || lower.includes('ads'))
        return { icon: Megaphone, color: 'from-purple-500 to-purple-600', hue: 'text-purple-600 dark:text-purple-400' };
    if (lower.includes('data') || lower.includes('analytics') || lower.includes('scien'))
        return { icon: Database, color: 'from-indigo-500 to-indigo-600', hue: 'text-indigo-600 dark:text-indigo-400' };
    if (lower.includes('management') || lower.includes('business') || lower.includes('leadership'))
        return { icon: Briefcase, color: 'from-green-500 to-green-600', hue: 'text-green-600 dark:text-green-400' };
    if (lower.includes('web'))
        return { icon: Layout, color: 'from-teal-500 to-teal-600', hue: 'text-teal-600 dark:text-teal-400' };

    // Default
    return { icon: Zap, color: 'from-yellow-500 to-yellow-600', hue: 'text-yellow-600 dark:text-yellow-400' };
};

// --- Skeleton Loader Component ---

const CategorySkeleton = () => (
    <div className="bg-card rounded-2xl p-6 text-center border border-border/50 animate-pulse h-40 shadow-sm transition-all duration-300">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted" />
        <div className="h-4 bg-muted w-3/4 mx-auto mb-2 rounded" />
        <div className="h-3 bg-muted w-1/2 mx-auto rounded" />
    </div>
);


// --- Main Component ---

export const CategoriesSection = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoadingCategories(true);
                setError(null);

                // Fetch data from API
                const res = await axiosInstance.get("/course/get-all-categories-and-course-count");
                const cats = res.data.data || [];

                // Map API data to component state, adding config
                const dynamicCategories = cats.map((cat: any) => ({
                    id: cat._id,
                    title: cat.name,
                    ...getCategoryConfig(cat.name),
                    courses: cat.courses ? cat.courses.length : 0,
                }));

                setCategories(dynamicCategories);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setError("Failed to load categories. Please try again.");
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    // --- Conditional Rendering for Loading/Error ---

    if (isLoadingCategories) {
        return (
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Explore Top Categories</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CategorySkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || categories.length === 0) {
        return (
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center py-12 border border-border rounded-xl bg-card shadow-lg">
                        <Zap className="w-10 h-10 text-destructive mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Categories</h3>
                        <p className="text-muted-foreground">{error || "No categories found at this time."}</p>
                    </div>
                </div>
            </section>
        );
    }

    // --- Success Rendering ---

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Explore Top Categories
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose from our most popular learning paths
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={`/all-courses?category=${encodeURIComponent(category.title)}`}
                                className="group"
                            >
                                <div className="bg-card rounded-2xl p-6 text-center border border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center justify-center">
                                    {/* Icon - Gradient Background */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br ${category.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7" />
                                    </div>

                                    {/* Title */}
                                    <p className={`font-bold text-base ${category.hue} mb-1 leading-snug transition-colors duration-300`}>
                                        {category.title}
                                    </p>

                                    {/* Courses Count */}
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {category.courses} {category.courses === 1 ? "course" : "courses"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};