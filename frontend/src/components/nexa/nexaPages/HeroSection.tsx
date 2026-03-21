import { Button } from "../NexaUi/button";
import { Sparkles, MessageCircle } from "lucide-react";
import nexaHero from "@/assets/nexa-hero.png";

import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-50" />
      </div>

      <div className="container-main section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Powered by AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Meet <span className="text-gradient">Nexa.AI</span> – Your Smart Learning Partner
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Nexa.AI is the intelligent assistant that helps you learn faster, solve doubts instantly, and receive personalized guidance 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group" onClick={() => navigate('/nexa-bot')}>
                <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                Chat Now
              </Button>
              <Button variant="hero-outline" size="lg">
                Explore Features
              </Button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">2K+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">95%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-glow scale-125 opacity-60" />
              <img
                src={nexaHero}
                alt="Nexa.AI - Your Smart Learning Assistant"
                className="relative w-full max-w-lg lg:max-w-xl animate-float"
              />

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 px-4 py-2 bg-background rounded-xl shadow-card border border-green-100 animate-bounce">
                <span className="text-sm font-medium">🎓 Learning Made Easy</span>
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-background rounded-xl shadow-card border border-green-100 animate-bounce" style={{ animationDelay: "0.5s" }}>
                <span className="text-sm font-medium">💡 Instant Answers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
