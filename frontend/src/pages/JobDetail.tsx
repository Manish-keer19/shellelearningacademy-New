import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Briefcase,
  MapPin,
  Users,
  Building,
  Loader2,
  Mail,
  Send,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  ArrowLeft,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Import Assets
import heroImage from "@/assets/hero_career.png"; // Reuse hero image for blurred background

// --- Constants ---
const CAREERS_EMAIL = "hr@shellelearningacademy.com";

// --- Interfaces ---
interface JobData {
  _id: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  experience: string;
  description: string;
  salaryRange?: string;
  postedDate?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  city?: string;
}

interface ApplicationForm {
  fullName: string;
  email: string;
  mobileNumber: string;
  positionApplyingFor: string;
  experienceYears: string;
  currentLocation: string;
  resumeFile?: File | null;
  coverLetter?: string;
}

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobData | null>(location.state?.job || null);

  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [formState, setFormState] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    mobileNumber: "",
    positionApplyingFor: job?.title || "",
    experienceYears: "",
    currentLocation: "",
    resumeFile: null,
  });

  // --- Set form data when job is available ---
  useEffect(() => {
    if (job) {
      setFormState(prev => ({ ...prev, positionApplyingFor: job.title }));
    }
  }, [job]);

  // --- UI Helpers ---
  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case "Full-time": return "bg-green-100 text-green-700 border border-green-200";
      case "Part-time": return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Internship": return "bg-purple-100 text-purple-700 border border-purple-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // --- Form Handlers ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState(prev => ({ ...prev, resumeFile: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    // Simple validation
    if (!formState.fullName || !formState.email || !formState.resumeFile) {
      alert("Please fill in required fields and upload your resume.");
      setIsApplying(false);
      return;
    }

    // --- **PROD/API IMPLEMENTATION HERE** ---
    console.log("Submitting Application for:", job?.title, " via Form");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Assuming success
    alert(`Application for ${job?.title} submitted successfully! We will contact you soon.`);
    setIsApplying(false);
    setFormState({ // Reset form
      fullName: "", email: "", mobileNumber: "", positionApplyingFor: job?.title || "",
      experienceYears: "", currentLocation: "", resumeFile: null, coverLetter: ""
    });
  };

  const handleEmailApply = () => {
    if (!job) return;
    const subject = `Application for ${job.title} Position (Job ID: ${job._id.slice(-6)})`;
    const body = `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${job.title} position advertised on your website. Please find my attached resume and cover letter.\n\nThank you for your time.\n\nSincerely,`;
    window.location.href = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground mt-2">The specified job ID could not be located.</p>
          <Button onClick={() => navigate('/careers')} className="mt-6">Back to Careers</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Header with Blurred Background */}
      <div className="relative pt-32 pb-16 overflow-hidden bg-green-50">
        <div className="absolute inset-0 z-0 opacity-10 blur-3xl">
          <img src={heroImage} alt="Background" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 hover:bg-white/50 text-muted-foreground hover:text-green-700 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`px-3 py-1 text-sm font-semibold rounded-full ${getJobTypeColor(job.jobType)}`}>
                  {job.jobType}
                </Badge>
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                  <Building className="w-4 h-4" /> {job.department}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {job.location}{job.city && ` • ${job.city}`}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  {job.experience} Required
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-2 font-semibold text-green-700">
                    <DollarSign className="w-5 h-5" />
                    {job.salaryRange}
                  </div>
                )}
                {job.postedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Posted {job.postedDate}
                  </div>
                )}
              </div>
            </div>

            {/* Share Button (Optional) */}
            {/* <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-green-200 text-green-700 hover:bg-green-50">
              <Share2 className="w-5 h-5" />
            </Button> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview */}
            <Card className="shadow-sm border-green-100 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Job Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg text-foreground/80 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="shadow-sm border-green-100 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-green-600" />
                    Key Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {job.responsibilities.map((responsibility: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 text-foreground/80">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-base leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements & Qualifications */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="shadow-sm border-green-100 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Requirements & Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {job.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 text-foreground/80">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0" />
                        <span className="text-base leading-relaxed">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits & Perks */}
            {job.benefits && job.benefits.length > 0 && (
              <Card className="shadow-sm border-green-100 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Benefits & Perks
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {job.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-foreground/90">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Apply Card */}
              <Card className="shadow-xl border-green-200 bg-white rounded-2xl overflow-hidden ring-4 ring-green-50">
                <div className="h-2 bg-gradient-to-r from-green-600 to-green-400" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-center">Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                    <p className="text-sm text-green-800 font-medium mb-2">Send your resume to:</p>
                    <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-green-700 bg-white py-2 px-3 rounded-lg border border-green-200 shadow-sm">
                      <Mail className="w-4 h-4" /> {CAREERS_EMAIL}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    {/* <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or apply directly</span>
                    </div> */}
                  </div>

                  {/* <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formState.fullName} onChange={handleFormChange} required className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={formState.email} onChange={handleFormChange} required className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resumeFile">Upload Resume</Label>
                      <Input id="resumeFile" name="resumeFile" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" required className="bg-gray-50 border-gray-200 focus:bg-white transition-colors file:text-green-700 file:font-semibold" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-green-700 hover:bg-green-800 font-bold shadow-lg shadow-green-200 rounded-xl"
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isApplying ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form> */}
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">Need Help?</h4>
                    <p className="text-sm text-blue-700/80 mt-1">
                      If you have any questions about the role or application process, feel free to contact us.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetailPage;