import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Target,
  Users,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Shield,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import about_img from "../assets/about.jpeg";
import kartikImg from "../assets/owners/kartik.png";
import mayankImg from "../assets/owners/mayank.jpeg";
import omkarImg from "../assets/owners/omkarjpeg.jpeg";
import harshitImg from "../assets/owners/harshit.jpeg";
import { motion } from "framer-motion";

const About = () => {
  const services = [
    {
      icon: BookOpen,
      title: "Professional E-Learning Courses",
      description:
        "Gain job-ready skills through practical, industry-based learning programs designed for real-world success.",
      features: [
        "Digital Marketing",
        "AI for Marketing",
        "Stock Market & Financial Investment",
        "Data Analytics with Power BI",
        "UI/UX & Graphic Design",
      ],
    },
    {
      icon: Users,
      title: "Live Mentorship & Career Guidance",
      description:
        "Every learner receives personalized mentorship from industry professionals to build a confident career path.",
      features: [
        "One-on-one mentorship sessions",
        "Career roadmap planning",
        "Interview preparation guidance",
      ],
    },
    {
      icon: Briefcase,
      title: "Internship & Placement Assistance",
      description:
        "We connect students with real industry projects and internship opportunities to gain professional experience.",
      features: [
        "Internship programs with partner companies",
        "Resume and portfolio support",
        "Placement training and guidance",
      ],
    },
    {
      icon: Zap,
      title: "Corporate Training Solutions",
      description:
        "Customized digital skill training programs designed for companies and professionals to enhance team performance.",
      features: [
        "Corporate workshops and webinars",
        "Skill development for employees",
        "Project-based learning modules",
      ],
    },
    {
      icon: GraduationCap,
      title: "College & Institutional Partnerships",
      description:
        "We collaborate with colleges and educational institutions to make digital learning more accessible.",
      features: [
        "Campus certification programs",
        "Student skill development initiatives",
        "Expert-led seminars and lectures",
      ],
    },
    {
      icon: Shield,
      title: "24×7 Support & Lifetime Access",
      description:
        "All students receive lifetime access to learning materials and 24×7 academic support through our online portal.",
      features: [
        "Lifetime course access",
        "24/7 technical support",
        "Community forum access",
      ],
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To make industry-ready education accessible to everyone, everywhere, at any time.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building a global community of learners and professionals who support, inspire, and grow together.",
    },
    {
      icon: Award,
      title: "Excellence in Learning",
      description:
        "Delivering top-quality, practical, and future-focused education through expert trainers and structured learning paths.",
    },
    {
      icon: Zap,
      title: "Innovation & Growth",
      description:
        "Constantly upgrading our teaching methods and course content to ensure our learners stay ahead of industry trends.",
    },
  ];

  const stats = [
    { value: "2K+", label: "Students Worldwide" },
    { value: "20+", label: "Courses Available" },
    { value: "60+", label: "Expert Instructors" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const StatItem = ({
    value,
    label,
    index,
  }: {
    value: string;
    label: string;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="text-center p-6 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-300"
    >
      <div className="mb-2 font-display text-4xl font-bold text-primary sm:text-5xl">
        {value}
      </div>
      <div className="text-muted-foreground font-medium text-sm sm:text-base">
        {label}
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* 1. Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
              >
                <Users className="w-4 h-4" /> About Us
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight"
              >
                Empowering Careers Through{" "}
                <span className="text-primary">Practical Education</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto leading-relaxed"
              >
                Shell E-Learning Academy is more than just an ed-tech platform.
                We are a community dedicated to bridging the gap between
                academic learning and industry demands.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 2. Story & Mission Section */}
        <section className="py-16 lg:py-24 overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 order-2 lg:order-1"
              >
                <img
                  src={about_img}
                  alt="Team collaborating"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-xl">Established 2025</p>
                    <p className="text-white/80 text-sm">
                      Growing stronger every day
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right: Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-8 order-1 lg:order-2"
              >
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Our Story & Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Shell E-Learning Academy was founded with a powerful vision
                    —{" "}
                    <strong>
                      "Empowering learners through practical and industry-driven
                      education."
                    </strong>
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We observed that traditional education often fails to meet
                    the evolving needs of modern careers. To bridge this gap, we
                    created a platform combining live interactive sessions,
                    intensive hands-on projects, and recognized certifications
                    that give students real-world expertise.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Today, we are proud to have empowered thousands of students
                    across India with essential digital-age skills in fields
                    like Digital Marketing, AI, Data Analytics, and UI/UX
                    Design. Our commitment is to prepare students for success
                    with internship support, placement guidance, and continuous
                    mentorship.
                  </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="flex items-start gap-4">
                    <Target className="w-8 h-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Our Mission
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        To democratize access to high-quality, industry-relevant
                        education and empower learners with practical skills
                        that meet the evolving demands of modern careers. We are
                        committed to bridging the gap between traditional
                        education and industry requirements through innovative
                        learning experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Stats Section */}
        <section className="py-12 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <StatItem key={index} {...stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Our Values */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The core principles that drive everything we do at Shell
                E-Learning Academy.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    key={index}
                    className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Our Services */}
        {/* <section className="py-20 bg-background border-t border-border/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions to help you thrive in the digital world
                with expert-led programs and lifetime support.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    key={index}
                    className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start text-sm text-foreground/90 font-medium"
                        >
                          <Star className="h-4 w-4 text-primary fill-primary/30 mr-3 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section> */}

        {/* 6. Founders & Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The visionaries steering Shell E-Learning Academy towards
                excellence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Founder 1 - Kartik Gupta */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={kartikImg}
                    alt="Kartik Gupta"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Kartik Gupta
                  </h3>
                  <p className="text-primary font-semibold mb-2">Founder</p>
                  <p className="text-muted-foreground text-sm mb-4"></p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Leads marketing and strategic partnerships, driving brand
                    growth and industry collaborations. Focused on expanding
                    outreach, building strong partner networks, and creating
                    opportunities that connect learners with real-world career
                    pathways.
                  </p>
                </div>
              </motion.div>

              {/* Founder 2 - Mayank Jain */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={mayankImg}
                    alt="Mayank Jain"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Mayank Jain
                  </h3>
                  <p className="text-primary font-semibold mb-2">
                    Director & Co-Founder
                  </p>
                  <p className="text-muted-foreground text-sm mb-4"></p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Oversees sales, operations, academic development, and
                    financial planning. Ensures smooth execution of programs,
                    strengthens internal processes, and drives sustainable
                    growth while maintaining high training standards.
                  </p>
                </div>
              </motion.div>

              {/* Founder 3 - Omkar Dutta */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={omkarImg}
                    alt="Omkar Dutta"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Omkar Dutta
                  </h3>
                  <p className="text-primary font-semibold mb-2">
                    Vice president - Collaborations & Partners
                  </p>
                  <p className="text-muted-foreground text-sm mb-4"></p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Manages collaborations, partnerships, and key relationships
                    across the organisation. Focuses on building strong
                    alliances, maintaining partner engagement, and supporting
                    initiatives that enhance growth and credibility.
                  </p>
                </div>
              </motion.div>

              {/* Founder 4 - Harshit Shetty */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={harshitImg}
                    alt="Harshit Shetty"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Harshit Shetty
                  </h3>
                  <p className="text-primary font-semibold mb-2">
                    Vice President - Relationships & Operations
                  </p>
                  <p className="text-muted-foreground text-sm mb-4"></p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Oversees partner brands, collaborations, and
                    cross-department coordination. Ensures responsibilities are
                    managed effectively, maintains alignment across teams, and
                    supports smooth operations while strengthening relationships
                    with all partner organisations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. CTA Section */}
        <section className="py-20 overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-primary rounded-3xl p-12 shadow-2xl shadow-primary/30 text-primary-foreground relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
                  Join our community of learners and take the first step towards
                  a brighter future.
                </p>
                <Link to="/all-courses">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 font-bold text-primary hover:bg-white transition-colors"
                  >
                    Explore Courses <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
