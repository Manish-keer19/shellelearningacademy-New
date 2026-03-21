import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, X, Image, FileText, Edit, Send, Loader2, CheckCircle, ArrowRight, ArrowLeft, File, Download, Eye, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { courseService } from '@/service/course.service';
import { useAppSelector } from '@/hooks/redux';
import ManageClasses from "@/components/core/Dashboard/EditCourse/ManageClasses/ManageClasses";

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { toast } = useToast();
  const { accessToken: token } = useAppSelector((state) => state.auth);

  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [categories, setCategories] = useState([]);

  // Stage 1: Course Data (matched to controller fields)
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
    instructions: [],
    status: 'Draft',
    courseLevel: '',
    courseDuration: '',
    courseOverview: '',
    brochure: null,
    brochureUrl: '',
  });

  // Track original data for change detection
  const [originalCourseData, setOriginalCourseData] = useState({});
  const [originalSections, setOriginalSections] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Stage 2: Sections and Subsections
  const [sections, setSections] = useState([]);
  const [currentSectionName, setCurrentSectionName] = useState('');
  const [editingSubSection, setEditingSubSection] = useState(null); // { sectionIndex, subIndex }
  const [sectionForms, setSectionForms] = useState({}); // Per-section form state

  // Helper states
  const [currentTag, setCurrentTag] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');

  const initialForm = { title: '' };

  // Fetch course details (adapted to controller fields)
  const fetchCourseDetails = async () => {
    if (!courseId || !token) {
      console.log("token and course id is not found")
    };
    try {
      setIsLoadingCourse(true);
      const res = await courseService.getFullCourseDetails(courseId, token);
      const course = res.data.courseDetails;

      const courseDataObj = {
        courseName: course.courseName || '',
        courseDescription: course.courseDescription || '',
        whatYouWillLearn: course.whatYouWillLearn || '',
        originalPrice: course.originalPrice || '',
        discountedPrice: course.discountedPrice || '',
        thumbnail: null,
        thumbnailImage: course.thumbnail || '',
        tag: course.tag || [],
        category: course.category?._id || '',
        instructions: course.instructions || [],
        status: course.status || 'Draft',
        courseLevel: course.courseLevel || '',
        courseDuration: course.courseDuration || '',
        courseOverview: course.courseOverview || '',
        brochure: null,
        brochureUrl: course.brochures || '',
      };

      setCourseData(courseDataObj);
      setOriginalCourseData(courseDataObj);

      // Convert existing sections to editable format
      const existingSections = course.courseContent?.map(section => ({
        sectionName: section.sectionName,
        sectionId: section._id,
        isCreated: true,
        subSections: section.subSection?.map(sub => ({
          title: sub.title,
          description: sub.description,
          subSectionId: sub._id,
          isCreated: true
        })) || []
      })) || [];

      setSections(existingSections);
      setOriginalSections(JSON.parse(JSON.stringify(existingSections)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course details",
        variant: "destructive"
      });
      navigate('/manage-courses');
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    if (!token) {
      console.log("token is not found")
    };
    try {
      const res = await courseService.getAllCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Reset stage to 1 when courseId changes (new course being edited)
  useEffect(() => {
    console.log("CourseId changed, resetting to stage 1");
    setCurrentStage(1);
  }, [courseId]);

  // Debug: Log stage changes
  useEffect(() => {
    console.log("Current stage changed to:", currentStage);
    console.log("Token from Redux:", token ? "exists" : "missing", "Value:", token);
  }, [currentStage]);

  useEffect(() => {
    console.log("we are in useefeect to fetch")
    fetchCourseDetails();
    fetchCategories();
  }, []);

  // Stage 1 Handlers (matched to controller)
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (courseData.thumbnailImage && courseData.thumbnailImage.startsWith('blob:')) {
        URL.revokeObjectURL(courseData.thumbnailImage);
      }
      const previewUrl = URL.createObjectURL(file);
      setCourseData(prev => ({ ...prev, thumbnail: file, thumbnailImage: previewUrl }));
    }
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (courseData.brochureUrl && courseData.brochureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(courseData.brochureUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setCourseData(prev => ({ ...prev, brochure: file, brochureUrl: previewUrl }));
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid PDF file.",
        variant: "destructive"
      });
    }
  };

  const previewBrochure = () => {
    const previewUrl = courseData.brochure
      ? URL.createObjectURL(courseData.brochure)
      : courseData.brochureUrl;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
    // Note: For blob URLs, we don't revoke immediately to allow the browser to load the PDF
    // The blob will be garbage collected after the tab closes
  };

  const downloadBrochure = async () => {
    let downloadUrl: string;
    let filename: string = 'Course-Brochure.pdf';

    if (courseData.brochure) {
      // New uploaded file
      downloadUrl = URL.createObjectURL(courseData.brochure);
      filename = courseData.brochure.name || filename; // Ensure .pdf if not present
      if (!filename.endsWith('.pdf')) {
        filename += '.pdf';
      }
    } else if (courseData.brochureUrl) {
      // Existing URL from server
      try {
        const response = await fetch(courseData.brochureUrl);
        const blob = await response.blob();
        downloadUrl = URL.createObjectURL(blob);
        // Use a generic name with .pdf extension
        filename = 'Course-Brochure.pdf';
      } catch (error) {
        toast({
          title: "Download Error",
          description: "Failed to fetch the brochure for download.",
          variant: "destructive"
        });
        return;
      }
    } else {
      toast({
        title: "No Brochure",
        description: "No brochure available to download.",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the URL after a short delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  };

  const removeBrochure = () => {
    if (courseData.brochureUrl && courseData.brochureUrl.startsWith('blob:')) {
      URL.revokeObjectURL(courseData.brochureUrl);
    }
    setCourseData(prev => ({ ...prev, brochure: null, brochureUrl: '' }));
  };

  const addTag = () => {
    if (currentTag.trim() && !courseData.tag.includes(currentTag.trim())) {
      setCourseData(prev => ({ ...prev, tag: [...prev.tag, currentTag.trim()] }));
      setCurrentTag('');
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

  // Check if course data has changed
  const hasCourseDataChanged = () => {
    return JSON.stringify(courseData) !== JSON.stringify(originalCourseData) || courseData.thumbnail !== null || courseData.brochure !== null;
  };

  // Stage 1: Update Course (matched to controller)
  const handleStage1Submit = async () => {
    if (
      !courseData.courseName ||
      !courseData.courseDescription ||
      !courseData.whatYouWillLearn ||
      !courseData.originalPrice ||
      !courseData.category ||
      !courseData.courseLevel ||
      !courseData.courseDuration ||
      (!courseData.thumbnail && !courseData.thumbnailImage) ||
      (!courseData.brochure && !courseData.brochureUrl) ||
      courseData.tag.length === 0
    ) {
      toast({
        title: "Incomplete Form",
        description: "All required fields including thumbnail and brochure are mandatory.",
        variant: "destructive"
      });
      return;
    }

    if (!hasCourseDataChanged()) {
      toast({
        title: "No Changes Detected",
        description: "Moving to next stage without updating."
      });
      setCurrentStage(2);
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('courseName', courseData.courseName);
      formData.append('courseDescription', courseData.courseDescription);
      formData.append('whatYouWillLearn', courseData.whatYouWillLearn);
      formData.append('originalPrice', courseData.originalPrice);
      formData.append('discountedPrice', courseData.discountedPrice || 0);
      formData.append('tag', JSON.stringify(courseData.tag));
      formData.append('category', courseData.category);
      formData.append('instructions', JSON.stringify(courseData.instructions));
      formData.append('courseLevel', courseData.courseLevel);
      formData.append('courseDuration', courseData.courseDuration);
      formData.append('courseOverview', courseData.courseOverview);

      if (courseData.thumbnail) {
        formData.append('thumbnailImage', courseData.thumbnail);
      }
      if (courseData.brochure) {
        formData.append('brochurePdf', courseData.brochure);
      }

      await courseService.editCourse(formData, token);

      toast({
        title: "Course Updated Successfully!",
        description: "Now you can manage sections and lessons."
      });

      setCurrentStage(2);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update course",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Skip Stage 1
  const skipStage1 = () => {
    toast({
      title: "Stage Skipped",
      description: "Moving to content management without updates."
    });
    setCurrentStage(2);
  };

  // Stage 2 Handlers (no video)
  const addSection = async () => {
    if (!currentSectionName.trim()) return;

    try {
      setIsLoading(true);
      const sectionRes = await courseService.createSection({
        sectionName: currentSectionName.trim(),
        courseId: courseId
      }, token);

      const newSectionId = sectionRes.updatedCourse.courseContent[sectionRes.updatedCourse.courseContent.length - 1]._id || sectionRes.updatedCourse.courseContent[sectionRes.updatedCourse.courseContent.length - 1];

      setSections(prev => [...prev, {
        sectionName: currentSectionName.trim(),
        sectionId: newSectionId,
        isCreated: true,
        subSections: []
      }]);

      setCurrentSectionName('');
      toast({ title: "Section added successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSection = async (index) => {
    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this section? This action cannot be undone.",
      action: (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>Cancel</Button>
          <Button size="sm" variant="destructive" onClick={async () => {
            const section = sections[index];
            if (section.isCreated && section.sectionId) {
              try {
                setIsLoading(true);
                await courseService.deleteSection({
                  sectionId: section.sectionId,
                  courseId: courseId
                }, token);

                setSections(prev => prev.filter((_, i) => i !== index));
                toast({ title: "Section deleted successfully!" });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete section",
                  variant: "destructive"
                });
              } finally {
                setIsLoading(false);
              }
            } else {
              setSections(prev => prev.filter((_, i) => i !== index));
            }
            toast.dismiss();
          }}>Delete</Button>
        </div>
      ),
      duration: 10000
    });
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

  const handleAddOrUpdateSubSection = useCallback(async (sectionIndex) => {
    const form = sectionForms[sectionIndex] || initialForm;
    if (!form.title.trim()) {
      toast({
        title: "Incomplete Lesson",
        description: "Lesson title is required.",
        variant: "destructive"
      });
      return;
    }

    const section = sections[sectionIndex];
    if (!section.sectionId) return;

    try {
      setIsLoading(true);
      const subSectionData = new FormData();
      subSectionData.append('sectionId', section.sectionId);
      subSectionData.append('title', form.title);
      subSectionData.append('description', '');
      subSectionData.append('courseId', courseId);

      const res = await courseService.createSubSection(subSectionData, token);

      setSections(prev => prev.map((s, idx) => {
        if (idx !== sectionIndex) return s;

        let newSubSections;
        if (editingSubSection && editingSubSection.sectionIndex === sectionIndex && editingSubSection.subIndex !== undefined) {
          newSubSections = [...s.subSections];
          newSubSections[editingSubSection.subIndex] = {
            title: form.title,
            isCreated: true,
            subSectionId: res.data?._id || form.subSectionId
          };
          setEditingSubSection(null);
        } else {
          newSubSections = [...s.subSections, {
            title: form.title,
            isCreated: true,
            subSectionId: res.data?._id || Date.now()
          }];
        }

        setSectionForms(prevForms => {
          const newForms = { ...prevForms };
          delete newForms[sectionIndex];
          return newForms;
        });

        return { ...s, subSections: newSubSections };
      }));

      toast({ title: editingSubSection ? "Lesson updated successfully!" : "Lesson added successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lesson",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [editingSubSection, sectionForms, sections, courseId, token, toast]);

  const handleEditSubSection = useCallback((sectionIndex, subIndex) => {
    const section = sections[sectionIndex];
    if (!section) return;
    const subData = section.subSections[subIndex];
    if (!subData) return;

    setSectionForms(prev => ({
      ...prev,
      [sectionIndex]: { ...subData }
    }));
    setEditingSubSection({ sectionIndex, subIndex });
  }, [sections]);

  const handleCancelEdit = useCallback((sectionIndex) => {
    setSectionForms(prev => {
      const newForms = { ...prev };
      delete newForms[sectionIndex];
      return newForms;
    });
    setEditingSubSection(null);
  }, []);

  const removeSubSection = async (sectionIndex, subIndex) => {
    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this lesson? This action cannot be undone.",
      action: (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>Cancel</Button>
          <Button size="sm" variant="destructive" onClick={async () => {
            const section = sections[sectionIndex];
            const subSection = section.subSections[subIndex];

            if (subSection.isCreated && subSection.subSectionId) {
              try {
                setIsLoading(true);
                await courseService.deleteSubSection({
                  subSectionId: subSection.subSectionId,
                  sectionId: section.sectionId,
                  courseId: courseId
                }, token);

                setSections(prev => prev.map((s, idx) =>
                  idx === sectionIndex
                    ? { ...s, subSections: s.subSections.filter((_, i) => i !== subIndex) }
                    : s
                ));

                toast({ title: "Lesson deleted successfully!" });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete lesson",
                  variant: "destructive"
                });
              } finally {
                setIsLoading(false);
              }
            } else {
              setSections(prev => prev.map((s, idx) =>
                idx === sectionIndex
                  ? { ...s, subSections: s.subSections.filter((_, i) => i !== subIndex) }
                  : s
              ));
            }
            toast.dismiss();
          }}>Delete</Button>
        </div>
      ),
      duration: 10000
    });
  };

  // Skip Stage 2
  const skipStage2 = () => {
    toast({
      title: "Stage Skipped",
      description: "Moving to status update without content changes."
    });
    setCurrentStage(3);
  };

  // Stage 3: Update Course Status
  const handleStage3Submit = async () => {
    if (courseData.status === originalCourseData.status) {
      toast({
        title: "No Changes Detected",
        description: "Course status unchanged. Returning to manage courses."
      });
      navigate('/manage-courses');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('status', courseData.status);

      await courseService.editCourse(formData, token);

      toast({
        title: "Course Updated!",
        description: `Course has been ${courseData.status === 'Published' ? 'published' : 'saved as draft'} successfully.`
      });

      navigate('/manage-courses');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update course status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStageProgress = () => {
    return (currentStage / 4) * 100;
  };

  const totalLessons = sections.reduce((total, section) => total + section.subSections.length, 0);

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading course details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      {/* Progress Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/manage-courses')}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Manage Courses</span>
              </button>
              <div className="text-sm text-muted-foreground">
                Stage {currentStage} of 4
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={currentStage >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                  1. Edit Course Details
                </span>
                <span className={currentStage >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                  2. Manage Content
                </span>
                <span className={currentStage >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                  3. Upcoming Classes
                </span>
                <span className={currentStage >= 4 ? "text-primary font-medium" : "text-muted-foreground"}>
                  4. Update Status
                </span>
              </div>
              <Progress value={getStageProgress()} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-8 pb-20">
        <div className="max-w-3xl mx-auto">

          {/* Stage 1: Course Details */}
          {currentStage === 1 && (
            <Card className="bg-card/80 backdrop-blur-lg border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Stage 1: Edit Your Course
                  </span>
                </CardTitle>
                <p className="text-muted-foreground">Update the basic information for your course</p>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    name="courseName"
                    value={courseData.courseName}
                    onChange={handleCourseInputChange}
                    placeholder="Enter course title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price *</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      value={courseData.originalPrice}
                      onChange={handleCourseInputChange}
                      placeholder="$149.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price</Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      value={courseData.discountedPrice}
                      onChange={handleCourseInputChange}
                      placeholder="$99.99"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Course Description *</Label>
                  <Textarea
                    id="courseDescription"
                    name="courseDescription"
                    value={courseData.courseDescription}
                    onChange={handleCourseInputChange}
                    placeholder="Describe your course..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatYouWillLearn">What You Will Learn *</Label>
                  <Textarea
                    id="whatYouWillLearn"
                    name="whatYouWillLearn"
                    value={courseData.whatYouWillLearn}
                    onChange={handleCourseInputChange}
                    placeholder="Key takeaways..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseLevel">Course Level *</Label>
                  <Select value={courseData.courseLevel} onValueChange={(value) => setCourseData(prev => ({ ...prev, courseLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDuration">Course Duration *</Label>
                  <Input
                    id="courseDuration"
                    name="courseDuration"
                    value={courseData.courseDuration}
                    onChange={handleCourseInputChange}
                    placeholder="e.g., 10 hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseOverview">Course Overview</Label>
                  <Textarea
                    id="courseOverview"
                    name="courseOverview"
                    value={courseData.courseOverview}
                    onChange={handleCourseInputChange}
                    placeholder="Provide course overview..."
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={courseData.category} onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tag"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.tag.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentInstruction}
                      onChange={(e) => setCurrentInstruction(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addInstruction()}
                      placeholder="Add instruction"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.instructions.map((inst, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        {inst}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstruction(index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label>Thumbnail Image *</Label>
                  {!courseData.thumbnailImage ? (
                    <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-2 pointer-events-none">
                        <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Image className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Click to upload thumbnail</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden border border-border">
                        <img
                          src={courseData.thumbnailImage}
                          alt="Course Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (courseData.thumbnailImage && courseData.thumbnailImage.startsWith('blob:')) URL.revokeObjectURL(courseData.thumbnailImage);
                          setCourseData(prev => ({ ...prev, thumbnail: null, thumbnailImage: '' }));
                        }}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Brochure PDF */}
                <div className="space-y-2">
                  <Label>Brochure PDF *</Label>
                  {!courseData.brochure && !courseData.brochureUrl ? (
                    <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleBrochureChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-2 pointer-events-none">
                        <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <File className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Click to upload brochure PDF</p>
                          <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <File className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">
                              {courseData.brochure ? courseData.brochure.name : 'Current Brochure.pdf'}
                            </span>
                            {courseData.brochure && <Badge variant="secondary" className="text-xs">New</Badge>}
                            {!courseData.brochure && <Badge variant="outline" className="text-xs">Existing</Badge>}
                          </div>
                          <div className="flex gap-2">

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={downloadBrochure}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={removeBrochure}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleBrochureChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="space-y-2 pointer-events-none">
                          <div className="w-12 h-12 mx-auto bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <File className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Click to replace brochure PDF</p>
                            <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={skipStage1}
                    className="flex-1"
                  >
                    Skip Stage
                  </Button>
                  <Button
                    onClick={handleStage1Submit}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating Course...
                      </>
                    ) : (
                      <>
                        Update Course & Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 2: Manage Content (no video) */}
          {currentStage === 2 && (
            <Card className="bg-card/80 backdrop-blur-lg border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Stage 2: Manage Content
                  </span>
                </CardTitle>
                <p className="text-muted-foreground">Edit sections and lessons for your course</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-500">Course "{courseData.courseName}" loaded successfully</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Add Section */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                  <Label className="text-sm font-medium mb-3 block">Add New Section</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentSectionName}
                      onChange={(e) => setCurrentSectionName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSection()}
                      placeholder="Enter section name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="default"
                      onClick={addSection}
                      disabled={!currentSectionName.trim() || isLoading}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {sections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                      <p className="text-sm">Add your first section above</p>
                    </div>
                  )}

                  {sections.map((section, sectionIndex) => {
                    const form = sectionForms[sectionIndex] || initialForm;
                    const isEditingThis = editingSubSection && editingSubSection.sectionIndex === sectionIndex;
                    return (
                      <Card key={sectionIndex} className="bg-gradient-to-r from-card/80 to-card/60 border-primary/30">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{sectionIndex + 1}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{section.sectionName}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {section.subSections.length} lesson{section.subSections.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(sectionIndex)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">

                          {/* Add/Edit Subsection */}
                          <div className="space-y-3 p-4 border border-border rounded-md bg-muted/30">
                            <Label className="text-sm font-medium">
                              {isEditingThis ? `Edit Lesson ${editingSubSection.subIndex + 1}` : 'Add New Lesson'}
                            </Label>

                            <Input
                              placeholder="Lesson Title (Required)"
                              value={form.title}
                              onChange={(e) => updateFormField(sectionIndex, 'title', e.target.value)}
                            />



                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAddOrUpdateSubSection(sectionIndex)}
                                className="flex-1"
                                disabled={!form.title.trim()}
                              >
                                {isEditingThis ? (
                                  <>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Update Lesson
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson to Section
                                  </>
                                )}
                              </Button>
                              {isEditingThis && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelEdit(sectionIndex)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* Subsections List */}
                          <div className="space-y-2">
                            {section.subSections.map((sub, subIndex) => (
                              <div key={subIndex} className="p-3 border border-border/50 rounded-lg bg-card/50">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Badge variant="secondary" className="text-xs">
                                        Lesson {subIndex + 1}
                                      </Badge>
                                      <h4 className="font-medium">{sub.title}</h4>
                                    </div>

                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditSubSection(sectionIndex, subIndex)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeSubSection(sectionIndex, subIndex)}
                                      className="text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStage(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course Info
                  </Button>
                  <Button
                    variant="outline"
                    onClick={skipStage2}
                    className="flex-1"
                  >
                    Skip Stage
                  </Button>
                  <Button
                    onClick={() => setCurrentStage(3)}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    disabled={isLoading || sections.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Content...
                      </>
                    ) : (
                      <>
                        Continue to Upcoming Classes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage 3: Upcoming Classes */}
          {currentStage === 3 && (
            <div className="space-y-6">
              <ManageClasses courseId={courseId || ""} token={token || ""} />
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setCurrentStage(2)}>Back</Button>
                <Button onClick={() => setCurrentStage(4)}>Next</Button>
              </div>
            </div>
          )}

          {/* Stage 4: Update Status & Publish */}
          {currentStage === 4 && (
            <Card className="bg-card/80 backdrop-blur-lg border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Stage 4: Publish Course
                  </span>
                </CardTitle>
                <p className="text-muted-foreground">Choose the new status for your course</p>
                <div className="flex flex-col items-center space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-500">Course details updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-500">
                      {sections.length} sections and {totalLessons} lessons
                    </span>
                  </div>
                  {totalLessons === 0 && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <FileText className="w-4 h-4" />
                      <span>No lessons added - Publishing requires at least one lesson</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Course Summary */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Course Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-card/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{sections.length}</div>
                        <div className="text-sm text-muted-foreground">Sections</div>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <div className="text-2xl font-bold text-accent">
                          {totalLessons}
                        </div>
                        <div className="text-sm text-muted-foreground">Lessons</div>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{courseData.tag.length}</div>
                        <div className="text-sm text-muted-foreground">Tags</div>
                      </div>

                    </div>
                    <div className="text-center p-4 bg-card/30 rounded-lg">
                      <h3 className="font-semibold text-lg">{courseData.courseName}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {courseData.courseDescription || 'No description provided'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {/* Status Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Course Status</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-all ${courseData.status === 'Draft' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      onClick={() => setCourseData(prev => ({ ...prev, status: 'Draft' }))}
                    >
                      <CardContent className="p-6 text-center">
                        <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Save as Draft</h3>
                        <p className="text-sm text-muted-foreground">
                          Keep your course private and continue editing later
                        </p>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${courseData.status === 'Published' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${totalLessons === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (totalLessons === 0) {
                          toast({
                            title: "Cannot Publish",
                            description: "Add at least one section with lessons before publishing.",
                            variant: "destructive"
                          });
                          return;
                        }
                        setCourseData(prev => ({ ...prev, status: 'Published' }));
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Publish Course</h3>
                        <p className="text-sm text-muted-foreground">
                          Make your course available to students immediately
                        </p>
                        {totalLessons === 0 && (
                          <p className="text-xs text-destructive mt-2 font-medium">
                            Requires at least 1 lesson
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStage(3)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Classes
                  </Button>
                  <Button
                    onClick={handleStage3Submit}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {courseData.status === 'Published' ? 'Publishing...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        {courseData.status === 'Published' ? 'Publish Course' : 'Save as Draft'}
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditCourse;