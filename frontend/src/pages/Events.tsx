import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Video,
    Search,
    ArrowRight,
    CheckCircle,
    Star,
    Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import images (assuming they are in assets, otherwise using placeholders if copy failed)
import heroImage from "@/assets/hero_event.png";
import eventBannerAi from "@/assets/event_banner_ai.png";
import mentor1 from "@/assets/mentor_1.png";
import featuredEventBanner from "@/assets/featured_event.png";

const Events = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");

    const categories = ["All", "Free", "Paid", "Certification", "Live", "Recorded"];

    // Mock Data
    const events = [
        {
            id: 1,
            title: "AI Tools Masterclass for Beginners",
            mentor: "Dr. Sarah Johnson",
            mentorRole: "AI Research Scientist",
            mentorImage: mentor1,
            date: "Oct 15, 2023",
            time: "10:00 AM - 12:00 PM",
            mode: "Online",
            type: "Free",
            price: "Free",
            image: eventBannerAi,
            description: "Learn the fundamentals of AI tools and how to leverage them for productivity.",
            spots: "Limited Seats",
        },
        {
            id: 2,
            title: "Full Stack Web Development Bootcamp",
            mentor: "Michael Chen",
            mentorRole: "Senior Tech Lead",
            mentorImage: mentor1, // Reusing for demo
            date: "Nov 05, 2023",
            time: "09:00 AM - 04:00 PM",
            mode: "Hybrid",
            type: "Paid",
            price: "₹999",
            image: eventBannerAi, // Reusing for demo
            description: "Intensive one-day bootcamp covering React, Node.js, and modern deployment.",
            spots: "Filling Fast",
        },
        {
            id: 3,
            title: "Data Science Career Roadmap",
            mentor: "Priya Patel",
            mentorRole: "Data Analyst @ Google",
            mentorImage: mentor1, // Reusing for demo
            date: "Oct 22, 2023",
            time: "06:00 PM - 07:30 PM",
            mode: "Online",
            type: "Free",
            price: "Free",
            image: eventBannerAi, // Reusing for demo
            description: "Chart your path in Data Science with expert guidance and industry insights.",
            spots: "Open",
        },
        {
            id: 4,
            title: "UI/UX Design Principles Workshop",
            mentor: "Alex Turner",
            mentorRole: "Product Designer",
            mentorImage: mentor1, // Reusing for demo
            date: "Nov 12, 2023",
            time: "11:00 AM - 02:00 PM",
            mode: "Offline",
            type: "Paid",
            price: "₹499",
            image: eventBannerAi, // Reusing for demo
            description: "Hands-on workshop on creating user-centric designs and prototypes.",
            spots: "Few Left",
        },
    ];

    const filteredEvents = filter === "All"
        ? events
        : events.filter(event => event.type === filter || event.mode === filter || (filter === "Certification" && event.type === "Paid")); // Simplified logic

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            {/* SECTION 1 - HERO SECTION */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                {/* Soft Green Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e5f1df] via-[#dfeeda] to-background -z-10" />

                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left space-y-6">
                            <Badge className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold rounded-full border border-primary/20">
                                🚀 Elevate Your Skills
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                                Upcoming <span className="text-primary">Events & Workshops</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Join our expert-led sessions and upgrade your digital skills. Connect with industry leaders and like-minded learners.
                            </p>

                            {/* Category Filter Bar */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${filter === cat
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 transform -translate-y-0.5"
                                                : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image with Floating Badges */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                                <img
                                    src={heroImage}
                                    alt="Students attending a workshop"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-green-100 animate-bounce-slow hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold">Verified</p>
                                        <p className="text-sm font-bold text-foreground">Certification Included</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-green-100 animate-pulse-slow hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Star className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold">Top Rated</p>
                                        <p className="text-sm font-bold text-foreground">Premium Sessions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2 - EVENTS GRID */}
            <div className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Explore Opportunities</h2>
                            <p className="text-muted-foreground">Find the perfect workshop to boost your career.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <Button variant="outline" className="rounded-full gap-2">
                                <Filter className="w-4 h-4" /> Filter
                            </Button>
                            <Button variant="outline" className="rounded-full gap-2">
                                <Calendar className="w-4 h-4" /> Calendar View
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="group border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 rounded-[24px] overflow-hidden flex flex-col h-full"
                            >
                                {/* Card Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className={`
                      px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md
                      ${event.type === 'Free' ? 'bg-green-500/90 text-white' : 'bg-blue-600/90 text-white'}
                    `}>
                                            {event.type}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-md text-xs font-semibold shadow-sm">
                                            {event.spots}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-6 flex-grow">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                                            <Calendar className="w-3.5 h-3.5" /> {event.date}
                                        </span>
                                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                                            <Clock className="w-3.5 h-3.5" /> {event.time}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center gap-3 pt-2 border-t border-border/50 mt-auto">
                                        <img
                                            src={event.mentorImage}
                                            alt={event.mentor}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{event.mentor}</p>
                                            <p className="text-xs text-muted-foreground">{event.mentorRole}</p>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-0 flex items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground font-medium">Fee</span>
                                        <span className={`text-lg font-bold ${event.price === 'Free' ? 'text-green-600' : 'text-foreground'}`}>
                                            {event.price}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex-1"
                                    >
                                        Register Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3 - FEATURED EVENT HIGHLIGHT */}
            <div className="py-16 bg-gradient-to-r from-[#e5f1df] to-[#d0e8f2]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex-1 space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                                Featured Workshop of the Month
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                                Mastering Cloud Computing with AWS
                            </h2>
                            <div className="flex flex-wrap gap-6 text-lg text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>Nov 25, 2023</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Video className="w-5 h-5 text-primary" />
                                    <span>Live Online</span>
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Join this exclusive deep-dive session into AWS architecture. Perfect for developers looking to scale their applications. Includes hands-on labs and a completion certificate.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Button size="lg" className="rounded-full px-8 text-lg shadow-xl shadow-primary/25">
                                    Book Your Seat
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg border-primary/30 hover:bg-primary/5">
                                    View Syllabus
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={featuredEventBanner}
                                    alt="Featured Event Speaker"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                    <p className="font-bold text-lg">Hosted by David Kim</p>
                                    <p className="text-sm opacity-80">Senior Cloud Architect</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 5 - PAST EVENTS (Optional) */}
            <div className="py-20 bg-background border-t border-border/50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-foreground">Past Events</h2>
                        <Button variant="ghost" className="text-primary hover:text-primary/80">
                            View All Archive <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="flex overflow-x-auto pb-8 gap-6 snap-x scrollbar-hide">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[300px] md:min-w-[350px] snap-center">
                                <Card className="opacity-80 hover:opacity-100 transition-opacity bg-muted/30 border-dashed border-border">
                                    <div className="relative h-40 bg-muted rounded-t-lg overflow-hidden grayscale">
                                        <img src={eventBannerAi} alt="Past Event" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Badge variant="secondary" className="bg-black/50 text-white border-none">Completed</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-bold text-lg mb-1">Intro to Python Programming</h4>
                                        <p className="text-sm text-muted-foreground">Held on Sep 10, 2023</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button variant="outline" size="sm" className="w-full">Watch Recording</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export { Events };