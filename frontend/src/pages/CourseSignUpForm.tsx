

import React, { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
    Loader2,
    CreditCard,
    Search,
    ChevronDown,
    User,
    Mail,
    Lock,
    Phone,
    GraduationCap,
    MapPin,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import logo from "../assets/logo2.png";
import axiosInstance from "@/service/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// --- CONSTANTS ---
// Kept as-is for stability
export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

export const BATCHES = [
    "January 2025", "February 2025", "March 2025", "April 2025", "May 2025",
    "June 2025", "July 2025", "August 2    025", "September 2025", "October 2025",
    "November 2025", "December 2025",
];

// --- INTERFACES ---
interface EnrollmentFormFields {
    fullName: string;
    email: string;
    contactNo: string;
    batch: string;
    state: string;
    college: string;
}

interface CourseSignUpFormProps {
    courseName?: string;
    courseId?: string
    onSuccess: () => void;
}

// --- CUSTOM SELECT (Memoized for performance) ---
const CustomSelect = React.memo(({
    field,
    items,
    search,
    setSearch,
    placeholder,
    error,
    Icon,
}: {
    field: any;
    items: string[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    error: any;
    Icon: React.ElementType;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const handleSelect = useCallback((value: string) => {
        field.onChange(value);
        setIsOpen(false);
        setSearch("");
    }, [field, setSearch]);

    // Use useEffect to manage outside click logic
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Optimized filtering: only runs when search text changes
    const filteredItems = useMemo(() => {
        if (!search) return items;
        return items.filter((item) =>
            item.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-sm bg-background transition-all
         ${error ? "border-destructive ring-1 ring-destructive" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/20"}`}
            >
                <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className={`${field.value ? "text-foreground" : "text-muted-foreground"}`}>
                        {field.value || placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-xl border border-border bg-card shadow-xl z-20 max-h-64 overflow-hidden">
                    <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-56">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => handleSelect(item)}
                                    className={`px-4 py-2 text-sm cursor-pointer ${field.value === item
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "hover:bg-muted text-foreground"
                                        }`}
                                >
                                    {item}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
        </div>
    );
});

// --- MAIN FORM (Memoized for performance) ---
const CourseSignUpForm: React.FC<CourseSignUpFormProps> = React.memo(({
    courseName,
    courseId,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stateSearch, setStateSearch] = useState("");
    const [batchSearch, setBatchSearch] = useState("");

    // Get course data from Navbar state
    const courseData = location.state || {};
    const actualCourseId = courseId || courseData.courseId;
    const actualCourseName = courseName || courseData.courseName || "Course";

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EnrollmentFormFields>();

    // Optimize: Memoize filtering logic
    const filteredStates = useMemo(() => INDIAN_STATES.filter((s) =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
    ), [stateSearch]);

    const filteredBatches = useMemo(() => BATCHES.filter((b) =>
        b.toLowerCase().includes(batchSearch.toLowerCase())
    ), [batchSearch]);

    // Optimize: Memoize signup handler
    const handleSignup = useCallback(async (data: EnrollmentFormFields) => {
        const formData = {
            ...data,
            // Ensure contactNumber is consistent for backend use
            contactNumber: data.contactNo
        };

        if (!actualCourseId) {
            toast.error("Enrollment failed: Course ID missing.", { id: "signup" });
            return;
        }

        try {
            setIsSubmitting(true);
            toast.loading(" preparing enrollment...", { id: "signup" });

            // API call to the backend
            const response: any = await axiosInstance.post("auth/personal-info", formData);
            const { enrollmentToken, user, existing } = response.data;

            console.log("📝 API Response:", { enrollmentToken, user, existing });

            if (enrollmentToken && user) {
                localStorage.setItem("enrollmentToken", enrollmentToken);
                localStorage.setItem("enrolledUser", JSON.stringify(user));

                console.log("✅ Token stored in localStorage:", localStorage.getItem("enrollmentToken"));
                console.log("✅ User stored in localStorage:", localStorage.getItem("enrolledUser"));

                if (existing) {
                    toast.success("Welcome back! Redirecting to course enrollment.", { id: "signup" });
                } else {
                    toast.success(" Redirecting to course enrollment.", { id: "signup" });
                }

                onSuccess();

                // Redirect immediately after setting enrollmentToken for the fastest transition
                navigate(`/course-detail/${actualCourseId}?autoEnroll=true`);
            } else {
                console.error("❌ Missing enrollmentToken or user in response:", response.data);
                toast.error("Enrollment failed: Invalid response from server", { id: "signup" });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Submission Failed. Please check your details.", { id: "signup" });
        } finally {
            setIsSubmitting(false);
        }
    }, [actualCourseId, navigate, onSuccess]);

    const inputClass = (error: boolean) =>
        `h-12 w-full rounded-xl border px-4 text-sm font-medium bg-background shadow-sm transition-all
         ${error ? "border-destructive ring-1 ring-destructive" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/20"}`;

    return (
        <>
            <Navbar />
            <div id="custom-toast-area" className="fixed top-4 right-4 z-[100]"></div>

            {/* Form Section */}
            <section className="py-12 bg-background mt-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10"
                    >
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Complete Your Enrollment
                            </h2>
                            {actualCourseName && (
                                <div className="mb-4 inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                                    Enrolling for: **{actualCourseName}**
                                </div>
                            )}
                            <p className="text-muted-foreground">
                                Fill in your details to secure your spot in our program
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div>
                                    <label className="text-sm font-semibold text-foreground">Full Name</label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <input
                                            {...register("fullName", { required: "Full name required" })}
                                            placeholder="Your name"
                                            className={`${inputClass(!!errors.fullName)} pl-9`}
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                                </div>

                                {/* Contact No. */}
                                <div>
                                    <label className="text-sm font-semibold text-foreground">Contact No.</label>
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <input
                                            {...register("contactNo", {
                                                required: "Contact number required",
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: "Enter valid 10-digit number",
                                                },
                                            })}
                                            placeholder="10-digit mobile"
                                            className={`${inputClass(!!errors.contactNo)} pl-9`}
                                        />
                                    </div>
                                    {errors.contactNo && <p className="text-xs text-destructive mt-1">{errors.contactNo.message}</p>}
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="text-sm font-semibold text-foreground">
                                    Email Address
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                        placeholder="your@email.com"
                                        className={`${inputClass(!!errors.email)} pl-9`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                {/* Batch */}
                                <div>
                                    <label className="text-sm font-semibold text-foreground">
                                        Batch / Year
                                    </label>
                                    <Controller
                                        name="batch"
                                        control={control}
                                        rules={{ required: "Batch required" }}
                                        render={({ field }) => (
                                            <CustomSelect
                                                field={field}
                                                items={BATCHES} // Pass the original list
                                                search={batchSearch}
                                                setSearch={setBatchSearch}
                                                placeholder="Select batch"
                                                error={errors.batch}
                                                Icon={GraduationCap}
                                            />
                                        )}
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label className="text-sm font-semibold text-foreground">
                                        State / UT
                                    </label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        rules={{ required: "State required" }}
                                        render={({ field }) => (
                                            <CustomSelect
                                                field={field}
                                                items={INDIAN_STATES} // Pass the original list
                                                search={stateSearch}
                                                setSearch={setStateSearch}
                                                placeholder="Select state"
                                                error={errors.state}
                                                Icon={MapPin}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* College */}
                            <div>
                                <label className="text-sm font-semibold text-foreground">
                                    College / Institution
                                </label>
                                <div className="relative mt-1">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <input
                                        {...register("college", { required: "College required" })}
                                        placeholder="Your institution name"
                                        className={`${inputClass(!!errors.college)} pl-9`}
                                    />
                                </div>
                                {errors.college && <p className="text-xs text-destructive mt-1">{errors.college.message}</p>}
                            </div>

                            <motion.button
                                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full h-12 flex items-center justify-center rounded-xl font-semibold text-primary-foreground text-base transition-all duration-300 shadow-lg relative overflow-hidden
                                ${isSubmitting
                                        ? "bg-primary/70 cursor-not-allowed"
                                        : "bg-primary hover:bg-primary/90 hover:shadow-primary/30"
                                    }`}
                            >
                                {isSubmitting && (
                                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                                )}
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submiting...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        **Proceed to Enrollment**
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Why Choose Shell E-learning Academy?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of successful learners who have transformed their careers with our expert-led programs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Expert Instructors</h3>
                            <p className="text-muted-foreground">Learn from industry professionals with years of real-world experience</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Recognized Certification</h3>
                            <p className="text-muted-foreground">Earn certificates that are valued by top employers worldwide</p>
                        </div>

                        <div className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Career Support</h3>
                            <p className="text-muted-foreground">Get job placement assistance and career guidance from our team</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
});

export default CourseSignUpForm;