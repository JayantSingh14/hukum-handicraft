import React, { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { CircularProgress, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import { addItemToCart, fetchUserCart } from "../../../../Redux Toolkit/Customer/CartSlice";
import { isWishlisted } from "../../../../util/isWishlisted";
import { STORE_NAME } from "../../../../util/storeConfig";
import { formatPrice } from "../../../../util/formatPrice";

export type CardVariant = "standard" | "featured" | "list";

interface ProductCardProps {
    item: Product;
    variant?: CardVariant;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, variant = "standard" }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [addingToCart, setAddingToCart] = useState(false);
    const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const isCardLoaded = Object.keys(loadedImages).length > 0;
    const wishlisted = wishlist.wishlist ? isWishlisted(wishlist.wishlist, item) : false;

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    const handleAddWishlist = (e: MouseEvent) => {
        e.stopPropagation();
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    const handleQuickCart = async (e: MouseEvent) => {
        e.stopPropagation();
        const jwt = localStorage.getItem("jwt");
        if (!jwt) { navigate("/login"); return; }
        setAddingToCart(true);
        await dispatch(addItemToCart({ jwt, request: { productId: item.id!, quantity: 1 } }));
        await dispatch(fetchUserCart(jwt));
        setAddingToCart(false);
    };

    const goToDetail = () => {
        const cat = item.giftCategory?.toLowerCase().replace(/_/g, "-") || "gifts";
        const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        navigate(`/product-details/${cat}/${slug}/${item.id}`);
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isHovered && item.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImage(prev => (prev + 1) % item.images.length);
            }, 1200);
        } else {
            setCurrentImage(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);

    const WishlistBtn = ({ dark = false }: { dark?: boolean }) => (
        <IconButton
            onClick={handleAddWishlist}
            sx={{
                bgcolor: dark ? "rgba(15,15,15,0.7)" : "rgba(250,248,242,0.95)",
                color: wishlisted ? "#C8A24A" : (dark ? "#FAF8F2" : "#1A1A1A"),
                border: `1px solid ${wishlisted ? "rgba(200,162,74,0.6)" : "rgba(200,162,74,0.25)"}`,
                backdropFilter: "blur(4px)",
                p: 0.8,
                "&:hover": { bgcolor: "#0F0F0F", color: "#C8A24A", borderColor: "#C8A24A" },
            }}
        >
            {wishlisted ? <FavoriteIcon sx={{ fontSize: 15 }} /> : <FavoriteBorderIcon sx={{ fontSize: 15 }} />}
        </IconButton>
    );

    /* ── LIST variant ──────────────────────────────────── */
    if (variant === "list") {
        return (
            <div className="card-list-wrap" onClick={goToDetail}>
                <div className={`card-list-image${isCardLoaded ? " loaded" : ""}`}>
                    {item.images[0] && (
                        <img
                            src={item.images[0]}
                            alt={item.title}
                            loading="lazy"
                            onLoad={() => handleImageLoad(0)}
                        />
                    )}
                    {(item.discountPercent ?? 0) > 0 && (
                        <span className="discount-badge">{item.discountPercent ?? 0}% OFF</span>
                    )}
                </div>
                <div className="card-list-details">
                    <div>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#C8A24A", textTransform: "uppercase", marginBottom: 4 }}>{STORE_NAME}</p>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1612", letterSpacing: "0.04em", lineHeight: 1.3, marginBottom: 8 }}>{item.title}</h3>
                        {item.description && (
                            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#8a7a6a", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {item.description}
                            </p>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#1a1612" }}>₹{formatPrice(item.sellingPrice)}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#aaa", textDecoration: "line-through" }}>₹{formatPrice(item.mrpPrice)}</span>
                        {item.giftCategory && (
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#8a7a6a", textTransform: "uppercase", border: "1px solid rgba(200,162,74,0.25)", padding: "2px 8px" }}>
                                {item.giftCategory.replace(/_/g, " ")}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }} onClick={e => e.stopPropagation()}>
                    <WishlistBtn />
                    <IconButton
                        onClick={handleQuickCart}
                        disabled={addingToCart}
                        sx={{
                            bgcolor: "rgba(250,248,242,0.95)",
                            color: "#1A1A1A",
                            border: "1px solid rgba(200,162,74,0.25)",
                            p: 0.8,
                            "&:hover": { bgcolor: "#0F0F0F", color: "#C8A24A", borderColor: "#C8A24A" },
                        }}
                    >
                        {addingToCart ? <CircularProgress size={15} sx={{ color: "#C8A24A" }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: 15 }} />}
                    </IconButton>
                </div>
            </div>
        );
    }

    /* ── FEATURED variant ─────────────────────────────── */
    if (variant === "featured") {
        return (
            <div
                className={`card-featured${isCardLoaded ? " loaded" : ""} border border-[#C8A24A]/10`}
                style={{ cursor: "pointer" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={goToDetail}
            >
                {item.images.map((image: string, index: number) => (
                    <img
                        key={index}
                        className={`card-media object-top${loadedImages[index] ? " img-loaded" : ""}`}
                        src={image}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(index)}
                        style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
                    />
                ))}

                {(item.discountPercent ?? 0) > 0 && (
                    <span className="discount-badge">{item.discountPercent ?? 0}% OFF</span>
                )}

                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                    <WishlistBtn dark />
                    <IconButton
                        onClick={handleQuickCart}
                        disabled={addingToCart}
                        sx={{
                            bgcolor: "rgba(15,15,15,0.7)",
                            color: "#FAF8F2",
                            border: "1px solid rgba(200,162,74,0.25)",
                            backdropFilter: "blur(4px)",
                            p: 0.8,
                            "&:hover": { bgcolor: "#C8A24A", color: "#0F0F0F", borderColor: "#C8A24A" },
                        }}
                    >
                        {addingToCart ? <CircularProgress size={15} sx={{ color: "#C8A24A" }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: 15 }} />}
                    </IconButton>
                </div>

                {isHovered && item.images.length > 1 && (
                    <div className="indicator flex flex-col items-center gap-2">
                        <div className="flex gap-2 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                            {item.images.map((_: string, i: number) => (
                                <button
                                    key={i}
                                    className={`indicator-button${i === currentImage ? " active" : ""}`}
                                    onClick={e => { e.stopPropagation(); setCurrentImage(i); }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="featured-text-overlay">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#C8A24A", textTransform: "uppercase", marginBottom: 6 }}>
                        {STORE_NAME} · Editorial Pick
                    </p>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.45rem", fontWeight: 600, color: "#FAF8F2", letterSpacing: "0.04em", lineHeight: 1.25, marginBottom: 8 }}>
                        {item.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#FAF8F2" }}>₹{formatPrice(item.sellingPrice)}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(250,248,242,0.5)", textDecoration: "line-through" }}>₹{formatPrice(item.mrpPrice)}</span>
                    </div>
                </div>

                <div className="card-actions">
                    <button className="quick-view-btn" onClick={e => { e.stopPropagation(); goToDetail(); }}>
                        View Details
                    </button>
                </div>
            </div>
        );
    }

    /* ── STANDARD variant ──────────────────────────────── */
    return (
        <div className="group relative cursor-pointer" onClick={goToDetail}>
            <div
                className={`card border border-[#C8A24A]/10${isCardLoaded ? " loaded" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {item.images.map((image: string, index: number) => (
                    <img
                        key={index}
                        className={`card-media object-top${loadedImages[index] ? " img-loaded" : ""}`}
                        src={image}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(index)}
                        style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
                    />
                ))}

                {(item.discountPercent ?? 0) > 0 && (
                    <span className="discount-badge">{item.discountPercent ?? 0}% OFF</span>
                )}

                {/* Wishlist + Cart buttons */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                    <WishlistBtn />
                    <IconButton
                        onClick={handleQuickCart}
                        disabled={addingToCart}
                        sx={{
                            bgcolor: "rgba(250,248,242,0.95)",
                            color: "#1A1A1A",
                            border: "1px solid rgba(200,162,74,0.25)",
                            backdropFilter: "blur(4px)",
                            p: 0.8,
                            "&:hover": { bgcolor: "#0F0F0F", color: "#C8A24A", borderColor: "#C8A24A" },
                        }}
                    >
                        {addingToCart ? <CircularProgress size={15} sx={{ color: "#C8A24A" }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: 15 }} />}
                    </IconButton>
                </div>

                {isHovered && item.images.length > 1 && (
                    <div className="indicator flex flex-col items-center gap-2">
                        <div className="flex gap-2 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                            {item.images.map((_: string, i: number) => (
                                <button
                                    key={i}
                                    className={`indicator-button${i === currentImage ? " active" : ""}`}
                                    onClick={e => { e.stopPropagation(); setCurrentImage(i); }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="card-actions">
                    <button className="quick-view-btn" onClick={e => { e.stopPropagation(); goToDetail(); }}>
                        Quick View
                    </button>
                </div>
            </div>

            {/* Info below card */}
            <div className="pt-3 space-y-1">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: "#C8A24A", textTransform: "uppercase" }}>{STORE_NAME}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#1a1612", letterSpacing: "0.04em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as any }}>{item.title}</p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 10px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#1a1612" }}>₹{formatPrice(item.sellingPrice)}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#aaa", textDecoration: "line-through" }}>₹{formatPrice(item.mrpPrice)}</span>
                    {(item.discountPercent ?? 0) > 0 && (
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 600, color: "#C8A24A" }}>{item.discountPercent ?? 0}% OFF</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
