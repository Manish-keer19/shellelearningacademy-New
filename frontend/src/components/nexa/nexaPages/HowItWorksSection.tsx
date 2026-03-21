import { MessageCircle, Search, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Ask a Question",
    description: "Type your question naturally, just like chatting with a friend or tutor.",
  },
  {
    icon: Search,
    number: "02",
    title: "Nexa.AI Analyzes",
    description: "Our AI processes your query against Shell Academy's knowledge base.",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Get Accurate Responses",
    description: "Receive fast, detailed, and contextually relevant answers instantly.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three Simple Steps to <span className="text-gradient">Smarter Learning</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting help has never been easier. Here's how Nexa.AI works.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-cta flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-10 h-10 text-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-green-400 flex items-center justify-center text-sm font-bold text-green-600">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{step.description}</p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-6 text-green-300">
                    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="transform translate-x-1/2">
                      <path d="M0 12H44M44 12L32 2M44 12L32 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
