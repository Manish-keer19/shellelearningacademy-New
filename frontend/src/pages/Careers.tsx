import { getAllJobs } from "@/service/job.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Users,
  Building,
  Loader2,
  Search,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Import Assets
import heroImage from "@/assets/hero_career.png";
import student1 from "@/assets/student_1.png";
import student2 from "@/assets/student_2.png";
// Fallbacks for missing images
const student3 = student1;
const student4 = student2;
const student5 = student1;
const student6 = student2;

const Careers = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Data Fetching ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobType?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  // --- UI Helpers ---
  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case "Full-time":
        return "bg-green-100 text-green-700 border-green-200";
      case "Part-time":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Internship":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleViewDetails = (job: any) => {
    navigate(`/careers/${job._id}`, { state: { job } });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* SECTION 1 - HERO SECTION */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Soft Green Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e5f1df] via-[#dfeeda] to-background -z-10" />

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-green-200 text-green-800 font-semibold text-sm shadow-sm">
                <Briefcase className="w-4 h-4" />
                We are hiring!
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Discover Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
                  Career Mission
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join our innovative team and shape the future of learning with
                us. We're looking for passionate individuals to make a
                difference.
              </p>

              {/* Search & Email Box */}
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-green-100 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search jobs by title, department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-none shadow-none focus-visible:ring-0 text-base bg-transparent"
                  />
                </div>
                <Button className="h-12 px-8 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold shadow-lg shadow-green-200">
                  Find Jobs
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground font-medium">
                <span>Or apply via email:</span>
                <a
                  href="mailto:career@shellelearningacademy.com"
                  className="text-green-700 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />{" "}
                  career@shellelearningacademy.com
                </a>
              </div>
            </motion.div>

            {/* Hero Image with Floating Badges */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative w-full max-w-lg lg:max-w-xl"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-white">
                <img
                  src={heroImage}
                  alt="Happy Professionals"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
              </div>

              {/* Floating Badges */}
              <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-green-50 animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-full">
                    <Users className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      Active Applicants
                    </p>
                    <p className="text-lg font-extrabold text-foreground">
                      2,400+
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-green-50 animate-pulse-slow hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-full">
                    <Briefcase className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      Jobs Posted
                    </p>
                    <p className="text-lg font-extrabold text-foreground">
                      100+
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-12 bg-white p-3 rounded-xl shadow-lg border border-green-50 flex items-center gap-2 animate-float hidden md:flex">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                <span className="font-bold text-sm text-green-800">
                  Interview Scheduled
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION 2 - OPEN POSITIONS */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the latest opportunities to join our growing team.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">
                Loading opportunities...
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job: any, index: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Card className="group bg-white border-green-100 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden flex flex-col relative h-full">
                    {/* Lightning Icon */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                          <Building className="w-6 h-6" />
                        </div>
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1 border-gray-200 text-gray-500 font-mono text-xs"
                        >
                          #{job._id.slice(-4)}
                        </Badge>
                      </div>

                      <Badge
                        className={`w-fit mb-2 rounded-lg px-2.5 py-0.5 text-xs font-bold ${getJobTypeColor(job.jobType)}`}
                      >
                        {job.jobType}
                      </Badge>

                      <CardTitle className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-green-700 transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="font-medium text-muted-foreground">
                        {job.department}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-4">
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1.5 rounded-md">
                          {job.location === "Remote" ? (
                            <Globe className="w-4 h-4 text-blue-500" />
                          ) : (
                            <MapPin className="w-4 h-4 text-red-500" />
                          )}
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1.5 rounded-md">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>{job.experience}</span>
                        </div>
                      </div>

                      {job.salaryRange && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-100">
                          <span>₹ {job.salaryRange}</span>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-2 pb-6 px-6 mt-auto">
                      <Button
                        className="w-full rounded-full bg-green-700 hover:bg-green-800 text-white font-bold h-11 shadow-md group-hover:shadow-lg transition-all"
                        onClick={() => handleViewDetails(job)}
                      >
                        View Details & Apply{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                No jobs found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 - VISUAL UPGRADE (ORBIT) */}
      <div className="py-24 bg-[#f0fdf4] overflow-hidden relative">
        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-200/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-green-300/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-green-400/50 rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10 text-center"
        >
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 border-none px-4 py-1.5 text-sm rounded-full">
            World-Class Talent
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Why hire from us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            Skilled, Trained, Project-Ready Talent. Our graduates are equipped
            with the latest industry skills.
          </p>

          {/* Orbit Visuals (Static Representation) */}
          <div className="relative h-[400px] max-w-4xl mx-auto flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-2xl z-20 animate-pulse-slow">
                <Building className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Orbiting Students */}
            <div className="absolute top-0 left-1/4 animate-float">
              <img
                src={student1}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
            <div
              className="absolute bottom-10 right-1/4 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <img
                src={student2}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
            <div
              className="absolute top-10 right-10 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <img
                src={student3}
                className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
            <div
              className="absolute bottom-0 left-10 animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <img
                src={student4}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <img
                src={student5}
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
            <div
              className="absolute top-1/2 right-0 -translate-y-1/2 animate-float"
              style={{ animationDelay: "2.5s" }}
            >
              <img
                src={student6}
                className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
                alt="Student"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
