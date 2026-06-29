import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShareIcon from "@mui/icons-material/Share";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Modal,
  Snackbar,
  TextField,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Wallet } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SmilarProduct from "../SimilarProduct/SmilarProduct";
import ZoomableImage from "./ZoomableImage";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { fetchProductById, clearProduct } from "../../../../Redux Toolkit/Customer/ProductSlice";
import { addItemToCart, fetchUserCart } from "../../../../Redux Toolkit/Customer/CartSlice";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import ProductReviewCard from "../../Review/ProductReviewCard";
import RatingCard from "../../Review/RatingCard";
import { fetchReviewsByProductId } from "../../../../Redux Toolkit/Customer/ReviewSlice";
import { createPersonalizedGift } from "../../../../Redux Toolkit/Customer/giftCatalogSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudnary";
import { STORE_NAME } from "../../../../util/storeConfig";
import { formatPrice } from "../../../../util/formatPrice";
import { saveRecentlyViewed } from "../../../../util/recentlyViewed";
import { isWishlisted } from "../../../../util/isWishlisted";
import RecentlyViewed from "../../../components/RecentlyViewed/RecentlyViewed";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "800px",
  maxHeight: "90vh",
  boxShadow: 24,
  outline: "none",
  bgcolor: "transparent",
};

