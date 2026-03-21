import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Play, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroImageService } from "@/service/heroImage.service";

// ── Static assets ──────────────────────────────────────────────────────────
import hero_img from "../assets/hero_img.jpg";
import img1 from "../assets/new_student/1.jpeg";
import img2 from "../assets/new_student/2.jpeg";
import img3 from "../assets/new_student/3.jpeg";
import img4 from "../assets/new_student/4.jpeg";

const AVATAR_IMAGES = [img1, img2, img3, img4];
const FALLBACK_IMAGES = [hero_img]; // fallback when no slides uploaded
const SLIDE_INTERVAL = 5000;

interface HeroSlide {
  _id: string;
  imageUrl: string;
  order?: number;
  isActive?: boolean;
}

export const Hero = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch hero images from backend
  useEffect(() => {
    heroImageService
      .getActiveHeroImages()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setImages(res.data.map((s: HeroSlide) => s.imageUrl));
        }
      })
      .catch(() => {
        /* silently keep fallback */
      });
  }, []);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating || index === currentIndex) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 450);
    },
    [isAnimating, currentIndex]
  );

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % images.length, "right");
  }, [currentIndex, images.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + images.length) % images.length, "left");
  }, [currentIndex, images.length, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [goNext, images.length]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (images.length > 1)
      intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
  };

  const handlePrev = () => { goPrev(); resetInterval(); };
  const handleNext = () => { goNext(); resetInterval(); };
  const handleDot = (idx: number) => {
    goToSlide(idx, idx > currentIndex ? "right" : "left");
    resetInterval();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20 pb-16 lg:pt-32 lg:pb-24">

      {/* ── Abstract Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* ── Floating SVG Icons ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        <svg
          className="absolute top-1/2 left-3/4 h-10 w-10 text-secondary/70 animate-float"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19V6l2.5-2.5 2.5 2.5v13m-5 0h5m-5 0h-2a2 2 0 01-2-2V8a2 2 0 012-2h2" />
        </svg>
        <svg
          className="absolute bottom-1/4 right-1/4 h-6 w-6 text-primary/70 animate-float"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.5 10.5V6.5m0 0a4 4 0 10-4-4 4 4 0 004 4zM13.5 6.5l-3 3M19 14.5a3 3 0 00-3-3H8a3 3 0 00-3 3m14 0c0 4.418-4.03 8-9 8s-9-3.582-9-8h18z" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ══════════════════════════════════════════════
              LEFT — ORIGINAL STATIC CONTENT (UNCHANGED)
          ══════════════════════════════════════════════ */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                New Courses Available
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Learn The  <br />
                <span className="text-primary">Future TODAY</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Unlock your potential with expert-led courses designed for real-world success. Join a community of learners and transform your future today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate("/all-courses")}
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
                onClick={() => navigate("/demo")}
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {AVATAR_IMAGES.map((avatar, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img src={avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="font-medium">2k+ Learners</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary hidden" />
                <span className="font-medium">50+ Courses</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT — PURE IMAGE SLIDER (from backend)
          ══════════════════════════════════════════════ */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative">

            {/* Slider frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card group">

              {/* Gradient overlay (cosmetic) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10 pointer-events-none" />

              {/* Slide image */}
              <div
                className="aspect-[4/3] overflow-hidden"
                style={{
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating
                    ? `translateX(${direction === "right" ? "-4%" : "4%"})`
                    : "translateX(0)",
                  transition: "opacity 0.45s ease, transform 0.45s ease",
                }}
              >
                <img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Hero slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Prev / Next arrows (appear on hover) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </>
              )}

              {/* Slide counter */}
              {/* {images.length > 1 && (
                <div className="absolute top-4 right-4 z-20 bg-background/75 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground border border-border/40">
                  {currentIndex + 1} / {images.length}
                </div>
              )} */}

              {/* Bottom floating card (original) */}
              {/* <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/50 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary fill-primary/20" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Learning Progress</p>
                    <p className="text-lg font-bold text-foreground">8 / 10 Courses Completed</p>
                  </div>
                  <div className="ml-auto w-24">
                    <div className="text-xs font-semibold text-primary mb-1 text-right">80%</div>
                    <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDot(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${idx === currentIndex
                        ? "w-8 h-2.5 bg-primary shadow-md shadow-primary/30"
                        : "w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50"
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Auto-advance progress bar */}
            {images.length > 1 && (
              <div className="mt-3 w-full h-0.5 bg-primary/10 rounded-full overflow-hidden">
                <div
                  key={`progress-${currentIndex}`}
                  className="h-full bg-primary rounded-full"
                  style={{ animation: `slideProgress ${SLIDE_INTERVAL}ms linear forwards` }}
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Global keyframes */}
      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
};