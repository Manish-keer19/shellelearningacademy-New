import HeroSection from "./nexaPages/HeroSection";
import AboutSection from "./nexaPages/AboutSection";
import FeaturesSection from "./nexaPages/FeaturesSection";
import HowItWorksSection from "./nexaPages/HowItWorksSection";
import TestimonialsSection from "./nexaPages/TestimonialsSection";
import CTASection from "./nexaPages/CTASection";
import ChatPreviewSection from "./nexaPages/ChatPreviewSection";

import WaveDivider from "./nexaPages/WaveDivider";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { motion } from "framer-motion";

const NexaHome = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />

      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <HeroSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <AboutSection />
        </motion.div>
        <motion.section
          id="features"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <FeaturesSection />
        </motion.section>
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <HowItWorksSection />
        </motion.section>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <ChatPreviewSection />
        </motion.div>
        <WaveDivider />
        <motion.section
          id="testimonials"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <TestimonialsSection />
        </motion.section>
        <motion.section
          id="contact"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <CTASection />
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default NexaHome;
