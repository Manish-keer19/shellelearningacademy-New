import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { authService } from "@/service/auth.service";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock } from "lucide-react";
import logo from "../assets/logo1.png";

// Interface for form data
interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

const Auth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            dispatch(loginStart());
            const response = await authService.login({
                email: data.email,
                password: data.password
            });
            const { accessToken, user } = response;

            // Note: If data.rememberMe is true, you might store the accessToken/user data in localStorage
            // Otherwise, typically sessionStorage is used for session-based login.

            dispatch(loginSuccess({ accessToken, user }));

            toast.success("Signed in successfully! Welcome back. 👋");

            // Role-based redirection
            if (user.accountType === "Employee") {
                navigate("/ems/leads");
            } else if (user.accountType === "Manager" || user.accountType === "Super Admin") {
                navigate("/ems");
            } else {
                navigate("/");
            }

        } catch (error: any) {
            dispatch(loginFailure());
            const message = error?.response?.data?.message || "Login failed. Please check your email and password.";
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
                    <h2 className="text-xl font-bold text-foreground">Sign In to Your Account</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Welcome back! Enter your credentials below.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {/* <div className="flex justify-between items-center">
                             <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                             <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors hover:underline">
                                Forgot password?
                            </Link>
                        </div> */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 3,
                                        message: "Password must be at least 3 characters"
                                    }
                                })}
                                className={`pl-10 h-11 transition-all ${errors.password ? "border-destructive ring-destructive/50" : "focus:ring-primary focus:border-primary"}`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            <input
                                type="checkbox"
                                className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-primary/50 checked:bg-primary/90"
                                {...register("rememberMe")}
                            />
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 transition-all duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                {/* Registration Link */}
                {/* <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="font-semibold text-primary hover:text-primary/80 transition-colors underline">
                        Sign up here
                    </Link>
                </p> */}
            </Card>
        </div>
    );
};

export default Auth;