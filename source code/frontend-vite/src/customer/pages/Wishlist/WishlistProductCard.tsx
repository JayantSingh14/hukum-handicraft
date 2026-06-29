import { useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../types/productTypes";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { CircularProgress } from "@mui/material";
import { addProductToWishlist } from "../../../Redux Toolkit/Customer/WishlistSlice";
import { addItemToCart, fetchUserCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { STORE_NAME } from "../../../util/storeConfig";
import { formatPrice } from "../../../util/formatPrice";

interface ProductCardProps {
    item: Product;
}

const WishlistProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [addingToCart, setAddingToCart] = useState(false);
    const [moved, setMoved] = useState(false);

    const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    const handleMoveToCart = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const jwt = localStorage.getItem("jwt");
        if (!jwt) { navigate("/login"); return; }
        setAddingToCart(true);
        await dispatch(addItemToCart({ jwt, request: { productId: item.id!, quantity: 1 } }));
        await dispatch(fetchUserCart(jwt));
        setAddingToCart(false);
        setMoved(true);
        setTimeout(() => setMoved(false), 2000);
    };

    return (
        <div
            onClick={() => navigate(`/product-details/${item.giftCategory?.toLowerCase() || "gifts"}/${item.title}/${item.id}`)}
            className="w-full relative group cursor-pointer bg-transparent"
        >
            <div className="w-full overflow-hidden border border-[#C8A24A]/10 relative">
                <img
                    className="object-cover object-top w-full h-[200px] sm:h-[280px] group-hover:scale-105 transition-transform duration-500"
                    src={item.images[0]}
                    alt={item.title}
                />
                {/* Remove button */}
                <button
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/85 hover:bg-white text-matte-black border border-[#C8A24A]/25 hover:border-brand-gold transition-colors duration-200 shadow-sm z-10"
                >
                    <CloseIcon sx={{ fontSize: "16px" }} />
                </button>

                {/* Move to Cart — shows on hover */}
                <div
                    className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={handleMoveToCart}
                        disabled={addingToCart}
                        className="w-full py-2.5 bg-[#0F0F0F] text-[#C8A24A] font-sans text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#C8A24A] hover:text-[#0F0F0F] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {addingToCart ? (
                            <CircularProgress size={14} sx={{ color: "#C8A24A" }} />
                        ) : moved ? (
                            "✓ Added to Bag"
                        ) : (
                            <>
                                <ShoppingBagOutlinedIcon sx={{ fontSize: 14 }} />
                                Move to Bag
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="pt-3 space-y-1">
                <h1 className="font-serif text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{STORE_NAME}</h1>
                <p className="text-charcoal font-sans text-xs tracking-wider line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-3 font-sans text-xs tracking-wider">
                    <span className="font-semibold text-charcoal">₹{formatPrice(item.sellingPrice)}</span>
                    <span className="text-gray-400 line-through">₹{formatPrice(item.mrpPrice)}</span>
                    {(item.discountPercent ?? 0) > 0 && (
                        <span className="text-brand-gold font-semibold">{item.discountPercent}% OFF</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistProductCard;
