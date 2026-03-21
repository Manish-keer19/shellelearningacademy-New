import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WorkshopRegistrationModal } from "@/components/WorkshopRegistrationModal";
import { workshopService } from "@/service/workshop.service";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  CheckCircle,
  ArrowLeft,
  Loader2,
  DollarSign,
  Share2,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// ====================================================================
// 1. Types for Workshop Data
// ====================================================================
interface Workshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  mode: "Online" | "Offline" | "Hybrid";
  type: "Free" | "Paid";
  price: number;
  thumbnail: string;
  whatYouWillLearn: string[] | string;
  whoShouldAttend: string[] | string;
  meetingLink: string;
  location: string;
  certification: "true" | "false";
  status: "Draft" | "Published" | "Closed";
  studentsEnrolled?: { _id: string }[];
  studentCount?: string;
  instructor?: {
    _id: string;
    fullName: string;
    image?: string;
  };
  // Assuming the price fetched is a number now
}

// ====================================================================
// 2. Workshop Enrollment Card Component (Sticky Sidebar)
// ====================================================================

interface WorkshopEnrollmentProps {
  workshop: Workshop;
  isEnrolled: boolean;
  onEnroll: () => Promise<void>;
  enrolling: boolean;
}

const WorkshopEnrollmentCard: React.FC<WorkshopEnrollmentProps> = React.memo(
  ({ workshop, isEnrolled, onEnroll, enrolling }) => {
    // Determine the primary action button based on enrollment status
    const PrimaryButton = () => {
      if (isEnrolled) {
        return (
          <Button
            className="w-full bg-green-100 text-green-800 hover:bg-green-200 font-bold h-12 text-lg"
            disabled
          >
            <CheckCircle className="w-5 h-5 mr-2" /> Already Enrolled
          </Button>
        );
      }

      const buttonText =
        workshop.type === "Free" ? "Register Now" : "Enroll Now";

      return (
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-xl shadow-green-300/50 transition-all duration-300 transform hover:scale-[1.01]"
          onClick={onEnroll}
          disabled={enrolling || workshop.status !== "Published"}
        >
          {enrolling ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {workshop.type === "Free" ? "Registering..." : "Processing..."}
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      );
    };

    // Determine location/link for the info box
    const locationInfo = useMemo(() => {
      if (workshop.mode === "Online" || workshop.mode === "Hybrid") {
        return {
          icon: <Monitor className="w-5 h-5 text-blue-500" />,
          text: "Online Session (Link provided upon enrollment)",
        };
      }
      return {
        icon: <MapPin className="w-5 h-5 text-orange-500" />,
        text: workshop.location || "Location to be announced",
      };
    }, [workshop.mode, workshop.location]);

    return (
      <Card className="bg-card shadow-2xl sticky top-24 h-fit border border-border/70">
        {/* Workshop Thumbnail */}
        <div className="aspect-video bg-muted relative rounded-t-xl overflow-hidden">
          <img
            src={workshop.thumbnail}
            alt={workshop.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/1280x720?text=Workshop+Thumbnail")
            }
          />
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Price Display */}
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-600 mb-1 flex items-baseline justify-center gap-3">
              {workshop.price > 0 ? (
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 mr-1" />
                  <span>{workshop.price.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-green-500">FREE</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Limited Seats Available
            </p>
          </div>

          <Separator className="my-4" />

          {/* Enrollment Button */}
          <PrimaryButton />

          <div className="flex justify-center items-center text-xs text-muted-foreground/70 pt-1">
            <Users className="w-4 h-4 mr-1 text-primary" />
            {/* Display student count */}
            <span>
              {workshop.studentCount
                ? parseInt(workshop.studentCount).toLocaleString()
                : 0}{" "}
              participants joined so far
            </span>
          </div>

          <Separator className="my-4" />

          {/* Workshop Quick Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" /> Event Details
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-green-500 shrink-0" />
                <span className="font-medium text-foreground">Date:</span>
                <span className="ml-auto">{workshop.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green-500 shrink-0" />
                <span className="font-medium text-foreground">Time:</span>
                <span className="ml-auto">{workshop.time}</span>
              </div>
              <div className="flex items-center gap-3">
                {locationInfo.icon}
                <span className="font-medium text-foreground">Venue:</span>
                <span className="ml-auto text-right">{locationInfo.text}</span>
              </div>
              <div className="flex items-center gap-3 text-green-600 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Certificate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

// ====================================================================
// 3. Main Workshop Detail Component
// ====================================================================

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    accessToken,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);

  const [workshop, setWorkshop] = useState<Workshop | null>(
    location.state?.workshop || null,
  );
  const [loading, setLoading] = useState(!workshop);
  const [enrolling, setEnrolling] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Memoize the JSON parsing for list fields
  const parseListField = useCallback((field: string[] | string) => {
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return typeof field === "string"
        ? field
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];
    }
  }, []);

  const fetchWorkshop = useCallback(async () => {
    if (!id) return;
    try {
      const response = await workshopService.getWorkshopDetails(id);
      setWorkshop(response.data);
    } catch (error) {
      console.error("Failed to fetch workshop details:", error);
      toast.error("Failed to load workshop details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!workshop && id) {
      fetchWorkshop();
    } else {
      setLoading(false);
    }
  }, [id, workshop, fetchWorkshop]);

  const isEnrolled = useMemo(() => {
    if (!user || !workshop) return false;
    const userId = user._id || (user as any).id;
    if (!userId) return false;

    // Check if user ID is in the enrolled students list
    return (
      workshop.studentsEnrolled?.some(
        (student: any) => student._id === userId,
      ) || false
    );
  }, [user, workshop]);

  const handleEnroll = useCallback(async () => {
    if (!workshop) return;

    // Allow registration without login
    // Show registration modal for all workshops (both Free and Paid)
    setShowRegistrationModal(true);
  }, [workshop]);

  const handleRegistrationSuccess = useCallback(() => {
    // Refresh workshop details to get updated enrollment count
    if (id) {
      fetchWorkshop();
    }
  }, [id, fetchWorkshop]);

  // Legacy enrollment function (kept for backward compatibility)
  const handleDirectEnroll = useCallback(async () => {
    if (!workshop || !accessToken) return;

    if (user?.accountType !== "Student") {
      toast.error("Only students can enroll in workshops.");
      return;
    }

    try {
      await workshopService.enrollWorkshop(workshop._id, accessToken);
      toast.success("Enrolled successfully!");

      // Re-fetch or manually update state to show "Already Enrolled"
      setWorkshop((prev) =>
        prev
          ? ({
              ...prev,
              studentsEnrolled: [
                ...(prev.studentsEnrolled || []),
                { _id: user._id || (user as any).id },
              ],
            } as Workshop)
          : null,
      );
    } catch (error: any) {
      console.error("Enrollment failed:", error);
      toast.error(error.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrolling(false);
    }
  }, [workshop, accessToken, user, navigate, location.pathname]);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-lg text-muted-foreground">
            Loading workshop details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Navbar />
        <div className="text-center p-10 bg-white rounded-xl shadow-lg mt-20">
          <Zap className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Workshop Not Found</h2>
          <p className="text-muted-foreground">
            The requested workshop details could not be loaded or do not exist.
          </p>
          <Button
            onClick={() => navigate("/workshops")}
            className="mt-6 bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workshops
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Process lists for display
  const whatYouWillLearnList = parseListField(workshop.whatYouWillLearn);
  const whoShouldAttendList = parseListField(workshop.whoShouldAttend);
  const enrolledCount = workshop.studentCount
    ? parseInt(workshop.studentCount)
    : 0;

  return (
    <div className="min-h-screen bg-background mt-16">
      <Navbar />

      {/* HERO SECTION - Visually impactful, spans full width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-green-50 dark:bg-card border-b border-border/70 py-10 lg:py-16"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-4">
            <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="hover:text-green-700 -ml-4 p-0 h-auto flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Workshops
              </Button>
              <span>/</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 text-xs font-semibold">
                {workshop.type}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-200 text-green-700 text-xs font-semibold"
              >
                {workshop.mode}
              </Badge>
            </div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight break-words"
            >
              {workshop.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm md:text-base text-muted-foreground max-w-3xl pt-2"
            >
              {workshop.description.substring(0, 150)}
              {workshop.description.length > 150 ? "..." : ""}
            </motion.p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-x-8 gap-y-4 pt-6 text-sm font-semibold"
            >
              <div className="flex items-center gap-2 text-green-600">
                <Calendar className="w-5 h-5" />
                <span>{workshop.date}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-5 h-5" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                <span> {enrolledCount} Participants</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span>Certificate </span>
              </div>
            </motion.div>

            {/* Instructor Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 pt-4"
            >
              <img
                src={
                  workshop.instructor?.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${workshop.instructor?.fullName}`
                }
                alt={workshop.instructor?.fullName}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="font-bold text-foreground">
                  {workshop.instructor?.fullName || "Expert Instructor"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. What You'll Learn (Card emphasized) */}
            {whatYouWillLearnList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="border-green-200 bg-card shadow-lg">
                  <CardHeader className="p-5 border-b border-border/70">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-green-700">
                      <Zap className="w-6 h-6" /> What You Will Master
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {whatYouWillLearnList.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200 text-sm font-medium hover:shadow-md transition-shadow"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Separator />

            {/* 2. Detailed Description */}
            <div>
              <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-green-600 pl-4">
                Full Workshop Description
              </h3>
              <div className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {workshop.description}
              </div>
            </div>

            <Separator />

            {/* 3. Who Should Attend */}
            {whoShouldAttendList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-green-600 pl-4">
                  Target Audience
                </h3>
                <div className="space-y-4">
                  {whoShouldAttendList.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/70 text-base font-medium hover:shadow-sm transition-shadow"
                    >
                      <TrendingUp className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <Separator />

            {/* 4. Practical Details */}
            {/* <div>
                            <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-green-600 pl-4">Practical Information</h3>
                            <div className="space-y-4 text-muted-foreground text-lg">
                                {workshop.mode === 'Online' && workshop.meetingLink && (
                                    <div className="flex items-center gap-3">
                                        <Video className="w-6 h-6 text-blue-500" />
                                        <span className='font-semibold'>Access Link:</span>
                                        {isEnrolled ? (
                                            <a href={workshop.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {workshop.meetingLink.length > 40 ? workshop.meetingLink.substring(0, 40) + '...' : workshop.meetingLink}
                                            </a>
                                        ) : (
                                            <span className='italic'>Link available after enrollment.</span>
                                        )}
                                    </div>
                                )}
                                {workshop.mode !== 'Online' && workshop.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                                        <div className='flex flex-col'>
                                            <span className='font-semibold'>Location:</span>
                                            <span>{workshop.location}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar (Enrollment Component) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <WorkshopEnrollmentCard
                workshop={workshop}
                isEnrolled={isEnrolled}
                onEnroll={handleEnroll}
                enrolling={enrolling}
              />
              {/* Share Button (Optional but adds to premium feel) */}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                variant="outline"
                className="w-full gap-3 h-12 mt-6 border-dashed border-2 border-primary/50 text-primary font-bold hover:bg-primary/5 shadow-md transition-all"
              >
                <Share2 className="w-5 h-5" /> Share this Workshop
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {workshop && (
        <WorkshopRegistrationModal
          open={showRegistrationModal}
          onOpenChange={setShowRegistrationModal}
          workshopId={workshop._id}
          workshopTitle={workshop.title}
          workshopType={workshop.type}
          workshopPrice={workshop.price}
          accessToken={accessToken || ""}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default WorkshopDetail;
