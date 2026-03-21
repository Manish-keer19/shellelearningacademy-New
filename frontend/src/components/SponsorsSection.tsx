// Import all sponsor images
import sponsor11 from "@/assets/sponsers/11.jpeg";
import sponsor12 from "@/assets/sponsers/12.jpeg";
import sponsor13 from "@/assets/sponsers/13.jpeg";
import sponsor14 from "@/assets/sponsers/14.jpeg";
import sponsor15 from "@/assets/sponsers/15.jpeg";
import sponsor16 from "@/assets/sponsers/16.jpeg";
import sponsor17 from "@/assets/sponsers/17.jpeg";
import sponsor18 from "@/assets/sponsers/18.jpeg";
import sponsor19 from "@/assets/sponsers/19.jpeg";
import sponsor20 from "@/assets/sponsers/20.jpeg";
import sponsor21 from "@/assets/sponsers/21.jpeg";
import sponsor22 from "@/assets/sponsers/22.jpeg";
import sponsor23 from "@/assets/sponsers/23.jpeg";
import sponsor24 from "@/assets/sponsers/24.jpeg";
import sponsor25 from "@/assets/sponsers/25.jpeg";
import sponsor26 from "@/assets/sponsers/26.jpeg";
import sponsor27 from "@/assets/sponsers/27.jpeg";
import sponsor28 from "@/assets/sponsers/28.jpeg";

const sponsors = [
  sponsor11,
  sponsor12,
  sponsor13,
  sponsor14,
  sponsor15,
  sponsor16,
  sponsor17,
  sponsor18,
  sponsor19,
  sponsor20,
  sponsor21,
  sponsor22,
  sponsor23,
  sponsor24,
  sponsor25,
  sponsor26,
  sponsor27,
  sponsor28,
];

export const SponsorsSection = () => {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4 border-transparent bg-primary/10 text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Our Partners
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Trusted by <span className="text-primary">Industry Leaders</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Collaborating with top organizations to deliver world-class
            education
          </p>
        </div>

        {/* 5 Lines of Infinite Scroll constrained in width */}
        <div className="relative mt-8 space-y-4 md:space-y-6 max-w-6xl mx-auto px-4 overflow-hidden pb-16">
          {/* Fade Edges for the restricted container */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Row 1 - Marquee (85% width) */}
          <div className="flex overflow-hidden w-[85%] mx-auto">
            <div
              className="flex animate-marquee gap-4 md:gap-6 w-max"
              style={{ animationDuration: "100s" }}
            >
              {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
                <div key={`r1-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px]  rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)]  flex items-center justify-center p-3 md:p-4">
                    <img
                      src={sponsor}
                      alt={`Partner ${index + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Reverse Marquee (95% width) */}
          <div className="flex overflow-hidden w-[95%] mx-auto">
            <div
              className="flex animate-marquee-reverse gap-4 md:gap-6 w-max"
              style={{ animationDuration: "115s" }}
            >
              {[
                ...[...sponsors].reverse(),
                ...[...sponsors].reverse(),
                ...[...sponsors].reverse(),
              ].map((sponsor, index) => (
                <div key={`r2-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={sponsor}
                      alt={`Partner ${index + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 - Marquee (80% width) */}
          <div className="flex overflow-hidden w-[80%] mx-auto">
            <div
              className="flex animate-marquee gap-4 md:gap-6 w-max"
              style={{ animationDuration: "105s" }}
            >
              {[
                ...sponsors.slice(6),
                ...sponsors.slice(0, 6),
                ...sponsors.slice(6),
                ...sponsors.slice(0, 6),
                ...sponsors.slice(6),
                ...sponsors.slice(0, 6),
              ].map((sponsor, index) => (
                <div key={`r3-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={sponsor}
                      alt={`Partner ${index + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4 - Reverse Marquee (100% width) */}
          <div className="flex overflow-hidden w-full mx-auto">
            <div
              className="flex animate-marquee-reverse gap-4 md:gap-6 w-max"
              style={{ animationDuration: "125s" }}
            >
              {[
                ...[...sponsors].reverse().slice(12),
                ...[...sponsors].reverse().slice(0, 12),
                ...[...sponsors].reverse().slice(12),
                ...[...sponsors].reverse().slice(0, 12),
                ...[...sponsors].reverse().slice(12),
                ...[...sponsors].reverse().slice(0, 12),
              ].map((sponsor, index) => (
                <div key={`r4-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={sponsor}
                      alt={`Partner ${index + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 5 - Marquee (90% width) */}
          <div className="flex overflow-hidden w-[90%] mx-auto">
            <div
              className="flex animate-marquee gap-4 md:gap-6 w-max"
              style={{ animationDuration: "110s" }}
            >
              {[
                ...sponsors.slice(9),
                ...sponsors.slice(0, 9),
                ...sponsors.slice(9),
                ...sponsors.slice(0, 9),
                ...sponsors.slice(9),
                ...sponsors.slice(0, 9),
              ].map((sponsor, index) => (
                <div key={`r5-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={sponsor}
                      alt={`Partner ${index + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-12 md:mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm md:text-base text-muted-foreground font-medium">
              Trusted by
            </span>
            <span className="text-2xl md:text-3xl font-bold text-primary">
              100+
            </span>
            <span className="text-sm md:text-base text-muted-foreground font-medium">
              organizations worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Custom CSS for infinite scroll animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee {
          animation: marquee 80s linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 80s linear infinite;
        }
      `}</style>
    </section>
  );
};
