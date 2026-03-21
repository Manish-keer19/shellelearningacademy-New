import React from "react";
import { User, Award, Clock, BookOpen, Users, Zap, CheckCircle } from "lucide-react";

// --- Feature data (Kept for reference, slightly modified description for clarity) ---
const features = [
    {
        id: 1,
        title: "Expert-Led Courses",
        description: "Learn directly from industry professionals with years of verifiable, real-world experience.",
        icon: BookOpen,
    },
    {
        id: 2,
        title: "Thriving Community Support",
        description: "Join a supportive network of global learners, mentors, and alumni to accelerate your growth.",
        icon: Users,
    },
    {
        id: 3,
        title: "Recognized Certification",
        description: "Earn accredited program certifications that significantly boost your career prospects and visibility.",
        icon: Award,
    },
    {
        id: 4,
        title: "Hands-On Portfolio Projects",
        description: "Build a robust portfolio through practical, real-world projects showcased to potential employers.",
        icon: Zap,
    },
];

// --- Sub-Component for Comprehensive List ---
const ComprehensiveList = ({ description }) => {
    // Splitting the long description into individual points based on the structure provided
    const points = description.split('.,').map(p => p.trim()).filter(p => p.length > 5);
    
    // Fallback/refinement for the list structure
    const structuredPoints = [
        "Practical, project-based learning",
        "Live sessions with industry experts",
        "Dual certification programs",
        "Job & internship assistance",
        "Affordable, high-value learning",
    ];

    return (
        <div className="mt-6 p-4 md:p-6 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 shadow-inner">
            <h4 className="text-xl font-bold text-primary mb-3">Our Commitment:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {structuredPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm font-medium text-foreground">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="leading-snug text-muted-foreground">{point}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
const WhyChooseShell = () => {
    return (
        // Added a distinct section background
        <section className="py-20 bg-muted/20 dark:bg-background/50 border-t border-b border-border">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header and Description */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 font-display text-4xl font-extrabold sm:text-5xl text-foreground">
                        Why Choose <span className="text-primary">Shell E-Learning Academy?</span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                        We don't just teach — we help you **build your future**. Discover the core advantages that set us apart from the rest.
                    </p>
                </div>
                
                {/* Main Features Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group rounded-3xl bg-card p-8 border border-border/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                        >
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20 group-hover:ring-4 group-hover:ring-primary/20">
                                <feature.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <h3 className="mb-3 font-display text-xl font-bold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Comprehensive Commitment Callout */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <ComprehensiveList 
                        description={"Practical, project-based learning, Live sessions with industry experts, Dual certification programs, Job & internship assistance, Affordable, high-value learning."}
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyChooseShell;