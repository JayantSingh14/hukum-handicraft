import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PricingCard from '../Cart/PricingCard'
import { Alert, Box, FormControlLabel, Modal, Radio, RadioGroup, Snackbar } from '@mui/material'
import AddressForm from './AddresssForm'
import AddressCard from './AddressCard'
import AddIcon from '@mui/icons-material/Add';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { formatPrice } from '../../../util/formatPrice'

const paymentGatwayList = [
    { value: "COD", image: "", label: "Cash on Delivery" },
    {
        value: "RAZORPAY",
        image: "https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png",
        label: "Razorpay"
    },
    { value: "STRIPE", image: "/stripe_logo.png", label: "Stripe" },
]

const AddressPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user, orders, cart } = useAppSelector(store => store)

    useEffect(() => {
        if (!localStorage.getItem("jwt")) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [navigate, location.pathname]);
    const [value, setValue] = useState(0);
    const [paymentGateway, setPaymentGateway] = useState(paymentGatwayList[0].value);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event: any) => setValue(event.target.value);
    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentGateway(event.target.value);
    };

    const handleCreateOrder = () => {
        if (!user.user?.addresses?.length) {
            setCheckoutError("Please add a delivery address before checkout.");
            return;
        }
        setCheckoutError(null);
        dispatch(createOrder({
            paymentGateway,
            address: user.user.addresses[value],
            jwt: localStorage.getItem('jwt') || ""
        })).then((result) => {
            if (createOrder.rejected.match(result)) {
                setCheckoutError(result.payload as string);
            }
        });
    }

    return (
        <div className="pt-16 px-5 sm:px-10 md:px-24 lg:px-40 xl:px-60 min-h-screen bg-ivory">
            {/* Page Title */}
            <div className="pb-8 border-b border-brand-gold/15">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                    Secure Checkout
                </span>
                <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
                    Delivery & Payment
                </h1>
            </div>

            <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9 pt-8">

                {/* Left: Address Section */}
                <div className="col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-serif text-lg font-semibold text-matte-black tracking-wide">
                            Delivery Address
                        </h2>
                        <button
                            onClick={handleOpen}
                            className="flex items-center gap-1.5 border border-brand-gold/40 px-4 py-2 font-sans text-xs tracking-widest uppercase text-brand-gold hover:bg-brand-gold hover:text-white transition-all duration-200"
                        >
                            <AddIcon fontSize="small" />
                            New Address
                        </button>
                    </div>

                    <div className="space-y-3">
                        <p className="font-sans text-xs tracking-widest uppercase text-charcoal/50 font-semibold">
                            Saved Addresses
                        </p>
                        <div className="space-y-3">
                            {user.user?.addresses?.map((item, index) => (
                                <AddressCard
                                    key={item.id}
                                    item={item}
                                    selectedValue={value}
                                    value={index}
                                    handleChange={handleChange}
                                />
                            ))}
                        </div>
                        {/* Empty state */}
                        {!user.user?.addresses?.length && (
                            <div
                                onClick={handleOpen}
                                className="py-6 border border-dashed border-brand-gold/25 flex flex-col items-center justify-center gap-2 cursor-pointer group hover:border-brand-gold/60 transition-all duration-200"
                            >
                                <AddIcon sx={{ color: "#C8A24A", fontSize: "28px" }} />
                                <p className="font-sans text-xs text-charcoal/50 group-hover:text-charcoal tracking-wider uppercase">
                                    Add your first address
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Payment + Summary */}
                <div className="col-span-1 text-sm space-y-4">
                    {/* Payment Gateway */}
                    <section className="border border-brand-gold/20 bg-white px-5 py-4 space-y-4">
                        <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/60">
                            Payment Method
                        </h3>
                        <RadioGroup
                            row
                            aria-labelledby="payment-gateway-group"
                            name="payment-gateway"
                            className="flex flex-wrap gap-3"
                            onChange={handlePaymentChange}
                            value={paymentGateway}
                        >
                            {paymentGatwayList.map((item) => (
                                <FormControlLabel
                                    key={item.value}
                                    value={item.value}
                                    control={
                                        <Radio
                                            size="small"
                                            sx={{
                                                color: "rgba(200,162,74,0.4)",
                                                "&.Mui-checked": { color: "#C8A24A" }
                                            }}
                                        />
                                    }
                                    label={
                                        <div className="flex flex-col items-center py-1">
                                            {item.image ? (
                                                <img
                                                    className={`${item.value === "STRIPE" ? "w-14" : "w-20"} object-contain`}
                                                    src={item.image}
                                                    alt={item.label}
                                                />
                                            ) : (
                                                <span className="font-sans text-xs font-semibold text-charcoal text-center">
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>
                                    }
                                    className={`border w-full sm:w-[48%] md:w-[31%] justify-center rounded-none pr-2 transition-all duration-150 ${
                                        paymentGateway === item.value
                                            ? "border-brand-gold bg-brand-gold/5"
                                            : "border-charcoal/10"
                                    }`}
                                />
                            ))}
                        </RadioGroup>
                    </section>

                    {/* Order summary with product images (#5) */}
                    {cart.cart?.cartItems && cart.cart.cartItems.length > 0 && (
                        <section className="border border-brand-gold/20 bg-white px-5 py-4 space-y-3">
                            <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/60">
                                Order Summary ({cart.cart.cartItems.length} item{cart.cart.cartItems.length > 1 ? "s" : ""})
                            </h3>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {cart.cart.cartItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <img
                                            src={item.product?.images?.[0]}
                                            alt={item.product?.title}
                                            className="w-12 h-14 object-cover border border-brand-gold/10 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-xs text-charcoal/80 line-clamp-2 leading-tight">{item.product?.title}</p>
                                            <p className="font-sans text-[10px] text-charcoal/50 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-sans text-xs font-semibold text-matte-black shrink-0">₹{formatPrice(item.sellingPrice)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Price summary */}
                    <section className="border border-brand-gold/20 bg-white">
                        <PricingCard />
                        <div className="px-5 pb-5">
                            <button
                                onClick={handleCreateOrder}
                                disabled={orders.loading}
                                className="w-full py-3.5 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {orders.loading ? "Placing Order…" : "Place Order"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Add Address Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-address-modal"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 480 },
                        bgcolor: '#FAF8F2',
                        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                        p: 4,
                        borderRadius: 0,
                        border: '1px solid rgba(200,162,74,0.2)',
                    }}
                >
                    <AddressForm paymentGateway={paymentGateway} handleClose={handleClose} />
                </Box>
            </Modal>

            <Snackbar
                open={!!checkoutError}
                autoHideDuration={5000}
                onClose={() => setCheckoutError(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error" onClose={() => setCheckoutError(null)}>
                    {checkoutError}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AddressPage