import { Navigation } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Course = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navigation />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Course</h1>
        <p className="text-muted-foreground">Course page content goes here</p>
      </main>

      <Footer />
    </div>
  );
};

export default Course;