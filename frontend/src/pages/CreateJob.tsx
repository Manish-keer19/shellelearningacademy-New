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
import { createJob } from "@/service/job.service";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Briefcase, MapPin, Clock, Users, FileText, Building, Loader2, Send, Plus, X, Mail } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(100, "Job title must be less than 100 characters"),
  department: z.string().min(2, "Department is required").max(50, "Department must be less than 50 characters"),
  jobType: z.string().min(1, "Job type is required"),
  location: z.string().min(1, "Work location is required"),
  city: z.string().min(2, "City is required").max(50, "City must be less than 50 characters"),
  experience: z.string().min(1, "Experience requirement is required").max(50, "Experience must be less than 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  salaryRange: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  emailText: z.string().min(10, "Email instructions must be at least 10 characters").max(500, "Email instructions must be less than 500 characters"),
});

type FormData = z.infer<typeof formSchema>;

const CreateJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  
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
      email: "careers@shellelearningacademy.com",
      emailText: "Please send your resume and cover letter to apply for this position.",
    },
  });

  const addItem = (type: 'responsibilities' | 'requirements' | 'benefits') => {
    if (type === 'responsibilities') {
      setResponsibilities([...responsibilities, ""]);
    } else if (type === 'requirements') {
      setRequirements([...requirements, ""]);
    } else if (type === 'benefits') {
      setBenefits([...benefits, ""]);
    }
  };

  const removeItem = (type: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
    if (type === 'responsibilities') {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    } else if (type === 'requirements') {
      setRequirements(requirements.filter((_, i) => i !== index));
    } else if (type === 'benefits') {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  const updateItem = (type: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) => {
    // Validate input length
    if (value.length > 200) {
      toast.error(`${type.slice(0, -1)} must be less than 200 characters`);
      return;
    }
    
    if (type === 'responsibilities') {
      const updated = [...responsibilities];
      updated[index] = value;
      setResponsibilities(updated);
    } else if (type === 'requirements') {
      const updated = [...requirements];
      updated[index] = value;
      setRequirements(updated);
    } else if (type === 'benefits') {
      const updated = [...benefits];
      updated[index] = value;
      setBenefits(updated);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate structured data
    const filteredResponsibilities = responsibilities.filter(item => item.trim() !== "");
    const filteredRequirements = requirements.filter(item => item.trim() !== "");
    const filteredBenefits = benefits.filter(item => item.trim() !== "");
    
    if (filteredResponsibilities.length === 0) {
      toast.error("Please add at least one responsibility");
      return;
    }
    
    if (filteredRequirements.length === 0) {
      toast.error("Please add at least one requirement");
      return;
    }
    setIsLoading(true);
    try {
      const jobData = {
        ...data,
        responsibilities: filteredResponsibilities,
        requirements: filteredRequirements,
        benefits: filteredBenefits,
      };
      await createJob(jobData); 
      toast.success("Job created successfully! It is now live on the careers page.");
      form.reset();
      setResponsibilities([""]);
      setRequirements([""]);
      setBenefits([""]);
    } catch (error) {
      console.error("Creation Error:", error);
      toast.error("Failed to create job. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        {/* Header Section: Best UI/UX */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Post a New Job</h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Accurately fill out the details to create a professional and appealing job opening.
          </p>
        </div>
        
        {/* Form Card: Premium UI */}
        <Card className="bg-card shadow-2xl border-border/50">
          <CardHeader className="pb-4 border-b border-border/70">
            <CardTitle className="text-2xl font-bold text-center">Job Publication Form</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
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
                          placeholder="e.g., Lead Product Designer, Data Scientist" 
                          className="h-12 text-base shadow-sm focus-visible:ring-primary/50" 
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
                            placeholder="e.g., Engineering, Finance, HR" 
                            className="h-12 text-base shadow-sm focus-visible:ring-primary/50" 
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base shadow-sm">
                              <SelectValue placeholder="Select working arrangement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Campus Ambassador">Campus Ambassador</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base shadow-sm">
                              <SelectValue placeholder="Select physical presence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Remote">Remote 🏠</SelectItem>
                            <SelectItem value="On-site">On-site 🏢</SelectItem>
                            <SelectItem value="Hybrid">Hybrid 🔄</SelectItem>
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
                            className="h-12 text-base shadow-sm focus-visible:ring-primary/50" 
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
                            placeholder="e.g. 2-4 Years, Entry Level, 5+ Years" 
                            className="h-12 text-base shadow-sm focus-visible:ring-primary/50" 
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
                        <Building className="w-5 h-5" />
                        Salary Range (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. ₹5L - ₹8L P.A., $50k - $70k" 
                          className="h-12 text-base shadow-sm focus-visible:ring-primary/50" 
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
                          placeholder="Provide a brief overview of the role and company..." 
                          className="min-h-[120px] text-base resize-y shadow-sm focus-visible:ring-primary/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Responsibilities */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-base font-semibold text-primary">
                    <Users className="w-5 h-5" />
                    Key Responsibilities
                  </label>
                  {responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Develop and maintain web applications"
                        value={responsibility}
                        onChange={(e) => updateItem('responsibilities', index, e.target.value)}
                        className="flex-1 h-12 text-base shadow-sm focus-visible:ring-primary/50"
                      />
                      {responsibilities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem('responsibilities', index)}
                          className="h-12 w-12 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('responsibilities')}
                    className="w-full h-10 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Responsibility
                  </Button>
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-base font-semibold text-primary">
                    <FileText className="w-5 h-5" />
                    Requirements & Qualifications
                  </label>
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Bachelor's degree in Computer Science"
                        value={requirement}
                        onChange={(e) => updateItem('requirements', index, e.target.value)}
                        className="flex-1 h-12 text-base shadow-sm focus-visible:ring-primary/50"
                      />
                      {requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem('requirements', index)}
                          className="h-12 w-12 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('requirements')}
                    className="w-full h-10 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-base font-semibold text-primary">
                    <Building className="w-5 h-5" />
                    Benefits & Perks
                  </label>
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Health insurance and flexible working hours"
                        value={benefit}
                        onChange={(e) => updateItem('benefits', index, e.target.value)}
                        className="flex-1 h-12 text-base shadow-sm focus-visible:ring-primary/50"
                      />
                      {benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem('benefits', index)}
                          className="h-12 w-12 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItem('benefits')}
                    className="w-full h-10 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>

                
                
                {/* Submission Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-3" />
                    )}
                    {isLoading ? "Publishing Job..." : "Publish Job Posting"}
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

export default CreateJob;