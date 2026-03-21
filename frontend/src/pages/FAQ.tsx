import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FAQ = () => {
  const navigate = useNavigate();
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account and complete the payment process."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 7-day money-back guarantee for all our courses. If you're not satisfied within 30 days of purchase, contact our support team for a full refund."
    },
    {
      question: "How do I access my certificates?",
      answer: "Once you complete a course, your certificate will be automatically generated and available in your dashboard under the 'Certificates' section."
    },
    {
      question: "Are the courses self-paced or scheduled?",
      answer: "Most of our courses are self-paced, allowing you to learn at your own speed. Some specialized programs may have scheduled live sessions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="mb-8 text-4xl font-bold text-foreground text-center">Frequently Asked Questions</h1>

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
    </div>
  );
};