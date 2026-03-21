import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from "@/components/Footer";
import { workshopService } from "@/service/workshop.service";
import { useAppSelector } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, ArrowLeft, X, Wifi, MapPin, DollarSign, Zap, FileText } from "lucide-react";
import toast from "react-hot-toast";

// Helper type for form data
interface FormData {
    title: string;
    description: string;
    date: string;
    time: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    type: 'Free' | 'Paid';
    price: string;
    whatYouWillLearn: string;
    whoShouldAttend: string;
    meetingLink: string;
    location: string;
    certification: string; // 'true' or 'false'
}

const CreateWorkshop = () => {
    const navigate = useNavigate();
    const { accessToken } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const initialFormData: FormData = {
        title: "",
        description: "",
        date: "",
        time: "",
        mode: "Online",
        type: "Free",
        price: "0",
        whatYouWillLearn: "",
        whoShouldAttend: "",
        meetingLink: "",
        location: "",
        certification: "false"
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // Memoize the thumbnail URL for preview
    const thumbnailUrl = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        let updatedFormData: Partial<FormData> = { [name]: value };

        // Logic for type change: Reset price if it changes to 'Free'
        if (name === 'type' && value === 'Free') {
            updatedFormData.price = "0";
        }
        
        // Logic for mode change: Clear irrelevant fields
        if (name === 'mode') {
            if (value === 'Online') {
                updatedFormData.location = "";
            } else if (value === 'Offline') {
                updatedFormData.meetingLink = "";
            }
        }

        setFormData(prev => ({ ...prev, ...updatedFormData }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleRemoveThumbnail = () => {
        // Revoke the blob URL to free up memory (good practice)
        if (thumbnailUrl) {
            URL.revokeObjectURL(thumbnailUrl);
        }
        setThumbnail(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!thumbnail) {
            toast.error("Please upload a thumbnail image.");
            return;
        }

        setLoading(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'whatYouWillLearn' || key === 'whoShouldAttend') {
                // Split by newlines, filter empty strings, and stringify the array
                const list = value.split('\n').map(item => item.trim()).filter(item => item !== '');
                data.append(key, JSON.stringify(list));
            } else {
                data.append(key, value);
            }
        });
        data.append("thumbnail", thumbnail);

        try {
            await workshopService.createWorkshop(data, accessToken);
            toast.success("Workshop created successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Failed to create workshop:", error);
            // Enhanced error message extraction
            const errorMessage = error.response?.data?.message || error.message || "Failed to create workshop.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-8 text-gray-600 hover:text-green-700">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <Card className="border-gray-100 shadow-xl rounded-xl">
                    <CardHeader className="bg-white border-b border-gray-100 p-6">
                        <CardTitle className="text-3xl font-extrabold text-gray-900 flex items-center">
                            <Zap className="w-6 h-6 mr-3 text-green-600" /> Create New Workshop
                        </CardTitle>
                        <CardDescription className="text-gray-500 mt-1">
                            Fill in the details below to schedule and publish your workshop.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section 1: Core Details */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-semibold text-gray-800">1. Basic Information</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Workshop Title</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Advanced React State Management" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Detailed overview of the workshop, target audience, and key benefits..." className="h-32" />
                                </div>
                            </div>

                            {/* Section 2: Scheduling and Format */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-semibold text-gray-800">2. Schedule and Format</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input id="time" name="time" type="text" value={formData.time} onChange={handleChange} required placeholder="e.g. 10:00 AM - 12:00 PM IST" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Mode</Label>
                                        <Select value={formData.mode} onValueChange={(val: 'Online' | 'Offline' | 'Hybrid') => handleSelectChange("mode", val)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Online"><Wifi className="w-4 h-4 mr-2 inline" /> Online</SelectItem>
                                                <SelectItem value="Offline"><MapPin className="w-4 h-4 mr-2 inline" /> Offline</SelectItem>
                                                <SelectItem value="Hybrid"><Zap className="w-4 h-4 mr-2 inline" /> Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={formData.type} onValueChange={(val: 'Free' | 'Paid') => handleSelectChange("type", val)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Free">Free</SelectItem>
                                                <SelectItem value="Paid"><DollarSign className="w-4 h-4 mr-2 inline" /> Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Conditional Fields for Mode and Type */}
                                {formData.type === 'Paid' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" placeholder="e.g. 999" />
                                    </div>
                                )}

                                {formData.mode === 'Online' || formData.mode === 'Hybrid' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="meetingLink">Meeting Link</Label>
                                        <Input id="meetingLink" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="Zoom/Google Meet/MS Teams URL" required={formData.mode === 'Online'} />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="Full address of the venue or city name" />
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Content and Requirements */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-semibold text-gray-800">3. Content Details</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="whatYouWillLearn">What Participants Will Learn <span className="text-gray-400">(One bullet point per line)</span></Label>
                                    <Textarea id="whatYouWillLearn" name="whatYouWillLearn" value={formData.whatYouWillLearn} onChange={handleChange} placeholder="e.g.:&#10;The fundamentals of component state&#10;Advanced custom hooks&#10;Optimizing rendering performance" className="h-28 font-mono" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whoShouldAttend">Who Should Attend <span className="text-gray-400">(One bullet point per line)</span></Label>
                                    <Textarea id="whoShouldAttend" name="whoShouldAttend" value={formData.whoShouldAttend} onChange={handleChange} placeholder="e.g.:&#10;Mid-level React Developers&#10;Coding Bootcamp Graduates" className="h-28 font-mono" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Certification Provided?</Label>
                                    <Select value={formData.certification} onValueChange={(val) => handleSelectChange("certification", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true"><FileText className="w-4 h-4 mr-2 inline" /> Yes, Certificate Included</SelectItem>
                                            <SelectItem value="false">No Certificate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Section 4: Thumbnail Upload */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">4. Thumbnail Image</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail">Upload Image (Max 2MB)</Label>
                                    
                                    {!thumbnail ? (
                                        // Upload UI
                                        <div className="border-2 border-dashed border-green-300 bg-green-50/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-colors">
                                            <Input id="thumbnail" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                            <Label htmlFor="thumbnail" className="cursor-pointer flex flex-col items-center text-center">
                                                <Upload className="w-10 h-10 text-green-600 mb-3" />
                                                <span className="font-medium text-green-800">Click to upload or drag & drop</span>
                                                <span className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG (Recommended: 16:9 aspect ratio)</span>
                                            </Label>
                                        </div>
                                    ) : (
                                        // Preview UI
                                        <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                                            <img src={thumbnailUrl!} alt="Thumbnail Preview" className="w-full h-48 object-cover" />
                                            
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
                                                <p className="text-white font-semibold truncate">{thumbnail.name}</p>
                                            </div>

                                            <Button 
                                                type="button" 
                                                onClick={handleRemoveThumbnail}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-3 right-3 rounded-full shadow-lg"
                                                title="Remove Image"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg" 
                                disabled={loading || !thumbnail}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> 
                                        Creating Workshop...
                                    </>
                                ) : (
                                    "Publish Workshop"
                                )}
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default CreateWorkshop;