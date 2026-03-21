import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import FeaturedCourses from "./Course/FeaturedCourses";
import { CategoriesSection } from "./CategoriesSection";
import Testimonials from "./Testimonials";
import WhyChooseShell from "./WhyChooseShell";
import NewsletterSection from "./NewsletterSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { SponsorsSection } from "@/components/SponsorsSection";
import { UniversitySection } from "@/components/UniversitySection";
import { ReputedPlatformSection } from "@/components/ReputedPlatformSection";
import { LocomotiveScrollWrapper } from "@/components/LocomotiveScrollWrapper";
import { motion, useScroll, useSpring, useTransform, Variants } from "framer-motion";
import { useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────
// Reusable animation variants — GPU-safe (opacity + transform only)
// ─────────────────────────────────────────────────────────────────────

/** Fade up — default entrance for most sections */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Fade in from left */
const fromLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1, x: 0,
        transition: { type: "spring", damping: 28, stiffness: 70 },
    },
};

/** Fade in from right */
const fromRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1, x: 0,
        transition: { type: "spring", damping: 28, stiffness: 70 },
    },
};

/** Scale + fade — for feature/card-heavy sections */
const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
        opacity: 1, scale: 1,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Staggered container — wraps child items that animate one after another */
const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────────────
// AnimatedSection — triggers animation when scrolled into view
// ─────────────────────────────────────────────────────────────────────
interface AnimatedSectionProps {
    children: React.ReactNode;
    variant?: Variants;
    delay?: number;
    className?: string;
    /** How much of the element must be visible before triggering (0–1) */
    amount?: number;
}

const AnimatedSection = ({
    children,
    variant = fadeUp,
    delay = 0,
    className = "",
    amount = 0.12,
}: AnimatedSectionProps) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        variants={variant}
        transition={delay ? { delay } : undefined}
        className={className}
    >
        {children}
    </motion.div>
);

// ─────────────────────────────────────────────────────────────────────
// Scroll Progress Bar (top-of-page thin line)
// ─────────────────────────────────────────────────────────────────────
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9999] bg-gradient-to-r from-primary via-green-400 to-primary"
            style={{ scaleX }}
        />
    );
};

// ─────────────────────────────────────────────────────────────────────
// Divider — subtle glowing separator between sections
// ─────────────────────────────────────────────────────────────────────
const SectionDivider = () => (
    <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-center"
    />
);

// ─────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────
const Index = () => {
    useEffect(() => {
        return () => {
            document.documentElement.style.scrollBehavior = "auto";
        };
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">

            {/* Thin scroll-progress bar at very top */}
            <ScrollProgress />

            <Navbar />

            <LocomotiveScrollWrapper>
                <main className="flex-1">

                    {/* ── Hero ───────────────────────────────────────────── */}
                    {/* Hero itself has internal animations, just fade-in the wrapper */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Hero />
                    </motion.div>

                    {/* ── Sponsors ───────────────────────────────────────── */}
                    <AnimatedSection variant={fromLeft} delay={0} amount={0.1}>
                        <SponsorsSection />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── University ─────────────────────────────────────── */}
                    <AnimatedSection variant={fromRight} amount={0.1}>
                        <UniversitySection />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Reputed Platforms ──────────────────────────────── */}
                    <AnimatedSection variant={fromLeft} amount={0.1}>
                        <ReputedPlatformSection />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Categories ─────────────────────────────────────── */}
                    {/* stagger-container makes children animate in one-by-one */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.08 }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp}>
                            <CategoriesSection />
                        </motion.div>
                    </motion.div>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Featured Courses ───────────────────────────────── */}
                    <AnimatedSection variant={fadeUp} amount={0.08}>
                        <FeaturedCourses />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Why Choose Shell ───────────────────────────────── */}
                    <AnimatedSection variant={fromRight} amount={0.1}>
                        <WhyChooseShell />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Testimonials ───────────────────────────────────── */}
                    <AnimatedSection variant={scaleUp} amount={0.08}>
                        <Testimonials />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Certifications ─────────────────────────────────── */}
                    <AnimatedSection variant={fromLeft} amount={0.1}>
                        <CertificationsSection />
                    </AnimatedSection>

                    <div className="py-2"><SectionDivider /></div>

                    {/* ── Newsletter ─────────────────────────────────────── */}
                    <AnimatedSection variant={scaleUp} amount={0.1} delay={0.05}>
                        <NewsletterSection />
                    </AnimatedSection>

                </main>

                {/* ── Footer ───────────────────────────────────────────── */}
                <AnimatedSection variant={fadeUp} amount={0.05}>
                    <Footer />
                </AnimatedSection>

            </LocomotiveScrollWrapper>
        </div>
    );
};

export default Index;
