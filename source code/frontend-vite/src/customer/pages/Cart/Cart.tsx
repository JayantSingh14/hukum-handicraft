import { Alert, Button, IconButton, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartItemCard from "./CartItemCard";
import { useNavigate } from "react-router-dom";
import PricingCard from "./PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchUserCart } from "../../../Redux Toolkit/Customer/CartSlice";
import type { CartItem } from "../../../types/cartTypes";
import { applyCoupon } from "../../../Redux Toolkit/Customer/CouponSlice";
import { Close } from "@mui/icons-material";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, auth, coupone } = useAppSelector((store) => store);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
  }, [auth.jwt]);

  const handleChange = (e: any) => setCouponCode(e.target.value);

  const handleApllyCoupon = (apply: string) => {
    const code = apply === "false" ? cart.cart?.couponCode || "" : couponCode;
    dispatch(
      applyCoupon({
        apply,
        code,
        orderValue: cart.cart?.totalSellingPrice || 100,
        jwt: localStorage.getItem("jwt") || "",
      })
    );
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    if (coupone.couponApplied || coupone.error) {
      setOpenSnackbar(true);
      setCouponCode("");
    }
  }, [coupone.couponApplied, coupone.error]);

  return (
    <>
      {cart.cart && cart.cart?.cartItems.length !== 0 ? (
        <div className="pt-16 px-5 sm:px-10 md:px-24 lg:px-40 xl:px-60 min-h-screen bg-ivory">
          {/* Page Title */}
          <div className="pb-8 border-b border-brand-gold/15">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
              Shopping Cart
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cart?.cartItems.map((item: CartItem) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-span-1 space-y-4">
              {/* Coupon */}
              <div className="border border-brand-gold/20 px-5 py-4 bg-white space-y-4">
                <div className="flex gap-2 items-center">
                  <LocalOfferIcon sx={{ color: "#C8A24A", fontSize: "16px" }} />
                  <span className="font-sans text-xs tracking-widest uppercase text-charcoal/70 font-semibold">
                    Apply Coupon
                  </span>
                </div>
                {!cart.cart?.couponCode ? (
                  <div className="flex gap-2 items-center">
                    <TextField
                      value={couponCode}
                      onChange={handleChange}
                      placeholder="Enter coupon code"
                      size="small"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0,
                          fontSize: "0.8rem",
                          "& fieldset": { borderColor: "rgba(200,162,74,0.3)" },
                          "&:hover fieldset": { borderColor: "#C8A24A" },
                          "&.Mui-focused fieldset": { borderColor: "#C8A24A" },
                        },
                      }}
                    />
                    <Button
                      onClick={() => handleApllyCoupon("true")}
                      disabled={!couponCode}
                      size="small"
                      sx={{
                        borderRadius: 0,
                        px: 2,
                        py: "7px",
                        bgcolor: "#C8A24A",
                        color: "#fff",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        "&:hover": { bgcolor: "#0F0F0F" },
                        "&.Mui-disabled": { bgcolor: "#e5e5e5", color: "#999" },
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 py-2 px-4 border border-brand-gold/30 bg-brand-gold/5 flex justify-between items-center">
                      <span className="font-sans text-xs font-semibold text-brand-gold tracking-wider">
                        {cart.cart.couponCode} — Applied
                      </span>
                      <IconButton
                        onClick={() => handleApllyCoupon("false")}
                        size="small"
                        sx={{ color: "#ef4444", p: 0.5 }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Price summary + Buy */}
              <section className="border border-brand-gold/20 bg-white">
                <PricingCard />
                <div className="px-5 pb-5">
                  <button
                    onClick={() => navigate("/checkout/address")}
                    className="w-full py-3.5 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </section>

              {/* Wishlist CTA */}
              <div
                onClick={() => navigate("/wishlist")}
                className="border border-brand-gold/15 px-5 py-3.5 flex justify-between items-center cursor-pointer group hover:border-brand-gold/50 transition-all duration-200 bg-white"
              >
                <span className="font-sans text-xs tracking-widest uppercase text-charcoal/70 group-hover:text-matte-black">
                  Add from Wishlist
                </span>
                <FavoriteIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[85vh] flex justify-center items-center flex-col gap-6 bg-ivory">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto border border-brand-gold/30 flex items-center justify-center">
              <FavoriteIcon sx={{ color: "#C8A24A", fontSize: "28px" }} />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-matte-black tracking-wide">
              Your cart is empty
            </h1>
            <p className="font-sans text-sm text-charcoal/60 max-w-xs mx-auto">
              Explore our curated collection and add artisan pieces you love.
            </p>
          </div>
          <button
            onClick={() => navigate("/wishlist")}
            className="px-8 py-3 border border-matte-black text-matte-black font-sans text-xs tracking-[0.2em] uppercase hover:bg-matte-black hover:text-brand-gold transition-all duration-300"
          >
            Add from Wishlist
          </button>
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={coupone.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%", borderRadius: 0 }}
        >
          {coupone.error ? coupone.error : "Coupon applied successfully"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;
