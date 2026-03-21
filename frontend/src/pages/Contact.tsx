import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageSquare, Send, User } from "lucide-react";
import { motion } from "framer-motion";

// --- Form Input Wrapper Component for Icons ---
const LabeledInput = ({
  id,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-foreground" htmlFor={id}>
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      )}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`pl-${Icon ? 10 : 4} h-11 border-border focus-visible:ring-primary`}
      />
    </div>
  </div>
);

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      detail: "support@shellelearningacademy.com",
      description: "We'll respond within 24 hours (Mon-Sat)",
      link: "mailto:support@shellelearningacademy.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 94066 88303",
      description: "Mon-Fri, 9am-6pm IST for immediate support",
      link: "tel:+919406688303",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "Vijay Nagar, Scheme No. 78, Indore MP 452010",
      description: "Stop by during business hours (by appointment)",
      link: "https://maps.google.com/search?q=Vijay+Nagar,+Scheme+No.+78,+Indore",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert("Thank you! Your message has been sent.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20 lg:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl text-center"
            >
              <h1 className="mb-6 font-extrabold text-5xl tracking-tight sm:text-6xl lg:text-7xl leading-tight">
                Get In <span className="text-primary">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message
                and our team will respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Adjusted grid to 3 columns, centering the 3rd if needed */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-card rounded-3xl p-8 text-center shadow-lg border border-border/70 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <info.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-2 font-bold text-xl text-foreground">
                      {info.title}
                    </h3>
                    <p className="mb-1 text-sm font-semibold text-primary break-words">
                      {info.detail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {info.description}
                    </p>
                  </motion.div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-muted/10 py-20 lg:py-24 border-t border-border/70">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-bold text-4xl text-foreground">
                  Send Us a Message
                </h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form below and our dedicated support team will
                  get back to you within 24 hours.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="rounded-3xl p-6 sm:p-10 shadow-2xl shadow-gray-400/20 border-primary/20">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <LabeledInput
                        id="firstName"
                        label="First Name"
                        placeholder="John"
                        icon={User}
                        required
                      />
                      <LabeledInput
                        id="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        icon={User}
                        required
                      />
                    </div>

                    <LabeledInput
                      id="email"
                      label="Email Address"
                      placeholder="john.doe@example.com"
                      type="email"
                      icon={Mail}
                      required
                    />
                    <LabeledInput
                      id="subject"
                      label="Subject"
                      placeholder="How can we help you?"
                      icon={MessageSquare}
                      required
                    />

                    <div className="space-y-2">
                      <label
                        className="text-sm font-semibold text-foreground"
                        htmlFor="message"
                      >
                        Message <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        className="border-border focus-visible:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.01]"
                    >
                      Send Message <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map/Location Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 font-bold text-4xl text-foreground">
                Our Location
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                We're located in the heart of Indore. Feel free to visit us!
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                className="overflow-hidden rounded-3xl bg-muted shadow-2xl border border-border/70"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.0!2d75.8917633!3d22.7684867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ2JzA2LjYiTiA3NcKwNTMnMzAuNCJF!5e0!3m2!1sen!2sin!4v1234567890" // Using provided mock URL
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shell E-learning Academy Location"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
