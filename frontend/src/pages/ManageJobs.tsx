// import { useState, useEffect } from "react";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// import { getAllJobs, createJob, updateJob, deleteJob } from "@/service/job.service";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { Briefcase, Plus, Edit, Trash2, Search, Loader2, Building, MapPin, Users, Clock, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ManageJobs = () => {

//   const navigate = useNavigate();
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");


//   const fetchJobs = async () => {
//     try {
//       console.log("Fetching jobs...");
//       const response = await getAllJobs();
//       console.log("Jobs response:", response);
      
//       if (!response || !response.data) {
//         throw new Error("No jobs data received");
//       }
      
//       setJobs(response.data);
//       setFilteredJobs(response.data);
//     } catch (error: any) {
//       console.error("Failed to fetch jobs:", error);
//       toast.error(error?.response?.data?.message || "Failed to fetch jobs");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   useEffect(() => {
//     const filtered = jobs.filter(job => 
//       job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.jobType?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredJobs(filtered);
//   }, [searchTerm, jobs]);



//   const handleCreateJob = () => {
//    navigate("/create-job");
//   };

//   const handleEditJob = (job: any) => {
//     navigate(`/edit-job/${job._id}`);
//   };

//   const handleDeleteJob = async (jobId: string) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;
    
//     try {
//       await deleteJob(jobId);
//       toast.success("Job deleted successfully");
//       fetchJobs();
//     } catch (error) {
//       toast.error("Failed to delete job");
//     }
//   };



//   const getJobTypeColor = (jobType: string) => {
//     switch (jobType) {
//       case "Full-time": return "bg-green-100 text-green-800";
//       case "Part-time": return "bg-blue-100 text-blue-800";
//       case "Internship": return "bg-purple-100 text-purple-800";
//       case "Campus Ambassador": return "bg-orange-100 text-orange-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
//       <Navbar />
//       <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-foreground mb-2">Manage Jobs</h1>
//             <p className="text-lg text-muted-foreground">Create, edit, and manage job postings</p>
//           </div>
//           <Button onClick={handleCreateJob} className="bg-primary hover:bg-primary/90">
//             <Plus className="w-4 h-4 mr-2" />
//             Create Job
//           </Button>
//         </div>

//         {/* Search */}
//         <div className="mb-8">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
//             <Input
//               placeholder="Search jobs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 h-12"
//             />
//           </div>
//         </div>

