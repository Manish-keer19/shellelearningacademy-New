import React from "react";

// Import all reputed platform images
import platform1 from "@/assets/Reputed_plaform/1.jpeg";
import platform2 from "@/assets/Reputed_plaform/2.jpeg";
import platform3 from "@/assets/Reputed_plaform/3.jpeg";
import platform4 from "@/assets/Reputed_plaform/4.jpeg";
import platform5 from "@/assets/Reputed_plaform/5.jpeg";
import platform6 from "@/assets/Reputed_plaform/6.jpeg";
import platform7 from "@/assets/Reputed_plaform/7.jpeg";
import platform8 from "@/assets/Reputed_plaform/8.jpeg";
import platform9 from "@/assets/Reputed_plaform/9.jpeg";
import platform11 from "@/assets/Reputed_plaform/11.jpeg";
import platform12 from "@/assets/Reputed_plaform/12.jpeg";
import platform13 from "@/assets/Reputed_plaform/13.jpeg";
import platform14 from "@/assets/Reputed_plaform/14.jpeg";
import platform15 from "@/assets/Reputed_plaform/15.jpeg";

const platforms = [
  platform1,
  platform2,
  platform3,
  platform4,
  platform5,
  platform6,
  platform7,
  platform8,
  platform9,
  platform11,
  platform12,
  platform13,
  platform14,
  platform15,
];

export const ReputedPlatformSection = () => {
  const col1 = platforms.slice(0, 7);
  const col2 = platforms.slice(7);

  return (
    <section className="relative py-16 md:py-24 bg-[#f4f8fc] overflow-hidden flex items-center justify-center min-h-[800px]">
      {/* Concentric Circles Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 flex items-center justify-center">
        <div className="absolute w-[1600px] h-[1600px] rounded-full border-[1.5px] border-[#8cb7f2]/20" />
        <div className="absolute w-[1200px] h-[1200px] rounded-full border-[1.5px] border-[#8cb7f2]/30" />
        <div className="absolute w-[850px] h-[850px] rounded-full border-[1.5px] border-[#8cb7f2]/40" />
        <div className="absolute w-[550px] h-[550px] rounded-full bg-[#9bc2f9]/30 blur-xl" />
      </div>

      <div className="container relative mx-auto px-4 z-10 flex flex-col items-center">
        {/* Section Header */}
        <h2 className="text-[2.25rem] md:text-[3.5rem] font-medium  mb-12 md:mb-16 text-center leading-[1.15] tracking-tight max-w-2xl">
          Our Latest Article On Platforms
          
        </h2>

        {/* Tablet Mockup Component */}
        <div className="relative w-full max-w-[700px] h-[450px] md:h-[500px] bg-white rounded-[1.5rem] md:rounded-[2rem] border-[12px] md:border-[16px] border-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex gap-4 md:gap-8 justify-center overflow-hidden px-6 md:px-12 py-4">
          {/* Tablet Side Features (Camera / Buttons) */}
          <div className="absolute left-[-16px] top-[50%] -translate-y-1/2 flex flex-col gap-8 opacity-20">
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
          </div>

          {/* Top & Bottom Fades for smooth scrolling illusion inside tablet */}
          <div className="absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Column 1 - Bottom to Top */}
          <div className="relative flex-1 h-full overflow-hidden">
            <div
              className="flex flex-col animate-marquee-y gap-4 md:gap-6 w-full"
              style={{ animationDuration: "40s" }}
            >
              {[...col1, ...col1, ...col1, ...col1].map((platform, i) => (
                <div
                  key={`col1-${i}`}
                  className="w-full h-[65px] md:h-[85px] flex-shrink-0 bg-[#fafafa] rounded-lg flex items-center justify-center p-3 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    src={platform}
                    alt="Publication"
                    className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Top to Bottom */}
          <div className="relative flex-1 h-full overflow-hidden mt-8 md:mt-12">
            <div
              className="flex flex-col animate-marquee-y-reverse gap-4 md:gap-6 w-full"
              style={{ animationDuration: "45s" }}
            >
              {[...col2, ...col2, ...col2, ...col2].map((platform, i) => (
                <div
                  key={`col2-${i}`}
                  className="w-full h-[65px] md:h-[85px] flex-shrink-0 bg-[#fafafa] rounded-lg flex items-center justify-center p-3 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    src={platform}
                    alt="Publication"
                    className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes marquee-y {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-50%);
                    }
                }

                @keyframes marquee-y-reverse {
                    0% {
                        transform: translateY(-50%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }

                .animate-marquee-y {
                    animation: marquee-y linear infinite;
                }

                .animate-marquee-y-reverse {
                    animation: marquee-y-reverse linear infinite;
                }
            `}</style>
    </section>
  );
};
