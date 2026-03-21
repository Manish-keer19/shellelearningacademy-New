import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, X, Image, Tag, FileText, Edit, Send, Loader2, CheckCircle, ArrowRight, ArrowLeft, File } from "lucide-react";
import toast from "react-hot-toast";
import { courseService } from '@/service/course.service';
import { useAppSelector } from '@/hooks/redux';
import { Navbar } from '@/components/Navbar';

const CreateCourse = () => {
    const navigate = useNavigate();
    const token = useAppSelector((state) => state.auth.accessToken);
    const [currentStage, setCurrentStage] = useState(1);
    const [createdCourseId, setCreatedCourseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null); // { sectionIndex, subIndex }
    const [sectionForms, setSectionForms] = useState({});
    
    // Stage 1: Course Data
    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
        whatYouWillLearn: '',
        originalPrice: '',
        discountedPrice: '',
        thumbnail: null,
        thumbnailImage: '',
        tag: [],
        category: '',
        status: 'Draft',
        instructions: [],
        courseLevel: '',
        courseDuration: '',
        courseOverview: '',
        brochure: null,
    });
    // Stage 2: Sections and Subsections
    const [sections, setSections] = useState([]);
    const [currentSectionName, setCurrentSectionName] = useState('');
    // Stage 3: Final Status
    const [finalStatus, setFinalStatus] = useState('Draft');
    // Helper states
    const [currentTag, setCurrentTag] = useState('');
    const [currentInstruction, setCurrentInstruction] = useState('');
    const initialForm = { title: '' };

    // --- Dynamic Class/Style Helpers ---
    const INPUT_CLASS = "border-border focus-visible:ring-primary focus-visible:border-primary";
    const LABEL_CLASS = "text-sm font-semibold text-foreground";
    const REQUIRED_STAR = <span className="text-destructive">*</span>;

    // Fetch categories
    const fetchCategories = async () => {
        if (!token) {
            return;
        }

        try {
            const res = await courseService.getAllCategories();
            setCategories(res.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Failed to load categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    // Stage 1 Handlers (Unchanged logic, minor toast/error refinement)
    const handleCourseInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCourseData(prev => ({ ...prev, thumbnail: file, thumbnailImage: previewUrl }));
        }
    };

    const handleBrochureChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCourseData(prev => ({ ...prev, brochure: file }));
        } else {
            toast.error('Please select a valid PDF file.');
        }
    };

    const addTag = () => {
        if (currentTag.trim() && !courseData.tag.includes(currentTag.trim()) && courseData.tag.length < 10) {
            setCourseData(prev => ({ ...prev, tag: [...prev.tag, currentTag.trim()] }));
            setCurrentTag('');
        } else if (courseData.tag.length >= 10) {
            toast.error("Maximum 10 tags allowed.");
        }
    };

    const removeTag = (index) => {
        setCourseData(prev => ({
            ...prev,
            tag: prev.tag.filter((_, i) => i !== index)
        }));
    };

    const addInstruction = () => {
        if (currentInstruction.trim()) {
            setCourseData(prev => ({ ...prev, instructions: [...prev.instructions, currentInstruction.trim()] }));
            setCurrentInstruction('');
        }
    };

    const removeInstruction = (index) => {
        setCourseData(prev => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index)
        }));
    };

    // Stage 1: Create Course
    const handleStage1Submit = async () => {
        if (
            !courseData.courseName || !courseData.courseDescription || !courseData.whatYouWillLearn ||
            !courseData.originalPrice || !courseData.category || !courseData.courseLevel ||
            !courseData.courseDuration || !courseData.thumbnail || !courseData.brochure ||
            courseData.tag.length === 0
        ) {
            toast.error("Please fill all fields marked with a star (*), including thumbnail and brochure.");
            return;
        }
        try {
            setIsLoading(true);
            
            const formData = new FormData();
            formData.append('courseName', courseData.courseName);
            formData.append('courseDescription', courseData.courseDescription);
            formData.append('whatYouWillLearn', courseData.whatYouWillLearn);
            formData.append('originalPrice', courseData.originalPrice);
            formData.append('discountedPrice', courseData.discountedPrice || courseData.originalPrice);
            formData.append('tag', JSON.stringify(courseData.tag));
            formData.append('category', courseData.category);
            formData.append('status', courseData.status);
            formData.append('instructions', JSON.stringify(courseData.instructions));
            formData.append('courseLevel', courseData.courseLevel);
            formData.append('courseDuration', courseData.courseDuration);
            formData.append('courseOverview', courseData.courseOverview);
            
            if (courseData.thumbnail) { formData.append('thumbnailImage', courseData.thumbnail); }
            if (courseData.brochure) { formData.append('brochurePdf', courseData.brochure); }
            
            const courseRes = await courseService.createCourse(formData, token);
            setCreatedCourseId(courseRes.data._id);
            
            toast.success("Course Created Successfully! Let's add your content.");
            
            setCurrentStage(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setIsLoading(false);
        }
    };

    // Stage 2 Handlers (Unchanged logic)
    const addSection = () => {
        if (currentSectionName.trim()) {
            setSections(prev => [...prev, {
                sectionName: currentSectionName.trim(),
                subSections: [],
                isCreated: false,
                sectionId: null
            }]);
            setCurrentSectionName('');
        }
    };

    const removeSection = (index) => {
        setSections(prev => prev.filter((_, i) => i !== index));
        if (sectionForms[index]) {
            setSectionForms(prevForms => {
                const newForms = { ...prevForms };
                delete newForms[index];
                return newForms;
            });
        }
        if (editing?.sectionIndex === index) setEditing(null);
    };

    const updateFormField = useCallback((sectionIdx, field, value) => {
        setSectionForms(prev => ({
            ...prev,
            [sectionIdx]: {
                ...(prev[sectionIdx] || initialForm),
                [field]: value
            }
        }));
    }, []);

    const handleAddOrUpdate = useCallback((sectionIndex) => {
        const form = sectionForms[sectionIndex] || initialForm;
        if (!form.title.trim()) {
            toast.error("Lesson title is required.");
            return;
        }
        setSections(prev => prev.map((section, idx) => {
            if (idx !== sectionIndex) return section;
            let newSubSections;
            if (editing && editing.sectionIndex === sectionIndex && editing.subIndex !== undefined) {
                newSubSections = [...section.subSections];
                newSubSections[editing.subIndex] = { title: form.title };
                setEditing(null);
            } else {
                newSubSections = [...section.subSections, { title: form.title }];
            }
            setSectionForms(prevForms => {
                const newForms = { ...prevForms };
                delete newForms[sectionIndex];
                return newForms;
            });
            return { ...section, subSections: newSubSections };
        }));
    }, [editing, sectionForms]);

    const handleEditSubSection = useCallback((sectionIndex, subIndex) => {
        const section = sections[sectionIndex];
        if (!section) return;
        const subData = section.subSections[subIndex];
        if (!subData) return;
        setSectionForms(prev => ({
            ...prev,
            [sectionIndex]: { ...subData }
        }));
        setEditing({ sectionIndex, subIndex });
    }, [sections]);

    const handleCancelEdit = useCallback((sectionIndex) => {
        setSectionForms(prev => {
            const newForms = { ...prev };
            delete newForms[sectionIndex];
            return newForms;
        });
        setEditing(null);
    }, []);

    const removeSubSection = useCallback((sectionIndex, subIndex) => {
        setSections(prev => prev.map((section, idx) => {
            if (idx !== sectionIndex) return section;
            return {
                ...section,
                subSections: section.subSections.filter((_, i) => i !== subIndex)
            };
        }));
        if (editing?.sectionIndex === sectionIndex && editing?.subIndex === subIndex) {
            setEditing(null);
        }
    }, [editing]);

    // Stage 2: Create Sections and Subsections
    const handleStage2Submit = async () => {
        if (sections.length === 0) {
            toast.error("Please add at least one section with at least one lesson.");
            return;
        }
        const totalLessonsCheck = sections.reduce((total, section) => total + section.subSections.length, 0);
        if (totalLessonsCheck === 0) {
            toast.error("Please ensure every section has at least one lesson.");
            return;
        }

        try {
            setIsLoading(true);
            
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                
                // 1. Create Section
                const sectionRes = await courseService.createSection({
                    sectionName: section.sectionName,
                    courseId: createdCourseId
                }, token);
                
                // Extract the newly created section ID (logic based on expected API response)
                const sectionId = sectionRes.updatedCourse.courseContent[sectionRes.updatedCourse.courseContent.length - 1]._id;
                
                setSections(prev => prev.map((s, idx) =>
                    idx === i ? { ...s, isCreated: true, sectionId } : s
                ));
                
                // 2. Create Subsections (Lessons)
                for (const subSection of section.subSections) {
                    if (subSection.title.trim()) {
                        const subSectionData = new FormData();
                        subSectionData.append('sectionId', sectionId);
                        subSectionData.append('title', subSection.title);
                        subSectionData.append('description', 'Content TBD'); // Assuming a default description
                        subSectionData.append('courseId', createdCourseId);
                        
                        await courseService.createSubSection(subSectionData, token);
                    }
                }
            }
            
            toast.success("Sections & Lessons Created! Proceed to publishing status.");
            
            setCurrentStage(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create content structure.");
        } finally {
            setIsLoading(false);
        }
    };

    // Stage 3: Publish/Draft Course
    const handleStage3Submit = async () => {
        const totalLessons = sections.reduce((total, section) => total + section.subSections.length, 0);
        
        if (finalStatus === 'Published' && (sections.length === 0 || totalLessons === 0)) {
            toast.error("To publish a course, you must add at least one section with at least one lesson.");
            return;
        }
        try {
            setIsLoading(true);
            
            const formData = new FormData();
            formData.append('courseId', createdCourseId);
            formData.append('status', finalStatus);
            
            await courseService.editCourse(formData, token);
            
            toast.success(`Course has been ${finalStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
            
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update course status");
        } finally {
            setIsLoading(false);
        }
    };

    const getStageProgress = () => {
        return (currentStage / 3) * 100;
    };

    const totalLessons = sections.reduce((total, section) => total + section.subSections.length, 0);

    const handlePublishClick = () => {
        if (sections.length === 0 || totalLessons === 0) {
            toast.error("Add at least one section with lessons before publishing.");
            return;
        }
        setFinalStatus('Published');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-foreground">
            <Navbar />
            
            {/* Sticky Progress Header */}
            <div className="border-b border-border bg-card/90 backdrop-blur-lg sticky top-0 z-20 shadow-md pt-20">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="text-sm font-semibold">
                            Stage {currentStage} of 3
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className={currentStage >= 1 ? "text-primary" : "text-muted-foreground"}>
                                1. Course Info
                            </span>
                            <span className={currentStage >= 2 ? "text-primary" : "text-muted-foreground"}>
                                2. Add Content
                            </span>
                            <span className={currentStage >= 3 ? "text-primary" : "text-muted-foreground"}>
                                3. Finalize
                            </span>
                        </div>
                        <Progress value={getStageProgress()} className="h-2 bg-muted" />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Stage 1: Course Creation */}
                    {currentStage === 1 && (
                        <Card className="bg-card/90 backdrop-blur-lg border-border/70 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-extrabold text-foreground">
                                    <span className="text-primary">Stage 1:</span> Course Details
                                </CardTitle>
                                <p className="text-muted-foreground">Set up the core information for your course</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               
                                {/* Basic Info */}
                                <div className="space-y-2">
                                    <Label htmlFor="courseName" className={LABEL_CLASS}>Course Name {REQUIRED_STAR}</Label>
                                    <Input id="courseName" name="courseName" value={courseData.courseName} onChange={handleCourseInputChange} placeholder="e.g., Python Bootcamp for Beginners" className={INPUT_CLASS} />
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="originalPrice" className={LABEL_CLASS}>Original Price (₹) {REQUIRED_STAR}</Label>
                                        <Input id="originalPrice" name="originalPrice" type="number" value={courseData.originalPrice} onChange={handleCourseInputChange} placeholder="1499" className={INPUT_CLASS} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountedPrice" className={LABEL_CLASS}>Discounted Price (₹)</Label>
                                        <Input id="discountedPrice" name="discountedPrice" type="number" value={courseData.discountedPrice} onChange={handleCourseInputChange} placeholder="999" className={INPUT_CLASS} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseDescription" className={LABEL_CLASS}>Short Tagline/Description {REQUIRED_STAR}</Label>
                                    <Textarea id="courseDescription" name="courseDescription" value={courseData.courseDescription} onChange={handleCourseInputChange} placeholder="A brief, compelling description (max 3 lines)" className={INPUT_CLASS} rows={2} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatYouWillLearn" className={LABEL_CLASS}>What You Will Learn (Key Takeaways) {REQUIRED_STAR}</Label>
                                    <Textarea id="whatYouWillLearn" name="whatYouWillLearn" value={courseData.whatYouWillLearn} onChange={handleCourseInputChange} placeholder="List key points, separated by line breaks." className={INPUT_CLASS} rows={4} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="courseLevel" className={LABEL_CLASS}>Course Level {REQUIRED_STAR}</Label>
                                        <Select value={courseData.courseLevel} onValueChange={(value) => setCourseData(prev => ({ ...prev, courseLevel: value }))}>
                                            <SelectTrigger className={INPUT_CLASS}>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                                <SelectItem value="All Levels">All Levels</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="courseDuration" className={LABEL_CLASS}>Course Duration (e.g., 10 hours) {REQUIRED_STAR}</Label>
                                        <Input id="courseDuration" name="courseDuration" value={courseData.courseDuration} onChange={handleCourseInputChange} placeholder="e.g., 10 hours" className={INPUT_CLASS} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseOverview" className={LABEL_CLASS}>Full Course Overview</Label>
                                    <Textarea id="courseOverview" name="courseOverview" value={courseData.courseOverview} onChange={handleCourseInputChange} placeholder="Provide a detailed course overview..." className={INPUT_CLASS} rows={3} />
                                </div>
                                
                                {/* Category and Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className={LABEL_CLASS}>Category {REQUIRED_STAR}</Label>
                                    <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                                        <SelectTrigger className={INPUT_CLASS}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className={LABEL_CLASS}>Tags (Min 1 Tag) {REQUIRED_STAR}</Label>
                                    <div className="flex space-x-2">
                                        <Input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag (e.g., SEO, Figma)" className={INPUT_CLASS} />
                                        <Button type="button" size="sm" onClick={addTag} className="bg-primary hover:bg-primary/90">
                                            <Tag className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {courseData.tag.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center space-x-1 bg-primary/10 text-primary border-primary/50 font-medium">
                                                {tag}
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeTag(index)} className="h-4 w-4 p-0 text-primary hover:bg-primary/20">
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {/* Instructions */}
                                <div className="space-y-2">
                                    <Label className={LABEL_CLASS}>Instructions / Requirements</Label>
                                    <div className="flex space-x-2">
                                        <Input value={currentInstruction} onChange={(e) => setCurrentInstruction(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInstruction())} placeholder="e.g., Figma software needed" className={INPUT_CLASS} />
                                        <Button type="button" size="sm" onClick={addInstruction} variant="outline" className="text-primary border-primary hover:bg-primary/10">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {courseData.instructions.map((inst, index) => (
                                            <Badge key={index} variant="outline" className="flex items-center space-x-1 text-muted-foreground border-muted-foreground/50">
                                                {inst}
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeInstruction(index)} className="h-4 w-4 p-0 hover:bg-muted">
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Thumbnail & Brochure Uploads */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Thumbnail */}
                                    <div className="space-y-2">
                                        <Label className={LABEL_CLASS}>Thumbnail Image {REQUIRED_STAR}</Label>
                                        {!courseData.thumbnailImage ? (
                                            <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                <div className="space-y-2 pointer-events-none">
                                                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center transition-colors">
                                                        <Image className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">Click to upload thumbnail</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group shadow-md">
                                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-primary/50">
                                                    <img src={courseData.thumbnailImage} alt="Course Thumbnail" className="w-full h-full object-cover" />
                                                </div>
                                                <Button type="button" size="sm" variant="destructive" onClick={() => { if (courseData.thumbnailImage) URL.revokeObjectURL(courseData.thumbnailImage); setCourseData(prev => ({ ...prev, thumbnail: null, thumbnailImage: '' })); }} className="absolute top-2 right-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Brochure PDF */}
                                    <div className="space-y-2">
                                        <Label className={LABEL_CLASS}>Brochure PDF {REQUIRED_STAR}</Label>
                                        {!courseData.brochure ? (
                                            <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                                                <input type="file" accept="application/pdf" onChange={handleBrochureChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                <div className="space-y-2 pointer-events-none">
                                                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center transition-colors">
                                                        <File className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">Click to upload brochure PDF</p>
                                                    <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group p-4 border border-primary/50 rounded-xl bg-primary/10 shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-5 h-5 text-primary" />
                                                        <span className="text-sm font-medium text-foreground line-clamp-1">{courseData.brochure.name}</span>
                                                    </div>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => setCourseData(prev => ({ ...prev, brochure: null }))} className="p-2 h-8 w-8">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={handleStage1Submit}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/30"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Course...</>
                                    ) : (
                                        <>Create Course & Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    {/* Stage 2: Sections and Subsections */}
                    {currentStage === 2 && (
                        <Card className="bg-card/90 backdrop-blur-lg border-border/70 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-extrabold text-foreground">
                                    <span className="text-primary">Stage 2:</span> Add Course Content
                                </CardTitle>
                                <p className="text-muted-foreground">Structure your content into sections and lessons below</p>
                                <div className="flex items-center justify-center space-x-2 mt-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-sm text-primary font-medium">Course "{courseData.courseName}" created successfully</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               
                                {/* Add Section */}
                                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                                    <Label className={LABEL_CLASS + " mb-3 block"}>Add New Section</Label>
                                    <div className="flex space-x-2">
                                        <Input value={currentSectionName} onChange={(e) => setCurrentSectionName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())} placeholder="Enter section name (e.g., Module 1: SEO Basics)" className="flex-1" />
                                        <Button type="button" variant="default" onClick={addSection} disabled={!currentSectionName.trim()} className="bg-primary hover:bg-primary/90">
                                            <Plus className="w-4 h-4 mr-1" /> Section
                                        </Button>
                                    </div>
                                </div>
                                {/* Sections List */}
                                <div className="space-y-6">
                                    {sections.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground border border-border rounded-xl">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <h3 className="text-lg font-medium mb-2">No sections created yet</h3>
                                            <p className="text-sm">Start by adding your first section above.</p>
                                        </div>
                                    )}
                                    
                                    {sections.map((section, sectionIndex) => {
                                        const form = sectionForms[sectionIndex] || initialForm;
                                        const isEditingThis = editing && editing.sectionIndex === sectionIndex;
                                        return (
                                            <Card key={sectionIndex} className="bg-card border-border/70 shadow-md">
                                                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3 p-4 sm:p-6 bg-muted/20 rounded-t-xl border-b border-border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-sm font-bold text-primary">{sectionIndex + 1}</span>
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-lg text-foreground">{section.sectionName}</CardTitle>
                                                            <p className="text-sm text-muted-foreground font-medium">
                                                                {section.subSections.length} lesson{section.subSections.length !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(sectionIndex)} className="text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </CardHeader>
                                                <CardContent className="space-y-4 p-4 sm:p-6">
                                                    
                                                    {/* Add/Edit Subsection Form */}
                                                    <div className="space-y-3 p-4 border border-primary/30 rounded-lg bg-primary/5">
                                                        <Label className="text-sm font-medium mb-1 block">
                                                            {isEditingThis ? `Editing Lesson ${editing.subIndex + 1} Title` : 'Add New Lesson Title'}
                                                        </Label>
                                                        <Input
                                                            placeholder="Lesson Title (e.g., Setting up your environment)"
                                                            value={form.title}
                                                            onChange={(e) => updateFormField(sectionIndex, 'title', e.target.value)}
                                                            className={INPUT_CLASS}
                                                        />
                                                        <div className="flex gap-2 pt-1">
                                                            <Button type="button" size="sm" onClick={() => handleAddOrUpdate(sectionIndex)} className="flex-1 bg-primary hover:bg-primary/90" disabled={!form.title.trim()}>
                                                                {isEditingThis ? (<><Edit className="w-4 h-4 mr-2" />Update Lesson</>) : (<><Plus className="w-4 h-4 mr-2" />Add Lesson</>)}
                                                            </Button>
                                                            {isEditingThis && (
                                                                <Button type="button" variant="outline" size="sm" onClick={() => handleCancelEdit(sectionIndex)} className="text-destructive border-destructive hover:bg-destructive/10">
                                                                    Cancel Edit
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Subsections List */}
                                                    <div className="space-y-2 pt-2">
                                                        <Label className={LABEL_CLASS}>Lessons in this Section ({section.subSections.length})</Label>
                                                        {section.subSections.map((sub, subIndex) => (
                                                            <div key={subIndex} className="p-3 border border-border/70 rounded-lg bg-card shadow-sm">
                                                                <div className="flex justify-between items-center gap-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                                        <h4 className="font-medium text-foreground">{sub.title}</h4>
                                                                    </div>
                                                                    <div className="flex gap-2 flex-shrink-0">
                                                                        <Button type="button" variant="outline" size="sm" onClick={() => handleEditSubSection(sectionIndex, subIndex)}>
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeSubSection(sectionIndex, subIndex)}>
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {section.subSections.length === 0 && <p className="text-sm text-muted-foreground italic pl-3">No lessons added yet.</p>}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <Button onClick={() => setCurrentStage(1)} className="flex-1 h-11" variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course Info
                                    </Button>
                                    <Button onClick={handleStage2Submit} className="flex-1 h-11 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg" disabled={isLoading || sections.length === 0 || totalLessons === 0}>
                                        {isLoading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Content...</>
                                        ) : (
                                            <>Finalize Content <ArrowRight className="w-4 h-4 ml-2" /></>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* Stage 3: Publish/Draft */}
                    {currentStage === 3 && (
                        <Card className="bg-card/90 backdrop-blur-lg border-border/70 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-extrabold text-foreground">
                                    <span className="text-primary">Stage 3:</span> Publish Course
                                </CardTitle>
                                <p className="text-muted-foreground">Your course content is ready! Choose final status.</p>
                                <div className="flex flex-col items-center space-y-2 mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="flex items-center space-x-2 text-primary font-medium">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Content Structure Complete: {sections.length} sections, {totalLessons} lessons.</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                               
                                {/* Course Summary */}
                                <Card className="bg-muted/30 border-border/70">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-primary">{courseData.courseName}</CardTitle>
                                        <CardDescription>{courseData.courseDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-card/50 rounded-lg shadow-inner">
                                            <div className="text-2xl font-bold text-foreground">{sections.length}</div>
                                            <div className="text-sm text-muted-foreground">Sections</div>
                                        </div>
                                        <div className="p-3 bg-card/50 rounded-lg shadow-inner">
                                            <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                                            <div className="text-sm text-muted-foreground">Lessons</div>
                                        </div>
                                        <div className="p-3 bg-card/50 rounded-lg shadow-inner">
                                            <div className="text-2xl font-bold text-foreground">₹{courseData.discountedPrice || courseData.originalPrice}</div>
                                            <div className="text-sm text-muted-foreground">Final Price</div>
                                        </div>
                                        <div className="p-3 bg-card/50 rounded-lg shadow-inner">
                                            <div className="text-2xl font-bold text-foreground">{courseData.courseLevel}</div>
                                            <div className="text-sm text-muted-foreground">Level</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status Selection */}
                                <div className="space-y-4">
                                    <Label className={LABEL_CLASS + " text-lg"}>Choose Final Course Status</Label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Card
                                            className={`cursor-pointer transition-all border-2 ${finalStatus === 'Draft' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50'}`}
                                            onClick={() => setFinalStatus('Draft')}
                                        >
                                            <CardContent className="p-6 text-center">
                                                <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                                <h3 className="font-bold text-xl mb-2 text-foreground">Save as Draft</h3>
                                                <p className="text-sm text-muted-foreground">Keep your course private and continue editing later.</p>
                                            </CardContent>
                                        </Card>
                                        
                                        <Card
                                            className={`cursor-pointer transition-all border-2 ${finalStatus === 'Published' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50'} ${totalLessons === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            onClick={totalLessons > 0 ? handlePublishClick : undefined}
                                        >
                                            <CardContent className="p-6 text-center">
                                                <Send className="w-12 h-12 mx-auto mb-4 text-primary" />
                                                <h3 className="font-bold text-xl mb-2 text-primary">Publish Course</h3>
                                                <p className="text-sm text-muted-foreground">Make your course available to students immediately.</p>
                                                {totalLessons === 0 && (<p className="text-xs text-destructive mt-2 font-medium">Requires at least 1 lesson.</p>)}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button onClick={() => setCurrentStage(2)} className="flex-1 h-11" variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Content
                                    </Button>
                                    <Button onClick={handleStage3Submit} className="flex-1 h-11 bg-primary hover:bg-primary/90 font-bold text-lg shadow-lg" disabled={isLoading}>
                                        {isLoading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{finalStatus === 'Published' ? 'Publishing...' : 'Saving...'}</>
                                        ) : (
                                            <>{finalStatus === 'Published' ? 'Publish Course' : 'Save as Draft'} <CheckCircle className="w-4 h-4 ml-2" /></>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;