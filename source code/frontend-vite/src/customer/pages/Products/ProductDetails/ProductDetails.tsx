import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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
import SmilarProduct from "../SimilarProduct/SmilarProduct";
import ZoomableImage from "./ZoomableImage";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, getAllProducts } from "../../../../Redux Toolkit/Customer/ProductSlice";
import { addItemToCart, fetchUserCart } from "../../../../Redux Toolkit/Customer/CartSlice";
import ProductReviewCard from "../../Review/ProductReviewCard";
import RatingCard from "../../Review/RatingCard";
import { fetchReviewsByProductId } from "../../../../Redux Toolkit/Customer/ReviewSlice";
import { createPersonalizedGift } from "../../../../Redux Toolkit/Customer/giftCatalogSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudnary";
import { mapCategoryIdToGiftCategory } from "../../../../util/giftCategoryMapper";
import { STORE_NAME } from "../../../../util/storeConfig";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  height: "100%",
  boxShadow: 24,
  outline: "none",
};

const ProductDetails = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const { products, review } = useAppSelector((store) => store);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
      dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    }
    const giftCategory = mapCategoryIdToGiftCategory(categoryId);
    dispatch(getAllProducts({ giftCategory }));
  }, [productId, categoryId, dispatch]);

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
      setSnackbarMessage("Please login to add items to your bag");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      navigate("/login");
      return;
    }

    let personalizedGiftId: number | undefined;

    const wantsPersonalization =
      showPersonalization && (uploadedImage || customMessage.trim());

    if (product?.personalized && wantsPersonalization) {
      const result = await dispatch(
        createPersonalizedGift({
          jwt,
          productId: Number(productId),
          uploadedImage,
          customMessage,
        })
      );
      if (!createPersonalizedGift.fulfilled.match(result)) {
        setSnackbarMessage("Failed to save personalization details");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      personalizedGiftId = result.payload.id;
    }

    const result = await dispatch(
      addItemToCart({
        jwt,
        request: {
          productId: Number(productId),
          quantity,
          personalizedGiftId,
        },
      })
    );

    if (addItemToCart.fulfilled.match(result)) {
      await dispatch(fetchUserCart(jwt));
      setSnackbarMessage("Added to bag successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      const errorMsg =
        (typeof result.payload === "string" && result.payload) ||
        "Failed to add item to bag. Please try again.";
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const product = products.product;

  return (
    <div className="px-5 lg:px-20 pt-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {product?.images.map((item, index) => (
              <img
                key={index}
                onClick={() => setSelectedImage(index)}
                className="lg:w-full w-[50px] cursor-pointer rounded-md"
                src={item}
                alt=""
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              onClick={() => setOpen(true)}
              className="w-full rounded-md cursor-zoom-out"
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

        <section>
          <h1 className="font-serif font-bold text-xl text-matte-black uppercase tracking-wider">{STORE_NAME}</h1>
          <p className="text-charcoal/70 font-sans mt-1 text-sm tracking-wide">{product?.title}</p>
          {product?.giftCategory && (
            <p className="text-xs text-brand-gold mt-1 capitalize font-medium tracking-widest uppercase">{product.giftCategory.toLowerCase()} gift</p>
          )}

          <div className="flex justify-between items-center py-1.5 border border-[#C8A24A]/25 w-[180px] px-3 mt-5 bg-white/50">
            <div className="flex gap-1 items-center">
              <span className="font-sans text-sm font-semibold">4</span>
              <StarIcon sx={{ color: "#C8A24A", fontSize: "16px" }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span className="font-sans text-xs tracking-wider text-charcoal/80">{product?.numRatings || 0} Ratings</span>
          </div>

          <div className="space-y-2">
            <div className="price flex items-center gap-3 mt-5 text-lg font-sans">
              <span className="font-semibold text-charcoal">₹{product?.sellingPrice}</span>
              <span className="text-gray-400 line-through">₹{product?.mrpPrice}</span>
              <span className="text-brand-gold font-semibold">{product?.discountPercent}% OFF</span>
            </div>
            <p className="text-sm">Inclusive of all taxes. Free gift wrapping above ₹1500.</p>
          </div>

          {product?.occasion && (
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>Occasion: {product.occasion.name}</p>
            </div>
          )}

          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4 text-sm text-charcoal/80">
              <ShieldIcon sx={{ color: "#C8A24A", fontSize: "20px" }} />
              <p>Authentic & Quality Assured</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/80">
              <WorkspacePremiumIcon sx={{ color: "#C8A24A", fontSize: "20px" }} />
              <p>100% money back guarantee</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/80">
              <LocalShippingIcon sx={{ color: "#C8A24A", fontSize: "20px" }} />
              <p>Free Shipping & Gift Wrapping</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/80">
              <Wallet sx={{ color: "#C8A24A", fontSize: "20px" }} />
              <p>Pay on delivery might be available</p>
            </div>
          </div>

          {product?.personalized && (
            <div className="mt-7 space-y-3 border p-4 rounded-md bg-gray-50">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPersonalization}
                    onChange={(e) => setShowPersonalization(e.target.checked)}
                    sx={{ color: "#C8A24A", "&.Mui-checked": { color: "#C8A24A" } }}
                  />
                }
                label={<span className="font-semibold text-charcoal text-sm uppercase tracking-wider">Add personalization (optional)</span>}
              />
              <p className="text-sm text-gray-500">
                You can buy this gift as-is, or add a custom photo and message if you wish.
              </p>
              {showPersonalization && (
                <div className="space-y-3 pt-2">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  {uploading && <p className="text-sm text-gray-500">Uploading photo...</p>}
                  {uploadedImage && (
                    <img src={uploadedImage} alt="Personalized" className="w-24 h-24 object-cover rounded" />
                  )}
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Custom message (optional)"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-7 space-y-2">
            <h1>QUANTITY:</h1>
            <div className="flex items-center gap-2 w-[140px] justify-between">
              <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)} variant="outlined">
                <RemoveIcon />
              </Button>
              <span className="px-3 text-lg font-semibold">{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)} variant="outlined">
                <AddIcon />
              </Button>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <Button onClick={handleAddCart} sx={{ py: "1rem" }} variant="contained" fullWidth startIcon={<AddShoppingCartIcon />}>
              Add To Bag
            </Button>
            <Button sx={{ py: "1rem" }} variant="outlined" fullWidth startIcon={<FavoriteBorderIcon />}>
              Wishlist
            </Button>
          </div>

          <div className="mt-5">
            <p>{product?.description}</p>
          </div>

          <div className="ratings w-full mt-10">
            <h1 className="font-semibold text-lg pb-4">Review & Ratings</h1>
            <RatingCard totalReview={review.reviews.length} />
            <div className="mt-10 space-y-5">
              {review.reviews.map((item) => (
                <div key={item.id} className="space-y-5">
                  <ProductReviewCard item={item} />
                  <Divider />
                </div>
              ))}
              <Button onClick={() => navigate(`/reviews/${productId}`)}>
                View All {review.reviews.length} Reviews
              </Button>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-20">
        <h1 className="text-lg font-bold">Similar Gifts</h1>
        <div className="pt-5">
          <SmilarProduct />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