const ProductDetails = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const { products, review, wishlist } = useAppSelector((store) => store);
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, categoryId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [cartLoading, setCartLoading] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  const product = products.product;
  const wishlisted = wishlist.wishlist ? isWishlisted(wishlist.wishlist, product as any) : false;
  const isOutOfStock = product?.quantity === 0;

  useEffect(() => {
    // Clear stale product immediately so the previous product never flashes
    dispatch(clearProduct());
    setSelectedImage(0);
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
      dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    }
    // Do NOT call getAllProducts here — it overwrites the Products page cache
    // and causes the back-button to re-fetch the whole list from scratch.
    // SmilarProduct uses whatever is already in store from the listing page.
  }, [productId, dispatch]);

  // Save to recently viewed
  useEffect(() => {
    if (product && product.id) {
      saveRecentlyViewed({
        id: product.id,
        title: product.title,
        images: product.images,
        sellingPrice: product.sellingPrice,
        mrpPrice: product.mrpPrice,
        discountPercent: product.discountPercent,
        giftCategory: product.giftCategory,
      });
    }
  }, [product?.id]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const image = await uploadToCloudinary(file);
    setUploadedImage(image);
    setUploading(false);
  };

  const handleAddCart = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setCartLoading(true);
    let personalizedGiftId: number | undefined;
    const wantsPersonalization = showPersonalization && (uploadedImage || customMessage.trim());

    if (product?.personalized && wantsPersonalization) {
      const result = await dispatch(createPersonalizedGift({ jwt, productId: Number(productId), uploadedImage, customMessage }));
      if (!createPersonalizedGift.fulfilled.match(result)) {
        setSnackbarMessage("Failed to save personalization details");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setCartLoading(false);
        return;
      }
      personalizedGiftId = result.payload.id;
    }

    const result = await dispatch(addItemToCart({ jwt, request: { productId: Number(productId), quantity, personalizedGiftId } }));
    if (addItemToCart.fulfilled.match(result)) {
      await dispatch(fetchUserCart(jwt));
      setSnackbarMessage("Added to bag successfully!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage((typeof result.payload === "string" && result.payload) || "Failed to add item to bag.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    setCartLoading(false);
  };

  const handleWishlist = () => {
    if (!localStorage.getItem("jwt")) { navigate("/login"); return; }
    if (product?.id) dispatch(addProductToWishlist({ productId: product.id }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.title, text: `Check out ${product?.title} on HUKUM`, url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage("Link copied to clipboard!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleNotifyMe = () => {
    if (notifyEmail.trim()) {
      setNotifySent(true);
      setSnackbarMessage("We'll notify you when this item is back in stock!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  // Breadcrumb label
  const categoryLabel = categoryId
    ? categoryId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "Products";

  return (
    <div className="px-5 lg:px-20 pt-6 pb-20">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Breadcrumbs (#10) */}
      <nav className="flex items-center gap-1 mb-6 font-sans text-xs text-charcoal/50">
        <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
        <NavigateNextIcon sx={{ fontSize: 14 }} />
        <Link to="/products" className="hover:text-brand-gold transition-colors">Products</Link>
        {categoryId && (
          <>
            <NavigateNextIcon sx={{ fontSize: 14 }} />
            <Link to={`/products/${categoryId}`} className="hover:text-brand-gold transition-colors">{categoryLabel}</Link>
          </>
        )}
        <NavigateNextIcon sx={{ fontSize: 14 }} />
        <span className="text-charcoal/80 truncate max-w-[160px]">{product?.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-row overflow-x-auto lg:flex-col gap-3 scrollbar-none pb-2">
            {product?.images.map((item, index) => (
              <img
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-[50px] h-[60px] object-cover cursor-pointer shrink-0 transition-all duration-200 ${selectedImage === index ? "border-2 border-brand-gold" : "border border-brand-gold/10 opacity-70 hover:opacity-100"}`}
                src={item}
                alt=""
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              onClick={() => setOpen(true)}
              className="w-full cursor-zoom-in"
              src={product?.images[selectedImage]}
              alt=""
            />
          </div>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
              <ZoomableImage src={product?.images[selectedImage] || ""} alt="" />
            </Box>
          </Modal>
        </section>

        {/* Details */}
        <section>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-serif font-bold text-xl text-matte-black uppercase tracking-wider">{STORE_NAME}</h1>
              <p className="text-charcoal/70 font-sans mt-1 text-sm tracking-wide">{product?.title}</p>
              {product?.giftCategory && (
                <p className="text-xs text-brand-gold mt-1 capitalize font-medium tracking-widest uppercase">{product.giftCategory.toLowerCase()} gift</p>
              )}
            </div>
            {/* Share button (#23) */}
            <button
              onClick={handleShare}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                border: "1px solid rgba(200,162,74,0.25)", padding: "6px 12px",
                background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif",
                fontSize: "0.65rem", letterSpacing: "0.1em", color: "#5a4a3a",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget).style.borderColor = "#C8A24A"; (e.currentTarget).style.color = "#C8A24A"; }}
              onMouseLeave={e => { (e.currentTarget).style.borderColor = "rgba(200,162,74,0.25)"; (e.currentTarget).style.color = "#5a4a3a"; }}
            >
              <ShareIcon sx={{ fontSize: 14 }} /> Share
            </button>
          </div>

          {/* Rating */}
          <div className="flex justify-between items-center py-1.5 border border-[#C8A24A]/25 w-[180px] px-3 mt-5 bg-white/50">
            <div className="flex gap-1 items-center">
              <span className="font-sans text-sm font-semibold">4</span>
              <StarIcon sx={{ color: "#C8A24A", fontSize: "16px" }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span className="font-sans text-xs tracking-wider text-charcoal/80">{product?.numRatings || 0} Ratings</span>
          </div>

          {/* Price (#21) */}
          <div className="space-y-1 mt-5">
            <div className="price flex items-center gap-3 text-lg font-sans">
              <span className="font-semibold text-charcoal text-xl">₹{formatPrice(product?.sellingPrice ?? 0)}</span>
              <span className="text-gray-400 line-through text-sm">₹{formatPrice(product?.mrpPrice ?? 0)}</span>
              {(product?.discountPercent ?? 0) > 0 && (
                <span className="text-brand-gold font-semibold text-sm">{product?.discountPercent}% OFF</span>
              )}
            </div>
            <p className="text-xs text-charcoal/50 font-sans">Inclusive of all taxes. Free gift wrapping above ₹1,500.</p>
          </div>

          {product?.occasion && (
            <div className="mt-3 text-sm text-gray-600">
              <p>Occasion: {product.occasion.name}</p>
            </div>
          )}

          {/* Trust badges (#9) */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { icon: <ShieldIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />, text: "Authentic & Quality Assured" },
              { icon: <WorkspacePremiumIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />, text: "100% Money Back Guarantee" },
              { icon: <LocalShippingIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />, text: "Free Shipping above ₹999" },
              { icon: <Wallet sx={{ color: "#C8A24A", fontSize: "18px" }} />, text: "Cash on Delivery Available" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 border border-brand-gold/15 px-3 py-2 bg-white/50">
                {badge.icon}
                <p className="font-sans text-[10px] text-charcoal/70 leading-tight">{badge.text}</p>
              </div>
            ))}
          </div>

          {/* Personalization */}
          {product?.personalized && (
            <div className="mt-6 space-y-3 border border-brand-gold/20 p-4 bg-brand-gold/5">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPersonalization}
                    onChange={(e) => setShowPersonalization(e.target.checked)}
                    sx={{ color: "#C8A24A", "&.Mui-checked": { color: "#C8A24A" } }}
                  />
                }
                label={<span className="font-semibold text-charcoal text-xs uppercase tracking-wider">Add Personalization (optional)</span>}
              />
              {showPersonalization && (
                <div className="space-y-3 pt-2">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs" />
                  {uploading && <p className="text-xs text-charcoal/50">Uploading photo…</p>}
                  {uploadedImage && <img src={uploadedImage} alt="Personalized" className="w-20 h-20 object-cover border border-brand-gold/20" />}
                  <TextField fullWidth multiline rows={3} size="small" label="Custom message (optional)" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* Quantity selector (#12) */}
          {!isOutOfStock && (
            <div className="mt-7">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/50 font-semibold mb-3">Quantity</p>
              <div className="flex items-center border border-brand-gold/30 w-fit">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal disabled:opacity-30 hover:bg-brand-gold/10 transition-colors"
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-sans text-sm font-semibold text-matte-black border-x border-brand-gold/30">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-brand-gold/10 transition-colors"
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons / Notify Me (#19, #24) */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
            {isOutOfStock ? (
              <div className="w-full space-y-3">
                <div className="w-full py-3.5 bg-gray-100 border border-gray-200 text-center">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal/40 font-semibold">Out of Stock</span>
                </div>
                {!notifySent ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.value)}
                      className="flex-1 border border-brand-gold/25 px-3 py-2 font-sans text-xs outline-none focus:border-brand-gold"
                    />
                    <button
                      onClick={handleNotifyMe}
                      className="flex items-center gap-1.5 px-4 py-2 border border-brand-gold text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-brand-gold hover:text-white transition-all duration-200 whitespace-nowrap"
                    >
                      <NotificationsNoneIcon sx={{ fontSize: 14 }} /> Notify Me
                    </button>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-brand-gold text-center">✓ We'll email you when it's back in stock</p>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleAddCart}
                  disabled={cartLoading}
                  className="flex-1 py-4 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {cartLoading ? <CircularProgress size={16} sx={{ color: "#C8A24A" }} /> : <><AddShoppingCartIcon sx={{ fontSize: 16 }} /> Add to Bag</>}
                </button>
                <button
                  onClick={handleWishlist}
                  className="flex-1 sm:flex-none sm:px-8 py-4 border border-matte-black text-matte-black font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-matte-black hover:text-brand-gold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {wishlisted ? <FavoriteIcon sx={{ fontSize: 16, color: "#C8A24A" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-brand-gold/10">
            <p className="font-sans text-sm text-charcoal/70 leading-relaxed">{product?.description}</p>
          </div>

          {/* Reviews */}
          <div className="ratings w-full mt-10">
            <h2 className="font-serif text-lg font-semibold pb-4 text-matte-black">Reviews & Ratings</h2>
            <RatingCard totalReview={review.reviews.length} />
            <div className="mt-8 space-y-5">
              {review.reviews.slice(0, 3).map((item) => (
                <div key={item.id} className="space-y-5">
                  <ProductReviewCard item={item} />
                  <Divider />
                </div>
              ))}
              {review.reviews.length > 0 && (
                <button
                  onClick={() => navigate(`/reviews/${productId}`)}
                  className="font-sans text-xs tracking-widest uppercase text-brand-gold hover:underline"
                >
                  View All {review.reviews.length} Reviews →
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-20">
        <h2 className="font-serif text-lg font-bold text-matte-black">Similar Gifts</h2>
        <div className="pt-5">
          <SmilarProduct />
        </div>
      </section>

      <RecentlyViewed excludeId={product?.id} />
    </div>
  );
};

export default ProductDetails;
