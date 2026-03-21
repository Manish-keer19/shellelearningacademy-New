import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPopupData } from "@/service/popup.service"; // Placeholder service
import toast from "react-hot-toast";
import { MessageSquareText, X, Loader2 } from "lucide-react";

// --- 1. Zod Schema for Form Validation ---
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  college: z.string().min(2, {
    message: "College name must be at least 2 characters.",
  }),
  batch: z.string().min(4, {
    message: "Batch must be at least 4 characters.",
  }),
});

// --- 2. Popup Component ---
const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);

  // --- Show Popup Timer (after 10 seconds) ---
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    const nexaLeadCaptured = localStorage.getItem("nexaLeadCaptured");

    // Don't show popup if user has already seen it OR if Nexa lead form is being shown/captured
    if (!hasSeenPopup && !nexaLeadCaptured) {
      const timer = setTimeout(() => {
        // Double-check before showing (in case Nexa form was shown during the timeout)
        const nexaLeadCheck = localStorage.getItem("nexaLeadCaptured");
        if (!nexaLeadCheck) {
          setShowPopup(true);
          localStorage.setItem("hasSeenPopup", "true");
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // --- UX Improvement: Disable background scrolling when modal is open ---
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to restore scrolling on unmount or state change
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  // --- React Hook Form Setup ---
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      college: "",
      batch: "",
    },
  });

  // --- Submission Handler ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Replace with actual API call:
      // await createPopupData(values); 
      console.log("Form Data Submitted:", values);

      toast.success("Thank you! We've received your details!");
      setShowPopup(false);
      localStorage.setItem("hasSeenPopup", "true");
      // Also set nexaLeadCaptured to prevent Nexa lead form from showing
      localStorage.setItem("nexaLeadCaptured", "true");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  // --- Render nothing if popup is not showing ---
  if (!showPopup) {
    return null;
  }

  // --- 3. Rendered JSX (Responsive UI/UX) ---
  return (
    // Backdrop: High Z-index, blurred background, padding for mobile edges
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 sm:p-0">

      {/* Modal Container: Modern Card Style, Max height/Scrollable for Mobile */}
      <div className="
        bg-card p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md 
        transition-all duration-300 transform scale-100 opacity-100 
        max-h-[90vh] overflow-y-auto 
      ">

        {/* Header Section: Sticky for better mobile scroll UX */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/70 sticky top-0 bg-card z-10">
          <div className="flex items-center space-x-2">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Get in Touch
            </h2>
          </div>

          {/* Close Button: Styled consistently with Navigation */}
          <Button
            onClick={() => {
              setShowPopup(false);
              localStorage.setItem("hasSeenPopup", "true");
              localStorage.setItem("nexaLeadCaptured", "true");
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Fill in your details to get early access and updates.
        </p>

        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Input Field: Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Jane Doe"
                      className="h-10 bg-background border border-border rounded-lg focus-visible:ring-primary focus-visible:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Input Field: Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      className="h-10 bg-background border border-border rounded-lg focus-visible:ring-primary focus-visible:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Input Field: Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 9876543210"
                      type="tel"
                      className="h-10 bg-background border border-border rounded-lg focus-visible:ring-primary focus-visible:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Input Field: College */}
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">College / Organization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., XYZ University"
                      className="h-10 bg-background border border-border rounded-lg focus-visible:ring-primary focus-visible:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Input Field: Batch */}
            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Batch / Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 2024"
                      className="h-10 bg-background border border-border rounded-lg focus-visible:ring-primary focus-visible:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Submit Button: Prominent CTA Style */}
            <Button
              type="submit"
              className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2 font-bold shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.01]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Popup;