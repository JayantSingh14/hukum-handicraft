import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "./useSmoothScroll";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const lenis = getLenis();
        if (lenis) {
            // Use Lenis's own scroll method so it isn't intercepted
            lenis.scrollTo(0, { immediate: true });
        } else {
            // Fallback if Lenis hasn't initialised yet
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
