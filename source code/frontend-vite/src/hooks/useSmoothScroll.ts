import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/**
 * Initialises Lenis buttery-smooth scrolling wired to GSAP's ticker.
 * Call once at the root of your app (or per-page).
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Destroy any previous instance (e.g. HMR)
    if (lenisInstance) {
      lenisInstance.destroy();
    }

    const lenis = new Lenis({
      duration: 1.4,          // scroll duration (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Drive Lenis via GSAP's RAF ticker for perfect frame sync
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/** Expose the raw lenis instance if you need to programmatically scroll. */
export function getLenis() {
  return lenisInstance;
}
