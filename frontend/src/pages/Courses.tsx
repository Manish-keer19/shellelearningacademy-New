import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { courseService } from "@/service/course.service";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await courseService.getAllCourses();
        const data = res?.data || [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast({ title: "Failed to load courses", description: error?.response?.data?.message || "", variant: "destructive" });
      }
      try {
        const catRes = await courseService.getAllCategories();
        const catData = catRes?.data || [];
        const names = ["All", ...catData.map((c: any) => c?.name).filter(Boolean)];
        setCategories(names);
      } catch (_) { }
    };
    fetchData();
  }, [toast]);

  const filteredCourses = useMemo(() => {
    const byCategory = activeCategory === "All" ? courses : courses.filter((c: any) => c?.category?.name === activeCategory || c?.category === activeCategory);
    if (!search.trim()) return byCategory;
    const q = search.toLowerCase();
    return byCategory.filter((c: any) =>
      (c?.courseName || "").toLowerCase().includes(q) || (c?.courseDescription || "").toLowerCase().includes(q)
    );
  }, [courses, activeCategory, search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header Section */}
        <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Explore Our <span className="text-gradient">Courses</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Choose from hundreds of courses taught by industry experts. Start learning today.
              </p>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for courses..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === activeCategory ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredCourses.length} courses available</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((c: any) => (
                <CourseCard
                  key={c._id}
                  title={c.courseName || "Untitled"}
                  description={c.courseDescription || ""}
                  duration={"—"}
                  students={(c.studentsEnrolled?.length || c.studentsEnroled?.length || 0)}
                  rating={Array.isArray(c.ratingAndReviews) ? Math.round((c.ratingAndReviews.reduce((acc: number, r: any) => acc + (r?.rating || 0), 0) / (c.ratingAndReviews.length || 1)) * 10) / 10 : 0}
                  image={c.thumbnail || ""}
                  category={c.category?.name || "General"}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
