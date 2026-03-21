import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
// NOTE: Adjust the paths below to match your project's component structure
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Star,
  Check,
  Play,
  Download,
  Loader2,
  ShieldCheck,
  Users,
  ArrowLeft,
  AlertCircle,
  ChevronDown,
  Clock,
  MessageSquare,
  CheckCircle,
  CreditCard,
  Shield,
  Tag,
  Zap,
  Code,
  BookOpen,
  X,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ====================================================================
// !!! IMPORTANT: Replace these MOCK SERVICES with your REAL API IMPORTS !!!
// ====================================================================
import { courseService } from "@/service/course.service";
import { paymentService } from "@/service/payment.service";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Custom hook for toast notifications
const useCustomToast = () =>
  useMemo(
    () => ({
      showToast: (
        type: "error" | "success" | "info" | "warning",
        title: string,
        description: string,
      ) =>
        toast[type === "error" ? "error" : "success"](description, {
          duration: 3000,
        }),
    }),
    [],
  );

// ====================================================================
// 2. Course Enrollment Card Component (POLISHED UI/UX)
// ====================================================================

interface CourseEnrollmentProps {
  course: any;
  isEnrolled: boolean;
  onEnrollmentSuccess: () => void;
  setIsEnrolledLocally: (status: boolean) => void;
  onDownloadBrochure: () => void;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = React.memo(
  ({
    course,
    isEnrolled,
    onEnrollmentSuccess,
    setIsEnrolledLocally,
    onDownloadBrochure,
  }) => {
    const { user } = useSelector((state: any) => state.auth);
    const { showToast } = useCustomToast();
    const navigate = useNavigate();

    const [enrolling, setEnrolling] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    // Optimize: Use useMemo for initial price calculation
    const initialPrice = useMemo(
      () => course.finalPrice || course.price || course.discountedPrice || 0,
      [course],
    );
    const [finalPrice, setFinalPrice] = useState(initialPrice);

    // Optimize: Read token once and manage updates via a simple state.
    const [enrollmentToken, setenrollmentToken] = useState(
      localStorage.getItem("enrollmentToken"),
    );

    // Ref to track if the payment flow needs to resume after a successful signup/login
    const paymentAttemptRef = React.useRef(false);

    // Optimize: Memoize Razorpay script loading function
    const loadRazorpayScript = useCallback(() => {
      return new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    }, []); // Empty dependency array, function never changes

    const handleApplyCoupon = useCallback(() => {
      // Implementation for coupon logic here
      showToast(
        "info",
        "Feature Disabled",
        "Coupon feature is currently a mock.",
      );
    }, [showToast]);

    const handleRemoveCoupon = useCallback(() => {
      setAppliedCoupon(null);
      setCouponCode("");
      setFinalPrice(initialPrice);
      showToast("info", "Coupon Removed", "Coupon has been removed");
    }, [initialPrice, showToast]);

    // Optimize: Memoize the core handlePayment function
    const handlePayment = useCallback(
      async (tokenOverride: string | null) => {
        const currentToken =
          tokenOverride || localStorage.getItem("enrollmentToken");
        const courseId = course.id;

        // Check if user is logged in
        if (!currentToken) {
          navigate("/personal-info", {
            state: {
              courseName: course.title,
              courseId: course.id,
              price: course.finalPrice || course.price,
            },
          });
          paymentAttemptRef.current = true;
          return;
        }

        // If logged in (currentToken exists), proceed with payment logic
        try {
          setEnrolling(true);

          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            showToast(
              "error",
              "Payment Gateway Error",
              "Failed to load payment gateway. Please try again.",
            );
            return;
          }

          const orderData = await paymentService.capturePayment(
            [course.id],
            currentToken,
          );

          if (!orderData.success) {
            showToast(
              "error",
              "Order Creation Failed",
              orderData.message || "Failed to create order. Please try again.",
            );
            return;
          }

          const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

          const options = {
            key: razorpayKey,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Shell Entertainment",
            description: `Enrollment for ${course.title}`,
            order_id: orderData.orderId,
            handler: async (response: any) => {
              // Payment successful on Razorpay side, now verify it on your server
              try {
                // Show loading during verification
                toast.loading("Verifying your payment, please wait...", {
                  id: "payment-verify",
                });

                const verifyData = await paymentService.verifyPayment(
                  {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    courses: [course.id],
                  },
                  currentToken,
                );

                toast.dismiss("payment-verify");

                if (verifyData.success) {
                  setIsEnrolledLocally(true);
                  onEnrollmentSuccess();

                  // Show success message before redirect
                  showToast(
                    "success",
                    "Payment Successful! 🎉",
                    "Redirecting to confirmation page...",
                  );

                  // Quick redirect for better UX (500ms original, keep it fast)
                  setTimeout(() => {
                    navigate(
                      `/enrollment-success?courseName=${encodeURIComponent(course.title)}&price=${course.finalPrice}&originalPrice=${course.originalPrice}&courseId=${course.id}`,
                    );
                  }, 500); // Optimized delay
                } else {
                  showToast(
                    "error",
                    "Payment Failed",
                    "Payment verification failed. Please contact support.",
                  );
                }
              } catch (error) {
                toast.dismiss("payment-verify");
                showToast(
                  "error",
                  "Verification Error",
                  "Payment verification failed. Please contact support if amount was deducted.",
                );
              }
            },
            theme: { color: "#3B82F6" },
            modal: {
              ondismiss: () =>
                showToast(
                  "warning",
                  "Payment Cancelled",
                  "Payment was cancelled.",
                ),
            },
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (error) {
          showToast(
            "error",
            "Payment Failed",
            "Unable to start payment process. Please try again.",
          );
        } finally {
          setEnrolling(false);
          paymentAttemptRef.current = false;
        }
      },
      [
        course,
        navigate,
        loadRazorpayScript,
        showToast,
        setIsEnrolledLocally,
        onEnrollmentSuccess,
      ],
    );

    // Handle button click, simply calls the main payment handler
    const handlePaymentClick = useCallback(() => {
      handlePayment(enrollmentToken);
    }, [handlePayment, enrollmentToken]);

    // Effect to auto-read token and resume payment (Your Original Logic)
    useEffect(() => {
      const newToken = localStorage.getItem("enrollmentToken");
      // Update local state when token changes in localStorage (e.g., after login/signup redirection)
      if (newToken !== enrollmentToken) {
        setenrollmentToken(newToken);
      }

      // We only check if the enrollmentToken just became available AND a payment attempt was flagged as pending
      if (newToken && paymentAttemptRef.current) {
        // Slight delay to ensure React state updates and the redirect stack is managed
        setTimeout(() => {
          handlePayment(newToken); // Pass the new token directly
        }, 100);
      }
    }, [enrollmentToken, handlePayment]);

    if (user && user.accountType === "Admin") {
      return (
        <Card className="bg-card shadow-2xl h-fit border border-border/70">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-lg font-bold">Admin View</h3>
            <p className="text-sm text-muted-foreground">
              You are viewing this page as an admin.
            </p>
            <Button asChild className="w-full">
              <Link to="/dashboard">Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    // --- MODIFIED: Already Enrolled State (Premium Look) ---
    if (isEnrolled) {
      return (
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-500 h-fit shadow-2xl shadow-indigo-500/30">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                You're Already Enrolled!
              </h3>
              {/* THE MODIFIED TEXT */}
              <p className="text-base text-indigo-700 dark:text-indigo-300 font-semibold">
                Our team will contact you shortly.
              </p>
            </div>
            {course.brochure && (
              <Button
                onClick={onDownloadBrochure}
                variant="outline"
                className="w-full mt-4 border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:text-indigo-200 dark:hover:bg-indigo-800"
              >
                <Download className="w-4 h-4 mr-2" /> Download Brochure
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    // --- Enrollment Card State (Premium Look) ---
    return (
      <Card className="bg-card shadow-2xl h-fit border border-border/70">
        {/* Course Thumbnail */}
        <div className="aspect-video bg-muted relative rounded-t-xl overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/1280x720?text=Course+Thumbnail")
            }
          />
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Price Display */}
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary mb-1 flex items-baseline justify-center gap-3">
              {finalPrice === 0 ? (
                <span className="text-green-500">FREE</span>
              ) : (
                `₹${finalPrice.toLocaleString()}`
              )}
            </div>
            {course.originalPrice > finalPrice && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground line-through">
                  ₹{course.originalPrice.toLocaleString()}
                </span>
                {course.discountPercent > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-sm font-semibold"
                  >
                    SAVE {course.discountPercent}%
                  </Badge>
                )}
              </div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Full, lifetime access | 30-day guarantee
            </p>
          </div>

          <Separator className="my-4" />

          {/* Main Enrollment Button */}
          <Button
            data-testid="enroll-button"
            className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-bold shadow-lg shadow-primary/40 transition-all duration-300 transform hover:scale-[1.01]"
            onClick={handlePaymentClick}
            disabled={enrolling}
          >
            {enrolling ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Secure Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                {`Buy Now - ₹${finalPrice.toLocaleString()}`}
              </>
            )}
          </Button>

          <div className="flex justify-center items-center text-xs text-muted-foreground/70">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
            Secure Checkout by Razorpay
          </div>

          {course.brochure && (
            <Button
              onClick={onDownloadBrochure}
              variant="ghost"
              className="w-full text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Download Brochure</span>
            </Button>
          )}

          <Separator className="my-4" />

          {/* Course Includes List */}
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Course Features
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {course.includes.map((inc: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

// ====================================================================
// 3. Main Course Detail Page Component (CourseDetail - POLISHED UI/UX)
// ====================================================================

const CourseDetail = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const actualUser = useSelector((state: any) => state.auth.user);
  const userString = localStorage.getItem("enrolledUser");
  const user = userString ? JSON.parse(userString) : null;
  console.log("enrolled user is ", user);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const { showToast } = useCustomToast();

  // Optimize: Use useCallback for enrollment check
  const checkEnrollmentStatus = useCallback(
    (courseData: any, userId: string) => {
      console.log("Checking enrollment status for user:", userId, courseData);
      if (!userId) {
        setIsEnrolled(false);
        return;
      }
      // NOTE: Adjusted to check if user.id is present in the studentsEnrolled array.
      // It looks like the API response populates the array with the full user object (or at least its _id).
      // The previous logic was correct, checking if the logged-in user's ID exists in the list of enrolled student IDs.
      const isUserEnrolled =
        courseData.studentsEnrolled?.some((student: any) =>
          student && (typeof student === "string"
            ? student === userId
            : student._id === userId),
        ) || false;
      console.log("Enrollment status:", isUserEnrolled);
      setIsEnrolled(isUserEnrolled);
    },
    [],
  );

  // Optimize: Use useCallback for fetching course details
  const fetchCourseDetails = useCallback(async () => {
    const currentCourseId = courseId;
    if (!currentCourseId) return;

    setIsLoading(true);
    try {
      const response = await courseService.getCourseDetails(currentCourseId);
      const apiData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (!apiData) {
        throw new Error("No course data found in response");
      }

      const mappedCourse = {
        id: apiData._id,
        title: apiData.courseName,
        // Enhanced Description: Use the full description if available, otherwise fallback.
        description: apiData.courseDescription
          ? apiData.courseDescription.replace(/\r\n|\n/g, " ").trim()
          : "Master the core concepts and gain the skills necessary to excel in this field with our expert-led training program.",
        overview:
          apiData.courseOverview ||
          "Detailed course overview is currently unavailable, but the curriculum below covers all essential topics.",
        price: apiData.finalPrice || apiData.originalPrice || 0,
        finalPrice: apiData.finalPrice || apiData.originalPrice || 0, // Ensure finalPrice is present
        originalPrice: apiData.originalPrice || 0,
        discountPercent: apiData.discountPercent || 0,
        thumbnail: apiData.thumbnail,
        brochure: apiData.brochures,
        level: apiData.courseLevel || "All Levels",
        duration: apiData.courseDuration || "Variable",
        category: apiData.category?.name || "General",
        rating: parseFloat(apiData.ratingValue) || 3.4, // Static for presentation

        enrolledCount: parseInt(apiData.studentCount) || 0,

        // Instructor Profile Mapping
        instructorName: apiData.instructor
          ? `${apiData.instructor.firstName} ${apiData.instructor.lastName}`
          : "Expert Instructor",
        instructorAvatar:
          apiData.instructor?.image ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor",
        instructorBio:
          apiData.instructor?.additionalDetails?.about ||
          "An experienced industry professional passionate about teaching and mentoring students to achieve their career goals.",
        whatYouLearn: apiData.whatYouWillLearn
          ? apiData.whatYouWillLearn
              .split(/\r\n|\n/)
              .filter((t: string) => t.trim())
          : [
              "Master the fundamentals of the technology.",
              "Build 3 hands-on projects from scratch.",
              "Understand advanced industry best practices.",
              "Prepare for relevant certification exams.",
            ],
        curriculum:
          apiData.courseContent?.map((section: any, index: number) => ({
            id: section._id || index,
            title: section.sectionName,
            lessons:
              section.subSection?.map((sub: any, subIndex: number) => ({
                title: sub.title,
                description:
                  sub.description &&
                  sub.description.trim() !== "some discription here"
                    ? sub.description
                    : null,
              })) || [],
          })) || [],
        includes: [
          (apiData.courseDuration || "XX") + " of high-quality video content",
          "Full Lifetime Access & Updates",
          "Official Certificate of Completion",
          "Downloadable Project Files & Codebase",
          "Priority Q&A Support",
        ],
        upcomingClasses: apiData.upcomingClasses || [], // Add this line
      };

      setCourse(mappedCourse);
      console.log("api data in fetchcourseDetail", apiData);
      // Pass the API data (which contains studentsEnrolled) and the logged-in user ID
      checkEnrollmentStatus(apiData, user?.id || user?._id);
    } catch (err) {
      console.error("Error fetching course:", err);
      showToast("error", "Error", "Failed to load course details.");
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, user?.id, checkEnrollmentStatus, showToast]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  // Auto-enrollment effect
  useEffect(() => {
    const autoEnroll = searchParams.get("autoEnroll");
    const enrollmentToken = localStorage.getItem("enrollmentToken");

    if (autoEnroll === "true" && enrollmentToken && course && !isEnrolled) {
      setTimeout(() => {
        const enrollButton = document.querySelector(
          '[data-testid="enroll-button"]',
        ) as HTMLButtonElement;
        if (enrollButton) {
          toast.success("Auto-enrolling you in the course...");
          enrollButton.click();
        }
      }, 100);
    }
  }, [course, isEnrolled, searchParams]);

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  const handleDownloadBrochure = useCallback(async () => {
    if (!course?.brochure) {
      showToast("error", "Error", "No brochure available for download.");
      return;
    }

    const toastId = toast.loading("Preparing download...");

    try {
      const response = await fetch(course.brochure);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const sanitizedTitle = (course.title || "course").replace(
        /[^a-zA-Z0-9 _-]/g,
        "",
      );
      link.setAttribute("download", `${sanitizedTitle}_brochure.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);

      toast.success("Download started!", { id: toastId });
    } catch (error) {
      console.error("Brochure download failed:", error);
      toast.error("Could not download the brochure.", { id: toastId });
    }
  }, [course?.brochure, course?.title, showToast]);

  const handleSuccessfulEnrollment = useCallback(() => {
    setIsEnrolled(true);
  }, []);

  // --- Loading and Error States ---
  if (isLoading)
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-primary/20 rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Loading Course Details
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the course information...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 ">
        <Navbar />
        <div className="text-center p-10 bg-card rounded-xl shadow-lg mt-20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold">Course Not Found</h2>
          <p className="text-muted-foreground">
            The requested course details could not be loaded or do not exist.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/all-courses">← Back to All Courses</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-background mt-16">
      <Navbar />

      {/* HERO SECTION - Visually impactful, spans full width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary/5 dark:bg-card border-b border-border/70 py-10 lg:py-16"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-4">
            <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
              <Link
                to="/all-courses"
                className="hover:text-primary transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Courses
              </Link>
              <span>/</span>
              <Badge variant="secondary" className="text-xs font-semibold">
                {course.category}
              </Badge>
            </div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight break-words"
            >
              {course.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm md:text-base text-muted-foreground max-w-3xl pt-2"
            >
              {course.description}
            </motion.p>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 text-sm font-semibold">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span> {course.rating} Rating </span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                <span> {course.enrolledCount} Students</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span> {course.level} Level</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. What You'll Learn (Card emphasized) */}
            {course.whatYouLearn.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="border-primary/20 bg-card shadow-lg">
                  <CardHeader className="p-5 border-b border-border/70">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-6 h-6" /> Key Skills & Mastery
                      Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.whatYouLearn.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/70 text-sm font-medium hover:shadow-md transition-shadow"
                        >
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Separator />

            {/* 2. Course Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-primary pl-4">
                Course Overview
              </h3>
              <div className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {course.overview}
              </div>
            </motion.div>

            <Separator />

            {/* NEW: Upcoming Classes Section */}

            {/* 3. Curriculum / Content (Accordion Style) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-primary pl-4">
                Detailed Curriculum
              </h3>
              <div className="space-y-4">
                {course.curriculum.map((section: any, idx: number) => {
                  const isOpen = expandedSections.has(idx);
                  const totalLessons = section.lessons.length;
                  return (
                    <div
                      key={section.id}
                      className="border border-border/70 rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleSection(idx)}
                        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronDown
                            className={`w-5 h-5 transition-transform text-primary shrink-0 ${isOpen ? "rotate-180" : ""}`}
                          />
                          <span className="text-lg font-semibold text-foreground text-left">
                            {section.title}
                          </span>
                        </div>
                        {/* <Badge variant="outline" className="text-sm font-medium bg-muted/70 px-3 py-1 ml-auto shrink-0">{totalLessons} Lectures</Badge> */}
                      </button>

                      {isOpen && (
                        <div className="border-t bg-muted/20 divide-y divide-border/50">
                          {totalLessons > 0 ? (
                            section.lessons.map((lesson: any, lIdx: number) => (
                              <div
                                key={lIdx}
                                className="p-3 pl-12 flex items-start gap-3 text-sm transition-colors"
                              >
                                <Code className="w-4 h-4 text-secondary-foreground/70 shrink-0 mt-1" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">
                                    {lesson.title}
                                  </span>
                                  {lesson.description && (
                                    <span className="text-xs text-muted-foreground italic mt-0.5">
                                      {lesson.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No content has been added to this section yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* 4. Instructor Section */}
            {/* <div>
                            <h3 className="text-2xl font-bold mb-5 text-foreground border-l-4 border-primary pl-4">Meet Your Instructor</h3>
                            <div className="bg-card border border-border/70 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-sm hover:shadow-md transition-all">
                                <div className="shrink-0">
                                    <img
                                        src={course.instructorAvatar}
                                        alt={course.instructorName}
                                        loading="lazy"
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/10 shadow-sm"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-3">
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">{course.instructorName}</h4>
                                        <p className="text-sm text-primary font-medium">Course Instructor</p>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {course.instructorBio}
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                            <Users className="w-3 h-3" /> 1,200+ Students
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                            <Play className="w-3 h-3" /> 15 Courses
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar (Enrollment Component & Download) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sticky top-24 space-y-8"
            >
              {/* Enrollment Card */}
              <CourseEnrollment
                course={course}
                isEnrolled={isEnrolled}
                onEnrollmentSuccess={handleSuccessfulEnrollment}
                setIsEnrolledLocally={setIsEnrolled}
                onDownloadBrochure={handleDownloadBrochure}
              />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
