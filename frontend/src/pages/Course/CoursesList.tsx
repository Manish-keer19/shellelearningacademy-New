import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";

const CoursesList = () => {
  const courses = [
    {
      title: "Web Development Bootcamp",
      description: "Master modern web development from scratch",
      instructor: "Dr. Sarah Johnson",
      rating: 4.8,
      students: 15420,
      duration: "48 hours",
      level: "Beginner",
      category: "Development",
      image: "/placeholder.svg",
    },
    {
      title: "UI/UX Design Mastery",
      description: "Create beautiful and intuitive user interfaces",
      instructor: "Mike Chen",
      rating: 4.9,
      students: 12300,
      duration: "36 hours",
      level: "Intermediate",
      category: "Design",
      image: "/placeholder.svg",
    },
    {
      title: "Digital Marketing Pro",
      description: "Grow your business with digital marketing",
      instructor: "Emily Rodriguez",
      rating: 4.7,
      students: 18500,
      duration: "24 hours",
      level: "Beginner",
      category: "Marketing",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gradient">
          Featured Courses
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesList;