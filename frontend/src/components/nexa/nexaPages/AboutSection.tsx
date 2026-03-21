import { Brain, MessageSquare, Sparkles } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50/50 to-transparent" />
      
      <div className="container-main relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="text-gradient">Nexa.AI</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nexa.AI is built by Shell E-Learning Academy to support students with instant answers, course guidance, career suggestions, and smart learning assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI-Powered Intelligence",
              description: "Advanced neural networks trained on educational content to provide accurate, contextual responses.",
            },
            {
              icon: MessageSquare,
              title: "Natural Conversations",
              description: "Chat naturally like you would with a tutor. No complex commands needed.",
            },
            {
              icon: Sparkles,
              title: "Personalized Learning",
              description: "Adapts to your learning style and pace for a truly customized experience.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-card border border-green-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <item.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
