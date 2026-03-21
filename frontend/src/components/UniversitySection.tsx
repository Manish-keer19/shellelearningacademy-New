import React from "react";

// Import all university images
import uni1 from "@/assets/universitys/1.jpeg";
import uni2 from "@/assets/universitys/2.jpeg";
import uni3 from "@/assets/universitys/3.jpeg";
import uni4 from "@/assets/universitys/4.jpeg";
import uni5 from "@/assets/universitys/5.jpeg";
import uni6 from "@/assets/universitys/6.jpeg";
import uni7 from "@/assets/universitys/7.jpeg";
import uni8 from "@/assets/universitys/8.jpeg";
import uni9 from "@/assets/universitys/9.jpeg";
import uni10 from "@/assets/universitys/10.jpeg";
import uni11 from "@/assets/universitys/11.jpeg";
import uni12 from "@/assets/universitys/12.jpeg";
import uni13 from "@/assets/universitys/13.jpeg";
import uni14 from "@/assets/universitys/14.jpeg";
import uni15 from "@/assets/universitys/15.jpeg";
import uni16 from "@/assets/universitys/16.jpeg";
import uni17 from "@/assets/universitys/17.jpeg";
import uni18 from "@/assets/universitys/18.jpeg";
import uni19 from "@/assets/universitys/19.jpeg";
import uni20 from "@/assets/universitys/20.jpeg";
import uni21 from "@/assets/universitys/21.jpeg";
import uni22 from "@/assets/universitys/22.jpeg";
import uni23 from "@/assets/universitys/23.jpeg";
import uni24 from "@/assets/universitys/24.jpeg";
import uni25 from "@/assets/universitys/25.jpeg";
import uni26 from "@/assets/universitys/26.jpeg";
import uni27 from "@/assets/universitys/27.jpeg";

const universities = [
  uni1,
  uni2,
  uni3,
  uni4,
  uni5,
  uni6,
  uni7,
  uni8,
  uni9,
  uni10,
  uni11,
  uni12,
  uni13,
  uni14,
  uni15,
  uni16,
  uni17,
  uni18,
  uni19,
  uni20,
  uni21,
  uni22,
  uni23,
  uni24,
  uni25,
  uni26,
  uni27,
];

export const UniversitySection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6 border-primary/20 bg-primary/5 text-primary">
            Pan-India Academic Representation
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            Students From{" "}
            <span className="text-primary">Leading Institutions</span> Across
            India
          </h2>
          <p className="text-lg md:text-xl text-primary/80 font-semibold mb-8">
            Empowering talent beyond campus boundaries through AI-driven skill
            development.
          </p>
          <div className="grid md:grid-cols-1 gap-6 text-muted-foreground text-base md:text-lg leading-relaxed text-center px-4">
            <p>
              We have trained and mentored students from diverse academic
              institutions across India through our AI-powered skill development
              programs, live sessions, and practical internship models.
            </p>
            <p>
              Our learners come from engineering, management, and technology
              backgrounds, seeking industry-relevant skills that go beyond
              traditional classroom education.
            </p>
            <p>
              Through hands-on projects, real-time case studies, and
              AI-integrated learning systems, we help students transform
              academic knowledge into job-ready capabilities.
            </p>
          </div>
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
              style={{ animationDuration: "120s" }}
            >
              {[...universities, ...universities].map((uni, index) => (
                <div key={`r1-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px]  rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center p-3 md:p-4">
                    <img
                      src={uni}
                      alt="Partner"
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
              style={{ animationDuration: "120s" }}
            >
              {[
                ...[...universities].reverse(),
                ...[...universities].reverse(),
              ].map((uni, index) => (
                <div key={`r2-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={uni}
                      alt="Partner"
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
              style={{ animationDuration: "120s" }}
            >
              {[
                ...universities.slice(10),
                ...universities.slice(0, 10),
                ...universities.slice(10),
                ...universities.slice(0, 10),
              ].map((uni, index) => (
                <div key={`r3-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={uni}
                      alt="Partner"
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
              style={{ animationDuration: "85s" }}
            >
              {[
                ...[...universities].reverse().slice(5),
                ...[...universities].reverse().slice(0, 5),
                ...[...universities].reverse().slice(5),
                ...[...universities].reverse().slice(0, 5),
              ].map((uni, index) => (
                <div key={`r4-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={uni}
                      alt="Partner"
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
              style={{ animationDuration: "70s" }}
            >
              {[
                ...universities.slice(15),
                ...universities.slice(0, 15),
                ...universities.slice(15),
                ...universities.slice(0, 15),
              ].map((uni, index) => (
                <div key={`r5-${index}`} className="flex-shrink-0">
                  <div className="w-[180px] h-[75px] md:w-[280px] md:h-[100px] bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center p-3 md:p-4">
                    <img
                      src={uni}
                      alt="Partner"
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                    animation: marquee 100s linear infinite;
                }

                .animate-marquee-reverse {
                    animation: marquee-reverse 100s linear infinite;
                }
            `}</style>
    </section>
  );
};
