import { useNavigate } from "react-router-dom";

interface ProductSummary {
    id: number;
    title: string;
    images: string[];
    sellingPrice: number;
    mrpPrice: number;
    discountPercent?: number;
    giftCategory?: string;
}

interface ResponseMessageProps {
    message: string;
    products?: ProductSummary[];
}

const ResponseMessage = ({ message, products }: ResponseMessageProps) => {
    const navigate = useNavigate();

    const goToProduct = (p: ProductSummary) => {
        navigate(`/product-details/${p.giftCategory?.toLowerCase() || "gifts"}/${p.title}/${p.id}`);
    };

    return (
        <div className="max-w-[92%] self-start">
            {/* Message bubble */}
            <div style={{
                background: "linear-gradient(135deg, #faf8f2 0%, #f5f0e8 100%)",
                border: "1px solid rgba(200,162,74,0.2)",
                borderRadius: "0 12px 12px 12px",
                padding: "10px 14px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.82rem",
                color: "#2a2016",
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
            }}>
                {message}
            </div>

            {/* Product suggestions */}
            {products && products.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    <p style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        color: "#C8A24A",
                        textTransform: "uppercase",
                        marginBottom: 8,
                        paddingLeft: 2,
                    }}>
                        From Our Collection
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {products.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => goToProduct(p)}
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    background: "#fff",
                                    border: "1px solid rgba(200,162,74,0.15)",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(200,162,74,0.15)";
                                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,162,74,0.4)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,162,74,0.15)";
                                }}
                            >
                                {/* Product image */}
                                <div style={{ width: 70, minWidth: 70, height: 70, overflow: "hidden", flexShrink: 0 }}>
                                    {p.images?.[0] ? (
                                        <img
                                            src={p.images[0]}
                                            alt={p.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: "#f0ebe0" }} />
                                    )}
                                </div>

                                {/* Product info */}
                                <div style={{ padding: "8px 10px 8px 0", flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontFamily: "Cormorant Garamond, serif",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        color: "#1a1612",
                                        lineHeight: 1.3,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical" as const,
                                        marginBottom: 4,
                                    }}>
                                        {p.title}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#1a1612" }}>
                                            ₹{p.sellingPrice}
                                        </span>
                                        {p.mrpPrice > p.sellingPrice && (
                                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#aaa", textDecoration: "line-through" }}>
                                                ₹{p.mrpPrice}
                                            </span>
                                        )}
                                        {(p.discountPercent ?? 0) > 0 && (
                                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "#C8A24A" }}>
                                                {p.discountPercent}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div style={{ display: "flex", alignItems: "center", paddingRight: 10, color: "#C8A24A", fontSize: "0.9rem" }}>
                                    →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponseMessage;
