# Locomotive Scroll Integration Guide

## Overview
Locomotive Scroll has been successfully integrated into the Shell E-learning platform to provide smooth, buttery scrolling throughout the site.

## What's Been Implemented

### 1. **Custom Hook** (`useLocomotiveScroll.ts`)
A reusable React hook that initializes and manages Locomotive Scroll:
- **Location**: `src/hooks/useLocomotiveScroll.ts`
- **Features**:
  - Smooth scroll with `lerp: 0.07` for buttery interpolation
  - Auto-updates on window resize
  - Methods: `updateScroll()`, `scrollTo()`, `start()`, `stop()`
  - Proper cleanup on unmount

### 2. **Wrapper Component** (`LocomotiveScrollWrapper.tsx`)
A wrapper component to easily apply Locomotive Scroll to any page:
- **Location**: `src/components/LocomotiveScrollWrapper.tsx`
- **Settings**:
  - `multiplier: 0.8` - Slower scroll speed for smoother experience
  - Auto-updates when content changes
  - Works on desktop, tablet, and smartphone

### 3. **Enhanced Animations** (`Index.tsx`)
Combined Locomotive Scroll with Framer Motion for elegant animations:
- **Smooth scroll progress bar** at the top
- **Slower, smoother animations**:
  - Fade in: 1.2s duration with easeOutExpo
  - Slide animations: Spring physics with damping: 30, stiffness: 60
  - Scale animations: 1.4s duration for elegant entrance
- **Viewport triggers**: Elements animate when 15% visible
- **No parallax gaps**: Removed `data-scroll-speed` to prevent spacing issues

### 4. **Custom CSS Utilities** (`index.css`)
Added Locomotive Scroll-specific styles:
- Fade animations (up, left, right)
- Scale animations
- Respects `prefers-reduced-motion` for accessibility

## Current Configuration

### Scroll Settings
```typescript
{
  smooth: true,
  multiplier: 0.8,      // Slower = smoother
  lerp: 0.07,           // Lower = more buttery (0-1)
  class: 'is-inview',   // Class added when element is visible
}
```

### Animation Timings
- **Fade In**: 1.2s with smooth easing
- **Slide Left/Right**: 1.2s spring animation
- **Slide Bottom**: 1.3s spring animation
- **Scale**: 1.4s spring animation

## How to Use on Other Pages

### Option 1: Wrap Entire Page
```tsx
import { LocomotiveScrollWrapper } from '@/components/LocomotiveScrollWrapper';

function MyPage() {
  return (
    <LocomotiveScrollWrapper>
      <YourContent />
    </LocomotiveScrollWrapper>
  );
}
```

### Option 2: Add Scroll Animations to Elements
```tsx
<div data-scroll className="scroll-fade-up">
  This will fade up when scrolled into view
</div>
```

### Available CSS Classes
- `.scroll-fade-up` - Fade in from bottom
- `.scroll-fade-left` - Fade in from left
- `.scroll-fade-right` - Fade in from right
- `.scroll-scale` - Scale up when visible

## Important Notes

### ⚠️ Avoid Parallax Gaps
**DO NOT** use `data-scroll-speed` attributes as they create unwanted spacing between components:
```tsx
{/* ❌ BAD - Creates gaps */}
<div data-scroll data-scroll-speed="2">

{/* ✅ GOOD - Smooth scroll without gaps */}
<div data-scroll>
```

### 🎯 Best Practices
1. **Use `data-scroll`** for smooth scrolling without parallax
2. **Combine with Framer Motion** for entrance animations
3. **Keep lerp low** (0.05-0.1) for smoothest experience
4. **Update scroll** after dynamic content loads:
   ```tsx
   const { updateScroll } = useLocomotiveScroll();
   useEffect(() => {
     updateScroll();
   }, [data]);
   ```

### 🔧 Troubleshooting

**Problem**: Scroll feels too fast
- **Solution**: Decrease `multiplier` in `LocomotiveScrollWrapper.tsx`

**Problem**: Scroll feels laggy
- **Solution**: Increase `lerp` value in `useLocomotiveScroll.ts`

**Problem**: Gaps between components
- **Solution**: Remove `data-scroll-speed` attributes

**Problem**: Animations too fast
- **Solution**: Increase `duration` values in animation variants

## Performance Tips
1. Locomotive Scroll uses `will-change: transform` for GPU acceleration
2. Animations trigger only once (`viewport: { once: true }`)
3. Elements animate when 15% visible for better UX
4. Respects user's motion preferences

## Files Modified
- ✅ `src/hooks/useLocomotiveScroll.ts` - Custom hook
- ✅ `src/components/LocomotiveScrollWrapper.tsx` - Wrapper component
- ✅ `src/pages/Index.tsx` - Implemented smooth scroll + animations
- ✅ `src/index.css` - Added Locomotive Scroll utilities
- ✅ `package.json` - Already had `locomotive-scroll: ^5.0.1`

## Next Steps
To add Locomotive Scroll to other pages:
1. Import `LocomotiveScrollWrapper`
2. Wrap your page content
3. Add `data-scroll` to elements you want to track
4. Optionally add CSS animation classes

Enjoy the smooth, buttery scrolling experience! 🎉
