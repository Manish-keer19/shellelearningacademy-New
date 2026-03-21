import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface UseLocomotiveScrollOptions {
    smooth?: boolean;
    multiplier?: number;
    class?: string;
    smartphone?: {
        smooth: boolean;
    };
    tablet?: {
        smooth: boolean;
    };
}

export const useLocomotiveScroll = (options?: UseLocomotiveScrollOptions) => {
    const scrollRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Locomotive Scroll
        scrollRef.current = new LocomotiveScroll({
            el: containerRef.current,
            smooth: options?.smooth !== undefined ? options.smooth : true,
            multiplier: options?.multiplier || 1,
            class: options?.class || 'is-inview',
            smartphone: options?.smartphone || {
                smooth: true,
            },
            tablet: options?.tablet || {
                smooth: true,
            },
            // Additional options for better performance and smoothness
            lerp: 0.07, // Lower lerp = smoother, more buttery scroll (0-1)
            reloadOnContextChange: true,
        } as any);

        // Update scroll on window resize
        const handleResize = () => {
            if (scrollRef.current) {
                scrollRef.current.update();
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (scrollRef.current) {
                scrollRef.current.destroy();
                scrollRef.current = null;
            }
        };
    }, [options?.smooth, options?.multiplier, options?.class]);

    // Method to update scroll (useful after dynamic content loads)
    const updateScroll = () => {
        if (scrollRef.current) {
            scrollRef.current.update();
        }
    };

    // Method to scroll to a specific element
    const scrollTo = (target: string | HTMLElement, options?: any) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(target, options);
        }
    };

    // Method to start scroll
    const start = () => {
        if (scrollRef.current) {
            scrollRef.current.start();
        }
    };

    // Method to stop scroll
    const stop = () => {
        if (scrollRef.current) {
            scrollRef.current.stop();
        }
    };

    return {
        containerRef,
        scrollRef,
        updateScroll,
        scrollTo,
        start,
        stop,
    };
};