//         {/* Jobs List */}
//         {isLoading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="w-8 h-8 text-primary animate-spin" />
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredJobs.map((job: any) => (
//               <Card key={job._id} className="bg-card/90 backdrop-blur-sm border-border/70 hover:shadow-lg transition-all">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between mb-2">
//                     <Badge className={`${getJobTypeColor(job.jobType)} font-medium`}>
//                       {job.jobType}
//                     </Badge>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleEditJob(job)}
//                         className="h-8 w-8 p-0"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteJob(job._id)}
//                         className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                   <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Building className="w-4 h-4" />
//                     <span>{job.department}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <MapPin className="w-4 h-4" />
//                     <span>{job.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Users className="w-4 h-4" />
//                     <span>{job.experience}</span>
//                   </div>
//                   <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
//                     {job.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };


// export default ManageJobs;





import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"; // Added Dialog imports

import { getAllJobs, createJob, updateJob, deleteJob } from "@/service/job.service";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Briefcase, Plus, Edit, Trash2, Search, Loader2, Building, MapPin, Users, Clock, X, TerminalSquare, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // State for Delete Confirmation Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDeleteId, setJobToDeleteId] = useState<string | null>(null);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await getAllJobs();
            
            if (!response || !response.data) {
                throw new Error("No jobs data received");
            }
            
            setJobs(response.data);
            setFilteredJobs(response.data);
        } catch (error: any) {
            console.error("Failed to fetch jobs:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch jobs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const filtered = jobs.filter(job => 
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobType?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered);
    }, [searchTerm, jobs]);

    const handleCreateJob = () => {
        navigate("/create-job");
    };

    const handleEditJob = (job: any) => {
        navigate(`/edit-job/${job._id}`);
    };

    const confirmDeleteJob = (jobId: string) => {
        setJobToDeleteId(jobId);
        setIsDeleteModalOpen(true);
    };

    const executeDeleteJob = async () => {
        if (!jobToDeleteId) return;

        setIsDeleteModalOpen(false); // Close modal immediately
        toast.loading("Deleting job...", { id: 'deleteToast' });
        
        try {
            await deleteJob(jobToDeleteId);
            toast.success("Job deleted successfully", { id: 'deleteToast' });
            fetchJobs(); // Refresh the list
        } catch (error) {
            toast.error("Failed to delete job", { id: 'deleteToast' });
        } finally {
            setJobToDeleteId(null);
        }
    };

    const getJobTypeColor = (jobType: string) => {
        // Using premium, primary-themed colors
        switch (jobType) {
            case "Full-time": return "bg-green-600/10 text-green-600 border border-green-600/30 font-semibold";
            case "Part-time": return "bg-blue-600/10 text-blue-600 border border-blue-600/30 font-semibold";
            case "Internship": return "bg-purple-600/10 text-purple-600 border border-purple-600/30 font-semibold";
            case "Campus Ambassador": return "bg-orange-600/10 text-orange-600 border border-orange-600/30 font-semibold";
            default: return "bg-gray-600/10 text-gray-600 border border-gray-600/30 font-semibold";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
                {/* Header and CTA */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <TerminalSquare className="w-10 h-10 text-primary" />
                        <div>
                            <h1 className="text-4xl font-extrabold text-foreground leading-tight">Job Dashboard</h1>
                            <p className="text-lg text-muted-foreground">Manage and track all open job postings.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <Button onClick={fetchJobs} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                             <RefreshCcw className="w-4 h-4 mr-2" />
                             Refresh
                         </Button>
                         <Button onClick={handleCreateJob} className="bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg">
                             <Plus className="w-5 h-5 mr-2" />
                             New Job Post
                         </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-12">
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                        <Input
                            placeholder="Search jobs by title, department, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 h-14 text-base bg-card border-primary/50 shadow-md focus-visible:ring-primary/70 rounded-xl"
                        />
                    </div>
                </div>

                {/* Jobs List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-lg text-muted-foreground">Loading job postings...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl shadow-lg border border-border/50">
                        <X className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No Jobs Found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchTerm ? `No positions match "${searchTerm}".` : "No job postings are currently available."}
                        </p>
                        <Button onClick={handleCreateJob} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Job
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job: any) => (
                            <Card key={job._id} className="bg-card shadow-xl border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={`px-3 py-1 text-xs ${getJobTypeColor(job.jobType)} rounded-full`}>
                                            {job.jobType}
                                        </Badge>
                                        <div className="text-xs text-muted-foreground font-mono">ID: {job._id.slice(-6)}</div>
                                    </div>
                                    <CardTitle className="text-xl font-extrabold group-hover:text-primary transition-colors line-clamp-2">
                                        {job.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <Building className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{job.experience}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mt-4">
                                        {job.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-4 flex gap-2">
                                    <Button
                                        size="default"
                                        variant="outline"
                                        onClick={() => navigate(`/edit-job/${job._id}`)}
                                        className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="default"
                                        variant="destructive"
                                        onClick={() => confirmDeleteJob(job._id)}
                                        className="w-1/3 bg-red-600 hover:bg-red-700 font-semibold shadow-md"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
            
            {/* --- Delete Confirmation Modal --- */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
                            <Trash2 className="w-6 h-6" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete this job posting? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="mt-4">
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={executeDeleteJob}
                            className="bg-red-600 hover:bg-red-700 font-semibold"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};


export default ManageJobs;