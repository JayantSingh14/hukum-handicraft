import { Divider } from "@mui/material";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = () => {
  const { cart } = useAppSelector((store) => store);

  const discount =
    sumCartItemMrpPrice(cart.cart?.cartItems || []) -
    sumCartItemSellingPrice(cart.cart?.cartItems || []);

  const rows = [
    { label: "Subtotal", value: `₹ ${cart.cart?.totalMrpPrice}` },
    { label: "Discount", value: `-₹ ${discount}`, highlight: true },
    { label: "Shipping", value: "₹ 79" },
    { label: "Platform Fee", value: "Free", free: true },
  ];

  return (
    <div>
      <div className="px-5 pt-5 pb-3 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between items-center font-sans text-sm">
            <span className="text-charcoal/60 uppercase tracking-wider text-xs">{r.label}</span>
            <span
              className={
                r.free
                  ? "text-brand-gold font-semibold text-xs"
                  : r.highlight
                  ? "text-emerald-600 font-medium text-xs"
                  : "text-charcoal font-medium"
              }
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <Divider sx={{ borderColor: "rgba(200,162,74,0.15)" }} />
      <div className="font-serif px-5 py-4 flex justify-between items-center">
        <span className="text-matte-black font-semibold tracking-wide">Total Amount</span>
        <span className="text-matte-black font-bold text-lg">₹ {cart.cart?.totalSellingPrice}</span>
      </div>
    </div>
  );
};

export default PricingCard;
