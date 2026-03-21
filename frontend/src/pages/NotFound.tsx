import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft, BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60 leading-none select-none">
              404
            </h1>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <Compass className="w-10 h-10 text-primary-foreground animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the digital wilderness.
            Don't worry, we'll help you find your way back!
          </p>
          <p className="text-sm text-muted-foreground/70 font-mono bg-muted/50 inline-block px-4 py-2 rounded-lg">
            {location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Back to Home
          </Button>

          <Button
            onClick={() => navigate(-1)}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 font-semibold hover:bg-muted/50 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            Or explore these popular pages:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => navigate("/courses")}
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Courses
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default NotFound;
