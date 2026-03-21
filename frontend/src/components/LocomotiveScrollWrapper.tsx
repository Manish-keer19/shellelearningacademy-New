import React, { useEffect } from 'react';
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll';

interface LocomotiveScrollWrapperProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component that applies Locomotive Scroll to its children
 * Usage: Wrap your page content with this component to enable smooth scrolling
 */
export const LocomotiveScrollWrapper: React.FC<LocomotiveScrollWrapperProps> = ({
    children,
    className = '',
}) => {
    const { containerRef, updateScroll } = useLocomotiveScroll({
        smooth: true,
        multiplier: 0.8, // Slower scroll speed for smoother experience
        class: 'is-inview',
        smartphone: {
            smooth: true,
        },
        tablet: {
            smooth: true,
        },
    });

    // Update scroll when content changes
    useEffect(() => {
        const timer = setTimeout(() => {
            updateScroll();
        }, 100);

        return () => clearTimeout(timer);
    }, [children, updateScroll]);

    return (
        <div
            ref={containerRef}
            data-scroll-container
            className={className}
        >
            {children}
        </div>
    );
};

export default LocomotiveScrollWrapper;
