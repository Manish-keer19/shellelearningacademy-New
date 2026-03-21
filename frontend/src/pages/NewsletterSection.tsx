import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
    // State to handle email input (optional, but good practice)
    const [email, setEmail] = useState("");
    
    // Handler for subscription action (placeholder)
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            console.log("Subscribing email:", email);
            // Add your API call/form submission logic here
            alert(`Thank you for subscribing, ${email}!`);
            setEmail("");
        }
    };

    return (
        // Section Container with vertical padding
        <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Main CTA Card: Uses a subtle primary background with strong rounding and shadow */}
                <div className="max-w-4xl mx-auto text-center rounded-[2rem] p-8 sm:p-12 lg:p-16 
                                bg-primary/5 dark:bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10">
                    
                    {/* Title and Subtitle */}
                    <div className="mb-6">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                            Stay Updated with New Courses! 🚀
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Subscribe to our newsletter and be the first to know about new course launches, exclusive offers, and expert learning tips.
                        </p>
                    </div>

                    {/* Email Signup Form */}
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-4">
                        <div className="relative flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70" />
                            <Input
                                type="email"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-14 text-base bg-card border-border focus:border-primary focus-visible:ring-primary/50 shadow-inner rounded-xl transition-all duration-300"
                                required
                            />
                        </div>
                        <Button 
                            type="submit"
                            className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                        >
                            Subscribe Now
                        </Button>
                    </form>

                    {/* Footer Text / Social Proof */}
                    <p className="text-sm text-primary font-medium">
                        Join 500+ successful learners already subscribed. We respect your privacy.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;