import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";
import { fetchUserCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessHandler = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    const getQueryParam = (key: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");
    const isCodOrder = getQueryParam("cod") === "true";

    useEffect(() => {
        if (isCodOrder) {
            dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
            setShowSuccess(true);
            return;
        }

        if (paymentId) {
            dispatch(
                paymentSuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt: localStorage.getItem("jwt") || "",
                })
            ).then((result) => {
                if (paymentSuccess.fulfilled.match(result)) {
                    dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
                    setShowSuccess(true);
                }
            });
        }
    }, [dispatch, isCodOrder, paymentId, paymentLinkId]);

    return (
        <div className="min-h-[90vh] flex justify-center items-center">
            {showSuccess ? (
                <div className="bg-matte-black border border-brand-gold/30 text-ivory p-10 w-[90%] lg:w-[28%] flex flex-col gap-6 items-center justify-center min-h-[40vh]">
                    <div className="w-14 h-14 border border-brand-gold/40 flex items-center justify-center">
                        <span className="text-brand-gold text-2xl">✓</span>
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="font-serif text-2xl font-bold text-brand-gold tracking-wider uppercase">Order Confirmed</h1>
                        <p className="font-sans text-sm text-ivory/70">
                            {isCodOrder
                                ? "Your order has been placed. You can pay on delivery."
                                : "Your order was placed successfully. Thank you for choosing HUKUM."}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-2 px-8 py-3 border border-brand-gold text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </div>
    );
};

export default PaymentSuccessHandler;
