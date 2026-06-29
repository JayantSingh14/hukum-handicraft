import { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            style={{
                position: "fixed",
                bottom: 90,
                right: 20,
                zIndex: 999,
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#0F0F0F",
                border: "1px solid rgba(200,162,74,0.4)",
                color: "#C8A24A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#C8A24A")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0F0F0F")}
        >
            <KeyboardArrowUpIcon sx={{ fontSize: 20, color: "inherit" }} />
        </button>
    );
};

export default BackToTop;
