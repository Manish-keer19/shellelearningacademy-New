import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Briefcase, Zap, GraduationCap, Shield, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
    const services = [
        {
            icon: BookOpen,
            title: "Professional E-Learning Courses",
            description: "Gain job-ready skills through practical, industry-based learning programs designed for real-world success.",
            features: [
                "Digital Marketing",
                "AI for Marketing", 
                "Stock Market & Financial Investment",
                "Data Analytics with Power BI",
                "UI/UX & Graphic Design"
            ]
        },
        {
            icon: Users,
            title: "Live Mentorship & Career Guidance",
            description: "Every learner receives personalized mentorship from industry professionals to build a confident career path.",
            features: [
                "One-on-one mentorship sessions",
                "Career roadmap planning",
                "Interview preparation guidance"
            ]
        },
        {
            icon: Briefcase,
            title: "Internship & Placement Assistance",
            description: "We connect students with real industry projects and internship opportunities to gain professional experience.",
            features: [
                "Internship programs with partner companies",
                "Resume and portfolio support",
                "Placement training and guidance"
            ]
        },
        {
            icon: Zap,
            title: "Corporate Training Solutions",
            description: "Customized digital skill training programs designed for companies and professionals to enhance team performance.",
            features: [
                "Corporate workshops and webinars",
                "Skill development for employees",
                "Project-based learning modules"
            ]
        },
        {
            icon: GraduationCap,
            title: "College & Institutional Partnerships",
            description: "We collaborate with colleges and educational institutions to make digital learning more accessible.",
            features: [
                "Campus certification programs",
                "Student skill development initiatives",
                "Expert-led seminars and lectures"
            ]
        },
        {
            icon: Shield,
            title: "24×7 Support & Lifetime Access",
            description: "All students receive lifetime access to learning materials and 24×7 academic support through our online portal.",
            features: [
                "Lifetime course access",
                "24/7 technical support",
                "Community forum access"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
                
                {/* Background using theme vars */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
                
                {/* Floating geometric shapes (Kept original logic, using theme colors) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full animate-pulse opacity-50" />
                    <div className="absolute top-1/2 left-10 w-40 h-40 bg-muted/20 rounded-full animate-bounce delay-1000 opacity-30" />
                    <div className="absolute bottom-20 right-20 w-60 h-60 bg-secondary/30 rounded-full animate-ping opacity-20" />
                </div>

                <div className="container relative mx-auto px-4 py-8 md:py-12 lg:py-16 xl:py-20 max-w-7xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-16 pt-12">
                        <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                            Our <span className="text-primary">Services</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            Comprehensive solutions to help you thrive in the digital world with expert-led programs and lifetime support.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/70 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 group"
                                >
                                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 transition-colors">
                                        <Icon className="h-8 w-8 text-primary group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h3 className="font-bold text-2xl mb-4 text-foreground">{service.title}</h3>
                                    <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    
                                    {/* Features List */}
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-sm text-foreground/90 font-medium">
                                                <Star className="h-4 w-4 text-primary fill-primary/30 mr-3 mt-0.5 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Action Button */}
                                    {/* <Link to="/contact">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-11 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Learn More
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300" />
                                        </Button>
                                    </Link> */}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Section (Refined Card Style) */}
                    {/* <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-border/70 shadow-primary/10">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
                                <Target className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                            Let's discuss how we can help transform your career with our expert-led programs and lifetime support.
                        </p>
                        <Button 
                            size="lg" 
                            className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 font-bold text-lg shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.03]"
                        >
                            Schedule a Consultation
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div> */}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Services;