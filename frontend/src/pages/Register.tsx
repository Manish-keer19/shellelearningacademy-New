import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
// Assuming you have a register service method
// import { authService } from "@/service/auth.service"; 
// import { registerStart, registerSuccess, registerFailure } from "@/store/authSlice"; // Example Redux actions
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import logo from "../assets/logo1.png";

// Interface for form data
interface RegisterForm {
    fullName: string;
    email: string;
    password: string;
    contactNumber: string;
}

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Keeping dispatch for future Redux integration
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        // --- Placeholder for Registration Logic ---
        console.log("Registration Data:", data);
        
        try {
            // dispatch(registerStart()); // Uncomment when integrating Redux
            
            // Placeholder: Replace with actual authService.register call
            // const response = await authService.register({ 
            //     fullName: data.fullName,
            //     email: data.email, 
            //     password: data.password,
            //     contactNumber: data.contactNumber
            // });
            
            // Placeholder for successful registration (Simulated)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            // const { token, user } = response;
            // dispatch(registerSuccess({ token, user })); // Uncomment when integrating Redux
            
            toast.success("Registration successful! Please sign in. 🎉");
            navigate("/auth/login"); // Navigate to login after successful registration
        } catch (error: any) {
            // dispatch(registerFailure()); // Uncomment when integrating Redux
            const message = error?.response?.data?.message || "Registration failed. Please try again.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            {/* Subtle background pattern/overlay */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(#4C7C33 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            
            <Card className="w-full max-w-md p-6 sm:p-8 backdrop-blur-sm bg-card/90 border border-border/70 shadow-2xl shadow-primary/10 relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center gap-3 mb-4">
                        <img src={logo} alt="Shell E-learning Academy Logo" className="h-16 w-16 object-contain" />
                        <span className="text-4xl font-extrabold text-foreground leading-none">
                            <span className="text-primary">Shell</span> Academy
                        </span>
                    </Link>
                    <h2 className="text-xl font-bold text-foreground">Create Your Account</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Join us today! Fill out the form below.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                {...register("fullName", {
                                    required: "Full Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Full Name must be at least 3 characters"
                                    }
                                })}
                                className={`pl-10 h-11 transition-all ${errors.fullName ? "border-destructive ring-destructive/50" : "focus:ring-primary focus:border-primary"}`}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-xs text-destructive font-medium">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={`pl-10 h-11 transition-all ${errors.email ? "border-destructive ring-destructive/50" : "focus:ring-primary focus:border-primary"}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6, // Increased minimum length for better security
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                className={`pl-10 h-11 transition-all ${errors.password ? "border-destructive ring-destructive/50" : "focus:ring-primary focus:border-primary"}`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                        )}
                    </div>
                    
                    {/* Contact Number Input */}
                    <div className="space-y-2">
                        <Label htmlFor="contactNumber" className="text-sm font-semibold">Contact Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="contactNumber"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                {...register("contactNumber", {
                                    required: "Contact Number is required",
                                    pattern: {
                                        // Simple regex for numbers and optional international formatting
                                        value: /^\+?[0-9\s-()]{7,20}$/,
                                        message: "Invalid contact number format"
                                    }
                                })}
                                className={`pl-10 h-11 transition-all ${errors.contactNumber ? "border-destructive ring-destructive/50" : "focus:ring-primary focus:border-primary"}`}
                            />
                        </div>
                        {errors.contactNumber && (
                            <p className="text-xs text-destructive font-medium">{errors.contactNumber.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 transition-all duration-300 mt-6" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>
                
                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/auth" className="font-semibold text-primary hover:text-primary/80 transition-colors underline">
                        Sign in here
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;