import { Box, Button, Divider } from '@mui/material'
import { useEffect } from 'react'
import PaymentsIcon from '@mui/icons-material/Payments';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { STORE_NAME } from '../../../util/storeConfig';

const OrderDetails = () => {
  const dispatch = useAppDispatch()
  const { auth, orders } = useAppSelector(store => store);
  const { orderItemId, orderId } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrderItemById({
      orderItemId: Number(orderItemId),
      jwt: localStorage.getItem("jwt") || ""
    }))
    dispatch(fetchOrderById({
      orderId: Number(orderId),
      jwt: localStorage.getItem("jwt") || ""
    }))
  }, [auth.jwt])

  if (!orders.orders || !orders.orderItem) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <p className="font-sans text-charcoal/50 text-sm tracking-wider">No order found.</p>
      </div>
    );
  }

  const orderItem = orders.orderItem;
  const product = orderItem.product;

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId))
  }

  const isCancelled = orders.currentOrder?.orderStatus === "CANCELLED";

  return (
    <Box className="space-y-5">
      {/* Product hero */}
      <section className="flex flex-col gap-4 items-center py-6 border border-brand-gold/15 bg-white">
        <img
          className="w-[110px] h-[140px] object-cover border border-brand-gold/10"
          src={product?.images?.[0] ?? ""}
          alt={product?.title}
        />
        <div className="text-center space-y-1">
          <h1 className="font-serif font-bold text-lg text-matte-black uppercase tracking-widest">
            {STORE_NAME}
          </h1>
          <p className="font-sans text-sm text-charcoal/70">{product?.title}</p>
        </div>
        <button
          onClick={() => product?.id && navigate(`/reviews/${product.id}/create`)}
          className="px-6 py-2 border border-brand-gold/40 text-brand-gold font-sans text-xs tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-200"
        >
          Write a Review
        </button>
      </section>

      {/* Order Stepper */}
      <section className="border border-brand-gold/15 p-5 bg-white">
        <div className="flex justify-between items-start pb-4">
          <p className="font-sans text-xs tracking-widest uppercase text-charcoal/50 font-semibold">
            Order Status
          </p>
          {orders.currentOrder?.orderStatus !== "DELIVERED" && orders.currentOrder?.orderStatus !== "CANCELLED" && (
            <div className="text-right">
              <p className="font-sans text-[9px] tracking-widest uppercase text-charcoal/40 font-semibold">Expected Delivery</p>
              <p className="font-sans text-xs font-semibold text-brand-gold mt-0.5">
                {orders.currentOrder?.orderStatus === "PENDING"
                  ? "5–7 business days"
                  : orders.currentOrder?.orderStatus === "CONFIRMED"
                  ? "4–6 business days"
                  : orders.currentOrder?.orderStatus === "PACKED"
                  ? "3–5 business days"
                  : orders.currentOrder?.orderStatus === "SHIPPED"
                  ? "1–3 business days"
                  : "–"}
              </p>
            </div>
          )}
          {orders.currentOrder?.orderStatus === "DELIVERED" && (
            <p className="font-sans text-xs font-semibold text-emerald-600">✓ Delivered</p>
          )}
        </div>
        <OrderStepper orderStatus={orders.currentOrder?.orderStatus} />
      </section>

      {/* Delivery Address */}
      <div className="border border-brand-gold/15 p-5 bg-white space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <LocalShippingIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />
          <h2 className="font-sans text-xs tracking-widest uppercase text-charcoal/60 font-semibold">
            Delivery Address
          </h2>
        </div>
        <div className="space-y-1 font-sans text-sm">
          <div className="flex gap-5 font-medium text-matte-black">
            <p>{orders.currentOrder?.shippingAddress.name}</p>
            <Divider flexItem orientation="vertical" sx={{ borderColor: "rgba(200,162,74,0.2)" }} />
            <p>{orders.currentOrder?.shippingAddress.mobile}</p>
          </div>
          <p className="text-charcoal/60 text-xs leading-relaxed">
            {orders.currentOrder?.shippingAddress.address},{" "}
            {orders.currentOrder?.shippingAddress.city},{" "}
            {orders.currentOrder?.shippingAddress.state} —{" "}
            {orders.currentOrder?.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      {/* Pricing + Payment */}
      <div className="border border-brand-gold/15 bg-white space-y-4 pb-2">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p className="font-serif font-bold text-matte-black">Item Price</p>
            <p className="font-sans text-xs text-charcoal/60">
              You saved{" "}
              <span className="text-emerald-600 font-semibold">
                ₹{orderItem.mrpPrice - orderItem.sellingPrice}
              </span>{" "}
              on this item
            </p>
          </div>
          <p className="font-sans font-semibold text-matte-black">₹{orderItem.sellingPrice}</p>
        </div>

        <div className="px-5">
          <div className="flex items-center gap-3 border border-brand-gold/20 bg-brand-gold/5 px-4 py-2.5">
            <PaymentsIcon sx={{ color: "#C8A24A", fontSize: "18px" }} />
            <p className="font-sans text-xs tracking-wider text-charcoal/70 uppercase font-semibold">
              Pay on Delivery
            </p>
          </div>
        </div>

        <Divider sx={{ borderColor: "rgba(200,162,74,0.12)" }} />

        <div className="px-5 pb-4">
          <Button
            disabled={isCancelled}
            onClick={handleCancelOrder}
            color="error"
            sx={{
              py: "0.7rem",
              borderRadius: 0,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              "&.Mui-disabled": { opacity: 0.45 }
            }}
            variant="outlined"
            fullWidth
          >
            {isCancelled ? "Order Cancelled" : "Cancel Order"}
          </Button>
        </div>
      </div>
    </Box>
  )
}

export default OrderDetails