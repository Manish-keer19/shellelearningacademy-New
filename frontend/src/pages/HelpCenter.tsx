import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  CreditCard, 
  Settings, 
  Users,
  ExternalLink
} from "lucide-react";

export const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      articles: 12
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Payment methods, refunds, and billing issues",
      articles: 8
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      articles: 15
    },
    {
      icon: Users,
      title: "Courses & Learning",
      description: "Course enrollment, progress, and certificates",
      articles: 20
    }
  ];

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account and complete the payment process."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our courses. If you're not satisfied within 30 days of purchase, contact our support team for a full refund."
    },
    {
      question: "How do I access my certificates?",
      answer: "Once you complete a course, your certificate will be automatically generated and available in your dashboard under the 'Certificates' section. You can download it as a PDF or share it on LinkedIn."
    },
    {
      question: "Are the courses self-paced or scheduled?",
      answer: "Most of our courses are self-paced, allowing you to learn at your own speed. However, some specialized programs may have scheduled live sessions or deadlines."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "How long do I have access to a course?",
      answer: "Once you enroll in a course, you have lifetime access to the course materials, including any future updates. You can revisit the content anytime from your dashboard."
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Call Now"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Help Center</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Find answers to your questions and get the support you need
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-center">Browse by Category</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.title} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {category.articles} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-2xl font-bold text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          {/* User Guides */}
          <TabsContent value="guides">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-2xl font-bold text-center">User Guides & Tutorials</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Getting Started Guide
                    </CardTitle>
                    <CardDescription>
                      Complete walkthrough for new users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to create your account, browse courses, and make your first purchase.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      Read Guide <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Management
                    </CardTitle>
                    <CardDescription>
                      Manage your profile and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your profile, change password, and manage notification preferences.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      Read Guide <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment & Billing
                    </CardTitle>
                    <CardDescription>
                      Understanding payments and refunds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn about payment methods, billing cycles, and how to request refunds.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      Read Guide <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Course Navigation
                    </CardTitle>
                    <CardDescription>
                      Make the most of your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Navigate course content, track progress, and earn certificates.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      Read Guide <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contact Support */}
          <TabsContent value="contact">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-2xl font-bold text-center">Contact Our Support Team</h2>
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {contactOptions.map((option) => (
                  <Card key={option.title}>
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <option.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {option.availability}
                      </p>
                      <Button className="w-full">
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a detailed message and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>
                  <Button className="w-full">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};