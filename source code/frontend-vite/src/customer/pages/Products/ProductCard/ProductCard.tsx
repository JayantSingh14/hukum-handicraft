import React, { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, IconButton, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { isWishlisted } from "../../../../util/isWishlisted";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ChatBot from "../../ChatBot/ChatBot";
import { STORE_NAME } from "../../../../util/storeConfig";

interface ProductCardProps {
    item: Product;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    maxWidth: "400px",
    borderRadius: ".5rem",
    boxShadow: 24,
    outline: "none",
};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    // Track which images have finished loading for shimmer fade-in
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showChatBot, setShowChatBot] = useState(false);

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    // card is considered "loaded" once at least one image has resolved
    const isCardLoaded = Object.keys(loadedImages).length > 0;

    const handleAddWishlist = (event: MouseEvent) => {
        event.stopPropagation();
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    useEffect(() => {
        let interval: any;
        if (isHovered && item.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000); // Change image every 1 second
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);

    const handleShowChatBot = (event: MouseEvent) => {
        event.stopPropagation();
        setShowChatBot(true);
    };

    const handleCloseChatBot = (e: any) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        setShowChatBot(false);
    };

    return (
        <>
            <div
                onClick={() =>
                    navigate(
                        `/product-details/${item.giftCategory?.toLowerCase() || "gifts"}/${item.title}/${item.id}`
                    )
                }
                className="group px-1 sm:px-4 relative cursor-pointer"
            >
                <div
                    className={`card border border-[#C8A24A]/10 overflow-hidden relative${isCardLoaded ? ' loaded' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setCurrentImage(0);
                    }}
                >
                    {item.images.map((image: any, index: number) => (
                        <img
                            key={index}
                            className={`card-media object-top${loadedImages[index] ? ' img-loaded' : ''}`}
                            src={image}
                            alt={`product-${index}`}
                            loading="lazy"
                            onLoad={() => handleImageLoad(index)}
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                            }}
                        />
                    ))}
                    {/* Always visible Wishlist Button overlay */}
                    {wishlist.wishlist && (
                        <IconButton
                            onClick={handleAddWishlist}
                            className="absolute top-3 right-3 z-30 transition-all duration-200"
                            sx={{
                                bgcolor: "rgba(250, 248, 242, 0.95)",
                                color: isWishlisted(wishlist.wishlist, item) ? "#C8A24A" : "#1A1A1A",
                                border: "1px solid rgba(200, 162, 74, 0.3)",
                                backdropFilter: "blur(4px)",
                                p: 1,
                                "&:hover": {
                                    bgcolor: "#0F0F0F",
                                    color: "#FAF8F2",
                                    borderColor: "#0F0F0F",
                                }
                            }}
                        >
                            {isWishlisted(wishlist.wishlist, item) ? (
                                <FavoriteIcon sx={{ fontSize: 16 }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                            )}
                        </IconButton>
                    )}

                    {isHovered && (
                        <div className="indicator flex flex-col items-center space-y-3">
                            <div className="flex gap-2 bg-matte-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                {item.images.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        className={`indicator-button !w-1.5 !h-1.5 ${index === currentImage ? "active" : ""
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImage(index);
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <IconButton 
                                    onClick={handleShowChatBot} 
                                    sx={{
                                        bgcolor: "rgba(250, 248, 242, 0.95)",
                                        color: "#1A1A1A",
                                        border: "1px solid rgba(200, 162, 74, 0.3)",
                                        backdropFilter: "blur(4px)",
                                        p: 1,
                                        "&:hover": {
                                            bgcolor: "#0F0F0F",
                                            color: "#FAF8F2",
                                            borderColor: "#0F0F0F",
                                        }
                                    }}
                                >
                                    <ModeCommentIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </div>
                        </div>
                    )}
                </div>
                <div className="details pt-3 space-y-1 transition-all duration-300">
                    <div className="name space-y-0.5">
                        <h1 className="font-serif text-xs font-semibold tracking-widest text-brand-gold uppercase">{STORE_NAME}</h1>
                        <p className="text-charcoal font-sans text-xs tracking-wider line-clamp-1">{item.title}</p>
                    </div>
                    <div className="price flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs tracking-wider">
                        <span className="font-semibold text-charcoal">
                            ₹{item.sellingPrice}
                        </span>
                        <span className="text-gray-400 line-through">
                            ₹{item.mrpPrice}
                        </span>
                        <span className="text-brand-gold font-semibold">
                            {item.discountPercent}% OFF
                        </span>
                    </div>
                </div>
            </div>
            {showChatBot && (
                <section className="absolute left-16 top-0">
                    <Modal
                        open={true}
                        onClose={handleCloseChatBot}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <ChatBot handleClose={handleCloseChatBot} productId={item.id} />
                        </Box>
                    </Modal>
                </section>
            )}
        </>
    );
};

export default ProductCard;
