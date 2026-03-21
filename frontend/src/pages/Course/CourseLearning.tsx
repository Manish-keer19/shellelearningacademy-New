import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Pause,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Loader2,
  Volume2,
  Maximize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { courseService } from '@/service/course.service';
import { useAppSelector } from '@/hooks/redux';
import '../../styles/video-protection.css'

const CourseLearning = () => {
  const { id } = useParams();
  const courseId = id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [videoLoading, setVideoLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const fetchCourseDetails = async () => {
    if (!courseId || !token) return;

    try {
      setIsLoading(true);
      const res = await courseService.getFullCourseDetails(courseId, token);
      const courseData = res.data.courseDetails;

      // Check if user is enrolled
      if (!courseData.studentsEnrolled?.includes(user?._id)) {
        toast({
          title: "Access Denied",
          description: "You need to enroll in this course to access the content",
          variant: "destructive"
        });
        navigate(`/course-detail/${courseId}`);
        return;
      }

      // Verify course has content
      if (!courseData.courseContent || courseData.courseContent.length === 0) {
        toast({
          title: "No Content Available",
          description: "This course doesn't have any content yet",
          variant: "destructive"
        });
        navigate(`/course-detail/${courseId}`);
        return;
      }

      setCourse(courseData);
      setCompletedLessons(res.data.completedVideos || []);

      // Calculate progress
      const totalLessons = courseData.courseContent?.reduce((total, section) =>
        total + (section.subSection?.length || 0), 0) || 0;
      const completed = res.data.completedVideos?.length || 0;
      setProgress(totalLessons > 0 ? (completed / totalLessons) * 100 : 0);

      // Set initial section and lesson from URL params or first available
      const sectionParam = searchParams.get('section');
      const lessonParam = searchParams.get('lesson');

      let initialSection = null;
      let initialLesson = null;

      if (sectionParam && lessonParam) {
        initialSection = courseData.courseContent?.find(s => s._id === sectionParam);
        initialLesson = initialSection?.subSection?.find(l => l._id === lessonParam);
      }

      if (!initialSection || !initialLesson) {
        initialSection = courseData.courseContent?.[0];
        initialLesson = initialSection?.subSection?.[0];
      }

      setCurrentSection(initialSection);
      setCurrentLesson(initialLesson);

      // Expand current section
      if (initialSection) {
        setExpandedSections({ [initialSection._id]: true });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course details",
        variant: "destructive"
      });
      navigate('/all-courses');
    } finally {
      setIsLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!token || completedLessons.includes(lessonId)) return;

    try {
      await courseService.markLectureComplete(courseId, lessonId, token);
      setCompletedLessons(prev => [...prev, lessonId]);

      // Update progress
      const totalLessons = course.courseContent?.reduce((total, section) =>
        total + (section.subSection?.length || 0), 0) || 0;
      const newCompleted = completedLessons.length + 1;
      setProgress(totalLessons > 0 ? (newCompleted / totalLessons) * 100 : 0);

      toast({
        title: "Progress Updated",
        description: "Lesson marked as complete!",
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const selectLesson = (section, lesson) => {
    setCurrentSection(section);
    setCurrentLesson(lesson);
    setVideoLoading(true);

    // Update URL
    setSearchParams({ section: section._id, lesson: lesson._id });

    // Expand the section
    setExpandedSections(prev => ({ ...prev, [section._id]: true }));
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleVideoEnd = () => {
    if (currentLesson && !completedLessons.includes(currentLesson._id)) {
      markLessonComplete(currentLesson._id);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen (try video first, fallback to document)
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Navbar handlers
  const goToPreviousLesson = () => {
    if (!currentSection || !currentLesson) return;

    const sectionIndex = course.courseContent.findIndex(s => s._id === currentSection._id);
    const lessonIndex = currentSection.subSection.findIndex(l => l._id === currentLesson._id);

    if (lessonIndex > 0) {
      // Previous lesson in same section
      selectLesson(currentSection, currentSection.subSection[lessonIndex - 1]);
    } else if (sectionIndex > 0) {
      // First lesson of previous section
      const prevSection = course.courseContent[sectionIndex - 1];
      selectLesson(prevSection, prevSection.subSection[prevSection.subSection.length - 1]);
    }
  };

  const goToNextLesson = () => {
    if (!currentSection || !currentLesson) return;

    const sectionIndex = course.courseContent.findIndex(s => s._id === currentSection._id);
    const lessonIndex = currentSection.subSection.findIndex(l => l._id === currentLesson._id);

    if (lessonIndex < currentSection.subSection.length - 1) {
      // Next lesson in same section
      selectLesson(currentSection, currentSection.subSection[lessonIndex + 1]);
    } else if (sectionIndex < course.courseContent.length - 1) {
      // First lesson of next section
      const nextSection = course.courseContent[sectionIndex + 1];
      selectLesson(nextSection, nextSection.subSection[0]);
    }
  };

  // Enhanced video protection
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleKeyDown = (e) => {
    // Disable common download/save shortcuts and dev tools
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S')) || // Ctrl+S
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || // Ctrl+Shift+J
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // Ctrl+U
      e.key === 'F12' || // F12
      (e.ctrlKey && (e.key === 'p' || e.key === 'P')) // Ctrl+P
    ) {
      e.preventDefault();
      return false;
    }
  };

  // Disable drag and drop on video
  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Disable text selection on video
  const handleSelectStart = (e) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, token]);

  // Additional security: Detect developer tools
  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
        // Developer tools might be open
        console.clear();
        console.log('%cVideo content is protected!', 'color: red; font-size: 20px; font-weight: bold;');
      }
    };

    const interval = setInterval(detectDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Disable print screen
    const handlePrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keyup', handlePrintScreen);

    // Clear console periodically
    const consoleClearInterval = setInterval(() => {
      console.clear();
    }, 3000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keyup', handlePrintScreen);
      clearInterval(consoleClearInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-2 sm:px-4 pt-8 sm:pt-32 pb-20">
          <div className="flex items-center justify-center py-8 sm:py-16">
            <div className="text-center">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-4" />
              <p className="text-sm sm:text-lg">Loading course...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-2 sm:px-4 pt-8 sm:pt-32 pb-20">
          <div className="text-center py-8">
            <h1 className="text-lg sm:text-2xl font-bold mb-4">Course not accessible</h1>
            <Button onClick={() => navigate('/all-courses')} variant="outline" className="w-full sm:w-auto max-w-xs mx-auto">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-[10vh] md:mt-0 ">
      <Navbar />

      <main className="container mx-auto px-2 sm:px-4 pt-8 sm:pt-32 pb-8 sm:pb-20">
        <div className="w-full space-y-4 lg:space-y-6 mt-4">
          {/* Video Player */}
          <div className="w-full mt-2">
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden video-container mx-auto w-full max-w-full"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onSelectStart={handleSelectStart}>
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-white" />
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                controlsList="nodownload noremoteplayback"
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onSelectStart={handleSelectStart}
                onLoadStart={() => setVideoLoading(true)}
                onLoadedData={() => setVideoLoading(false)}
                onEnded={handleVideoEnd}
                src={currentLesson.videoUrl}
                key={currentLesson._id}
                style={{ userSelect: 'none', pointerEvents: 'auto' }}
              >
                Your browser does not support the video tag.
              </video>

              {/* Watermark overlay - smaller on mobile */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs pointer-events-none select-none">
                {user?.fullName} - {course.courseName}
              </div>

              {/* Custom playback rate controls - hidden on very small screens */}
              <div className="absolute bottom-12 sm:bottom-16 right-2 sm:right-4 bg-black/70 rounded-lg p-1 sm:p-2 flex space-x-0.5 sm:space-x-1 hidden xs:flex">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`px-1 sm:px-2 py-0.5 sm:py-1 text-xs rounded transition-colors ${playbackRate === rate
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white hover:bg-white/20'
                      }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Custom fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="absolute bottom-12 sm:bottom-16 right-20 sm:right-24 bg-black/70 hover:bg-black/80 rounded-full p-2 text-white transition-all flex items-center justify-center w-10 h-10 z-20"
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Lesson Content */}
            <div className="lg:col-span-2 order-1">
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <h2 className="text-lg sm:text-2xl font-bold flex-1">{currentLesson.title}</h2>
                  <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousLesson}
                      disabled={!currentSection || !currentLesson}
                      className="flex-1 sm:flex-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextLesson}
                      disabled={!currentSection || !currentLesson}
                      className="flex-1 sm:flex-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs sm:text-base text-muted-foreground mb-4 line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                  {currentLesson.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
                  <span className="whitespace-nowrap">Section: {currentSection.sectionName}</span>
                  {currentLesson.timeDuration && (
                    <span className="flex items-center space-x-1 whitespace-nowrap">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{Math.floor(currentLesson.timeDuration / 60)}:{(currentLesson.timeDuration % 60).toString().padStart(2, '0')}</span>
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => markLessonComplete(currentLesson._id)}
                  disabled={completedLessons.includes(currentLesson._id)}
                  variant={completedLessons.includes(currentLesson._id) ? "default" : "outline"}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedLessons.includes(currentLesson._id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </Card>
            </div>

            {/* Sidebar - Progress and Content */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-4 sm:p-6 h-fit sticky top-20 lg:top-4">
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>Course Progress</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Course Content</h3>
                <div className="space-y-2 sm:space-y-3 max-h-[40vh] sm:max-h-[50vh] lg:max-h-[70vh] overflow-y-auto">
                  {course.courseContent?.map((section, sectionIndex) => (
                    <div key={section._id} className="w-full">
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="w-full text-left mb-2 hover:bg-muted/50 p-2 rounded text-xs sm:text-sm flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{section.sectionName}</h4>
                          <p className="text-xs text-muted-foreground truncate">{section.subSection?.length || 0} lessons</p>
                        </div>
                        <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expandedSections[section._id] ? 'rotate-90' : ''}`} />
                      </button>
                      {expandedSections[section._id] && (
                        <div className="ml-0 sm:ml-4 space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                          {section.subSection?.map((lesson, lessonIndex) => (
                            <Card
                              key={lesson._id}
                              className={`p-2 sm:p-3 cursor-pointer hover-lift smooth-transition text-xs sm:text-sm border ${currentLesson._id === lesson._id ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                              onClick={() => selectLesson(section, lesson)}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                {completedLessons.includes(lesson._id) ? (
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate text-xs sm:text-sm">{lesson.title}</p>
                                  {lesson.timeDuration && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {Math.floor(lesson.timeDuration / 60)}:{(lesson.timeDuration % 60).toString().padStart(2, '0')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseLearning;