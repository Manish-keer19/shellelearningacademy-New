import React from "react";
import { Linkedin, Twitter, Globe } from "lucide-react";
import { Button } from "./ui/button";

// Using placeholder images or imports if available. 
// Assuming we can use the same assets as Testimonials or generic ones.
import instructor1 from "../assets/new_student/1.jpg"; // Placeholder
import instructor2 from "../assets/new_student/2.jpg"; // Placeholder
import instructor3 from "../assets/new_student/3.jpg"; // Placeholder

const instructors = [
    {
        id: 1,
        name: "Dr. Anjali Sharma",
        role: "Lead Data Scientist",
        bio: "Ex-Google AI researcher with 10+ years of experience in Machine Learning and Deep Learning.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Senior Full Stack Dev",
        bio: "Tech Lead at a Unicorn Startup. Expert in MERN stack and Scalable System Design.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
        social: { linkedin: "#", website: "#" }
    },
    {
        id: 3,
        name: "Sarah Jenkins",
        role: "Digital Marketing Pro",
        bio: "Managed $5M+ ad spend for global brands. Specializes in SEO, SEM, and Growth Hacking.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        id: 4,
        name: "David Chen",
        role: "Cloud Architect",
        bio: "AWS & Azure certified solutions architect helping enterprises migrate to the cloud securely.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        social: { linkedin: "#", website: "#" }
    }
];

export const InstructorsSection = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Expert Instructors</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Learn from the best in the industry. Our instructors are real-world practitioners who bring practical experience to the classroom.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {instructors.map((instructor) => (
                        <div key={instructor.id} className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="flex gap-4">
                                        {instructor.social.linkedin && (
                                            <a href={instructor.social.linkedin} className="text-white hover:text-primary transition-colors">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {instructor.social.twitter && (
                                            <a href={instructor.social.twitter} className="text-white hover:text-primary transition-colors">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {instructor.social.website && (
                                            <a href={instructor.social.website} className="text-white hover:text-primary transition-colors">
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-lg font-bold text-foreground mb-1">{instructor.name}</h3>
                                <p className="text-primary text-sm font-medium mb-3">{instructor.role}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                    {instructor.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                        View All Instructors
                    </Button>
                </div>
            </div>
        </section>
    );
};
