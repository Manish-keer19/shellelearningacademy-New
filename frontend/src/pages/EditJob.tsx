import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById, updateJob } from "@/service/job.service";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Clock, Users, FileText, Building, Loader2, Send, ArrowLeft, DollarSign } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(100, "Job title must be less than 100 characters"),
  department: z.string().min(2, "Department is required").max(50, "Department must be less than 50 characters"),
  jobType: z.string().min(1, "Job type is required"),
  location: z.string().min(1, "Work location is required"),
  city: z.string().min(2, "City is required").max(50, "City must be less than 50 characters"),
  experience: z.string().min(1, "Experience requirement is required").max(50, "Experience must be less than 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  salaryRange: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      jobType: "",
      location: "",
      city: "",
      experience: "",
      description: "",
      salaryRange: "",
    },
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const response = await getJobById(id);
        const job = response.data;
        form.reset({
          title: job.title,
          department: job.department,
          jobType: job.jobType,
          location: job.location,
          city: job.city || "",
          experience: job.experience,
          description: job.description,
          salaryRange: job.salaryRange || "",
        });
      } catch (error) {
        toast.error("Failed to fetch job details");
        navigate("/manage-jobs");
      } finally {
        setIsLoadingJob(false);
      }
    };
    fetchJob();
  }, [id, form, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateJob(id, data);
      toast.success("Job updated successfully!");
      navigate("/manage-jobs");
    } catch (error) {
      toast.error("Failed to update job");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/manage-jobs")}
            className="flex items-center gap-2 hover:bg-primary/10 border-primary/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Jobs
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Edit Job</h1>
          <p className="text-lg text-muted-foreground">Update job details and requirements</p>
        </div>
        
        {/* Form Card */}
        <Card className="bg-card shadow-2xl border-border/50">
          <CardHeader className="pb-4 border-b border-border/70">
            <CardTitle className="text-2xl font-bold text-center">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Job Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                        <Briefcase className="w-5 h-5" />
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Lead Product Designer" 
                          className="h-12 text-base" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grid for Department, Type, Location, Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                          <Building className="w-5 h-5" />
                          Department
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Engineering" 
                            className="h-12 text-base" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Job Type */}
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                          <Clock className="w-5 h-5" />
                          Job Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Campus Ambassador">Campus Ambassador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Work Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                          <MapPin className="w-5 h-5" />
                          Work Location
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="On-site">On-site</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City Location */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                          <Building className="w-5 h-5" />
                          City Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Mumbai, Delhi, Bangalore" 
                            className="h-12 text-base" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Experience Required */}
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                          <Users className="w-5 h-5" />
                          Experience Required
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 2-4 Years" 
                            className="h-12 text-base" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Salary Range */}
                <FormField
                  control={form.control}
                  name="salaryRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                        <DollarSign className="w-5 h-5" />
                        Salary Range (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. ₹5L - ₹8L P.A." 
                          className="h-12 text-base" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-primary">
                        <FileText className="w-5 h-5" />
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the role and responsibilities..." 
                          className="min-h-[120px] text-base resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-3" />
                    )}
                    {isLoading ? "Updating Job..." : "Update Job"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default EditJob;