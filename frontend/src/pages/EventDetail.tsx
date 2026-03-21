import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Video,
    CheckCircle,
    ArrowLeft,
    Share2,
    CreditCard,
    Smartphone,
    Mail,
    User
} from "lucide-react";

// Import images
import eventBannerAi from "@/assets/event_banner_ai.png";
import mentor1 from "@/assets/mentor_1.png";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

    // Mock Data (In a real app, fetch based on ID)
    const event = {
        id: id,
        title: "AI Tools Masterclass for Beginners",
        mentor: "Dr. Sarah Johnson",
        mentorRole: "AI Research Scientist",
        mentorImage: mentor1,
        date: "Oct 15, 2023",
        time: "10:00 AM - 12:00 PM",
        duration: "2 Hours",
        mode: "Online",
        type: "Free",
        price: "Free",
        image: eventBannerAi,
        description: "Unlock the power of Artificial Intelligence in this comprehensive masterclass designed for beginners. We will cover the latest tools, ethical considerations, and practical applications that can boost your productivity immediately.",
        whatYouWillLearn: [
            "Understanding Generative AI fundamentals",
            "Hands-on with ChatGPT, Midjourney, and Claude",
            "Prompt Engineering best practices",
            "Integrating AI into your daily workflow",
            "Future trends in AI technology"
        ],
        whoShouldAttend: [
            "Students interested in tech",
            "Professionals looking to upskill",
            "Content Creators",
            "Business Owners"
        ],
        certification: true
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsRegistered(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/events')}
                    className="mb-6 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN - Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Banner Image */}
                        <div className="rounded-[24px] overflow-hidden shadow-xl border border-border/50 relative">
                            <img src={event.image} alt={event.title} className="w-full h-[400px] object-cover" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-white/90 text-foreground backdrop-blur-md shadow-sm hover:bg-white">{event.mode}</Badge>
                                {event.certification && (
                                    <Badge className="bg-green-500/90 text-white backdrop-blur-md shadow-sm border-none">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Certification Included
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Title and Meta */}
                        <div>
                            <h1 className="text-4xl font-extrabold text-foreground mb-4 leading-tight">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-muted-foreground text-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{event.time} ({event.duration})</span>
                                </div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <Card className="bg-secondary/20 border-none shadow-inner">
                            <CardContent className="p-6 flex items-center gap-4">
                                <img src={event.mentorImage} alt={event.mentor} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Hosted By</p>
                                    <p className="text-xl font-bold text-foreground">{event.mentor}</p>
                                    <p className="text-primary font-medium">{event.mentorRole}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">About the Event</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* What You Will Learn */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">What You Will Learn</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.whatYouWillLearn.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Who Should Attend */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">Who Should Attend?</h3>
                            <div className="flex flex-wrap gap-3">
                                {event.whoShouldAttend.map((item, index) => (
                                    <Badge key={index} variant="secondary" className="px-4 py-2 text-base rounded-full bg-secondary/50 text-foreground">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Registration */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <Card className="border-primary/20 shadow-2xl overflow-hidden">
                                <div className="h-2 bg-primary w-full" />
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl font-bold">Register for this Workshop</CardTitle>
                                    <CardDescription>Secure your spot now. Limited seats available.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {isRegistered ? (
                                        <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                <CheckCircle className="w-10 h-10 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground">Registration Complete!</h3>
                                            <p className="text-muted-foreground">Check your email for the joining link and details.</p>
                                            <Button className="w-full" onClick={() => setIsRegistered(false)}>Register Another</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                    <Input id="name" placeholder="John Doe" className="pl-10" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                    <Input id="email" type="email" placeholder="john@example.com" className="pl-10" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Smartphone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                    <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" required />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-border">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-muted-foreground font-medium">Total Fee</span>
                                                    <span className="text-3xl font-bold text-primary">{event.price}</span>
                                                </div>

                                                <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/25">
                                                    Complete Registration
                                                </Button>

                                                {event.type === 'Paid' && (
                                                    <div className="flex justify-center gap-4 mt-4 text-muted-foreground">
                                                        <CreditCard className="w-5 h-5" />
                                                        <span className="text-xs">Secure Payment via Stripe/Razorpay</span>
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-secondary/30 p-4 justify-center">
                                    <Button variant="link" className="text-muted-foreground hover:text-primary gap-2">
                                        <Share2 className="w-4 h-4" /> Share this event
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export { EventDetail };
