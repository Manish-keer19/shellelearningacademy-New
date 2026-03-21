import { Button } from "../NexaUi/button";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-40" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_hsl(126_60%_97%)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-card border border-green-100 shadow-lg overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Start Learning Smarter</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Start Your Smarter Learning Experience with{" "}
                <span className="text-gradient">Nexa.AI</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of students who are already learning faster, smarter, and more effectively with Nexa.AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="group">
                  <MessageCircle className="w-5 h-5" />
                  Chat with Nexa
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="hero-outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
