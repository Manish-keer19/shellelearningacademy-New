import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
// Ensure logo path is correct
import logo from "../assets/logo1.png";

export const Footer = () => {
    // --- Data Definitions (Optimized for cleanliness) ---
    const footerLinks = {
        Company: [
            { name: "About Us", path: "/about" },
            { name: "Services", path: "/services" },
            { name: "Contact", path: "/contact" },
            // { name: "Certifications", path: "/certifications" },
        ],
        // Programs: [
        //     { name: "All Courses", path: "/all-courses" },
        //     // { name: "Featured Bundles", path: "/bundles" },
        //     // { name: "Live Workshops", path: "/workshops" },
        // ],
        Support: [
            // { name: "Help Center", path: "/help-center" },
            { name: "FAQ", path: "/faq" },
            // { name: "Student Support", path: "/student-support" },
        ],
        Legal: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
            // { name: "Cookie Policy", path: "/cookies" },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61583112636861&mibextid=wwXIfr&rdid=XJJPGaN0Ttkd5y2I", label: "Facebook", hoverClass: "hover:bg-[#1877F2] hover:text-white" },
        { icon: Twitter, href: "https://x.com/shellelearning", label: "Twitter", hoverClass: "hover:bg-black hover:text-white" },
        { icon: Instagram, href: "https://www.instagram.com/shellelearningacademy", label: "Instagram", hoverClass: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/shell-e-learning-academy-1180a538a/", label: "LinkedIn", hoverClass: "hover:bg-[#0A66C2] hover:text-white" },
        { icon: Youtube, href: "https://www.youtube.com/@shellelearningacademy", label: "YouTube", hoverClass: "hover:bg-[#FF0000] hover:text-white" },
    ];

    const contactInfo = [
        // { icon: Mail, text: "info@shellelearningacademy.com", href: "mailto:info@shellelearningacademy.com" },
        { icon: Mail, text: "support@shellelearningacademy.com", href: "mailto:support@shellelearningacademy.com" },
        { icon: Phone, text: "+91 94066 88303", href: "tel:+919406688303" },
        { icon: MapPin, text: "Vijay Nagar, Scheme No. 78, Indore MP 452010", href: "https://maps.google.com/search?q=Vijay+Nagar,+Scheme+No.+78,+Indore" },
    ];

    // --- Footer Sub-Components ---

    const LinkGroup = ({ category, links }) => (
        <div>
            <h3 className="mb-4 font-bold text-base text-white transition-colors ">
                {category}
            </h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            to={link.path}
                            className="text-sm text-white transition-colors  block"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    // --- Main Component Render ---
    return (
        <footer className="border-t border-border bg-[#166D37] dark:bg-black/20">
            <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-7xl">

                {/* Top Section: Brand + Links Grid */}
                <div className="grid gap-10 md:gap-12 lg:grid-cols-5 xl:grid-cols-6">

                    {/* 1. Brand & Contact Section (2 columns wide) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={logo} alt="Shell E-learning Academy" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="font-extrabold text-xl text-white block">Shell E-learning Academy</span>
                                <span className="text-xs font-medium text-white">ISO Verified | Learn Today</span>
                            </div>
                        </Link>

                        <p className="text-sm text-white leading-relaxed">
                            Empowering learners worldwide with cutting-edge education, recognized certifications, and clear career pathways.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 pt-3">
                            <h4 className="font-bold text-sm text-white">Get In Touch:</h4>
                            {contactInfo.map((contact, index) => (
                                <a
                                    key={index}
                                    href={contact.href}
                                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="flex items-start gap-3 text-sm text-white  transition-colors"
                                >
                                    <contact.icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <span className="break-words">{contact.text}</span>
                                    {contact.href.startsWith('http') && !contact.href.startsWith('mailto') && !contact.href.startsWith('tel') && (
                                        <ExternalLink className="h-3 w-3 mt-1 opacity-50" />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Links Section (3-4 columns wide) */}
                    <div className="lg:col-span-3 xl:col-span-4">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                            {Object.entries(footerLinks).map(([category, links]) => (
                                <LinkGroup key={category} category={category} links={links} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="mt-10 mb-8 border-t border-border/70" />

                {/* Bottom Bar: Copyright & Socials */}
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

                    {/* Copyright and Links */}
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4 text-center sm:text-left">
                        <p className="text-sm text-white font-medium">
                            © {new Date().getFullYear()} Shell E-learning Academy. All rights reserved.
                        </p>
                        {/* <div className="flex gap-4">
                            <Link to="/sitemap" className="text-xs text-white  transition-colors">
                                Sitemap
                            </Link>
                            <Link to="/accessibility" className="text-xs text-white  transition-colors">
                                Accessibility
                            </Link>
                        </div> */}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex h-9 w-9 items-center justify-center rounded-full bg-muted text-black transition-all duration-300 shadow-md hover:scale-110 hover:shadow-lg ${social.hoverClass}`}
                                aria-label={`Follow us on ${social.label}`}
                            >
                                <social.icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};