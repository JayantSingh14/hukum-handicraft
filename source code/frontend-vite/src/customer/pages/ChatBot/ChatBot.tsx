import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { chatBot } from "../../../Redux Toolkit/Customer/AiChatBotSlice";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PromptMessage from "./PromptMessage";
import ResponseMessage from "./ResponseMessage";

interface ChatBotProps {
    handleClose: (e: any) => void;
    productId?: number;
}

const SUGGESTIONS = [
    "Show me wall art",
    "I need a gift idea",
    "What's in my cart?",
    "Show me lamps",
];

const ChatBot = ({ handleClose, productId }: ChatBotProps) => {
    const dispatch = useAppDispatch();
    const [prompt, setPrompt] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const { aiChatBot } = useAppSelector((store) => store);

    const send = (text: string) => {
        if (!text.trim()) return;
        dispatch(chatBot({ prompt: { prompt: text }, productId, userId: null }));
        setPrompt("");
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(prompt); }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiChatBot.messages]);

    return (
        <div style={{
            width: 380,
            height: 600,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            overflow: "hidden",
            border: "1px solid rgba(200,162,74,0.15)",
        }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #0f0f0f 0%, #1a1612 100%)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, #C8A24A, #e8c56a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <AutoAwesomeIcon sx={{ fontSize: 18, color: "#0f0f0f" }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 700, color: "#FAF8F2", letterSpacing: "0.1em" }}>
                            HUKUM
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#C8A24A", textTransform: "uppercase" }}>
                            Artisan Assistant
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 6px #4caf50" }} />
                    <IconButton onClick={handleClose} sx={{ color: "#FAF8F2", p: 0.5, "&:hover": { color: "#C8A24A" } }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}
                className="custom-scrollbar">

                {/* Welcome */}
                {aiChatBot.messages.length === 0 && (
                    <div style={{ textAlign: "center", paddingTop: 8 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #C8A24A22, #C8A24A44)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AutoAwesomeIcon sx={{ fontSize: 22, color: "#C8A24A" }} />
                        </div>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "#1a1612", marginBottom: 4 }}>
                            Welcome to HUKUM
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#8a7a6a", lineHeight: 1.6 }}>
                            {productId
                                ? "Ask me anything about this product."
                                : "Discover our handcrafted collection, check your orders, or find the perfect gift."}
                        </p>

                        {/* Quick suggestions */}
                        {!productId && (
                            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                                {SUGGESTIONS.map((s) => (
                                    <button key={s} onClick={() => send(s)} style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "0.65rem",
                                        letterSpacing: "0.05em",
                                        padding: "5px 12px",
                                        border: "1px solid rgba(200,162,74,0.3)",
                                        background: "transparent",
                                        color: "#5a4a3a",
                                        borderRadius: 20,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                        onMouseEnter={e => { (e.currentTarget).style.background = "#C8A24A"; (e.currentTarget).style.color = "#fff"; (e.currentTarget).style.borderColor = "#C8A24A"; }}
                                        onMouseLeave={e => { (e.currentTarget).style.background = "transparent"; (e.currentTarget).style.color = "#5a4a3a"; (e.currentTarget).style.borderColor = "rgba(200,162,74,0.3)"; }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Message list */}
                {aiChatBot.messages.map((item: any, index: number) =>
                    item.role === "user" ? (
                        <div key={index} style={{ alignSelf: "flex-end" }}>
                            <PromptMessage message={item.message} />
                        </div>
                    ) : (
                        <div key={index} style={{ alignSelf: "flex-start", width: "100%" }}>
                            <ResponseMessage message={item.message} products={item.products} />
                        </div>
                    )
                )}

                {/* Loading */}
                {aiChatBot.loading && (
                    <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "10px 14px", background: "#faf8f2", borderRadius: "0 12px 12px 12px", border: "1px solid rgba(200,162,74,0.15)" }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                width: 6, height: 6, borderRadius: "50%", background: "#C8A24A",
                                animation: "bounce 1.2s infinite",
                                animationDelay: `${i * 0.2}s`,
                            }} />
                        ))}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: "10px 12px",
                borderTop: "1px solid rgba(200,162,74,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#faf8f2",
                flexShrink: 0,
            }}>
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about products, your orders…"
                    style={{
                        flex: 1,
                        border: "1px solid rgba(200,162,74,0.2)",
                        borderRadius: 24,
                        padding: "8px 16px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.78rem",
                        color: "#1a1612",
                        background: "#fff",
                        outline: "none",
                    }}
                />
                <button
                    onClick={() => send(prompt)}
                    disabled={!prompt.trim() || aiChatBot.loading}
                    style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: prompt.trim() ? "#0f0f0f" : "#e0d8cc",
                        border: "none", cursor: prompt.trim() ? "pointer" : "default",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                        flexShrink: 0,
                    }}
                >
                    <SendIcon sx={{ fontSize: 16, color: prompt.trim() ? "#C8A24A" : "#aaa" }} />
                </button>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
};

export default ChatBot;
