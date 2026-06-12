import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select, MenuItem, FormControl, InputLabel, TextField, Divider,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchAdminOrderById, updateOrderStatus } from "../../../Redux Toolkit/Admin/adminOrderSlice";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED", "REFUNDED"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontSize: "0.8rem",
    "& fieldset": { borderColor: "rgba(200,162,74,0.25)" },
    "&:hover fieldset": { borderColor: "#C8A24A" },
    "&.Mui-focused fieldset": { borderColor: "#C8A24A" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#C8A24A" },
};

const InfoCard = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white border border-brand-gold/15 p-5 space-y-4">
    <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-3">
      {icon && <span style={{ color: "#C8A24A" }}>{icon}</span>}
      <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/60">{title}</h2>
    </div>
    {children}
  </div>
);

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedOrder } = useAppSelector((s) => s.adminOrders);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (orderId) dispatch(fetchAdminOrderById(Number(orderId)));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (selectedOrder) setNewStatus(selectedOrder.orderStatus);
  }, [selectedOrder]);

  const handleUpdateStatus = () => {
    if (orderId && newStatus) {
      dispatch(updateOrderStatus({ orderId: Number(orderId), status: newStatus, note }));
    }
  };

  if (!selectedOrder) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-sans text-xs text-charcoal/40 tracking-wider">Loading order details…</p>
      </div>
    );
  }

  const addr = selectedOrder.shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
            Order Details
          </span>
          <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
            {selectedOrder.orderId || `#${selectedOrder.id}`}
          </h1>
        </div>
        <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border border-brand-gold/30 bg-brand-gold/8 text-brand-gold">
          {selectedOrder.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <InfoCard title="Customer Information" icon={<PersonIcon fontSize="small" />}>
          <div className="space-y-2 font-sans text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/50 text-xs uppercase tracking-wider">Name</span>
              <span className="font-semibold text-matte-black">{selectedOrder.user?.fullName}</span>
            </div>
            <Divider sx={{ borderColor: "rgba(200,162,74,0.1)" }} />
            <div className="flex justify-between">
              <span className="text-charcoal/50 text-xs uppercase tracking-wider">Email</span>
              <span className="text-charcoal text-xs">{selectedOrder.user?.email}</span>
            </div>
            <Divider sx={{ borderColor: "rgba(200,162,74,0.1)" }} />
            <div className="flex justify-between">
              <span className="text-charcoal/50 text-xs uppercase tracking-wider">Mobile</span>
              <span className="text-charcoal text-xs">{selectedOrder.user?.mobile || "—"}</span>
            </div>
          </div>
        </InfoCard>

        {/* Shipping Address */}
        <InfoCard title="Shipping Address" icon={<LocalShippingIcon fontSize="small" />}>
          {addr ? (
            <div className="space-y-1 font-sans text-sm">
              <p className="font-semibold text-matte-black">{addr.name}</p>
              <p className="text-charcoal/70 text-xs leading-relaxed">
                {addr.address}{addr.locality ? `, ${addr.locality}` : ""}
              </p>
              <p className="text-charcoal/70 text-xs">
                {addr.city}, {addr.state} — {addr.pinCode}
              </p>
              <p className="text-charcoal/50 text-xs pt-1">
                <strong className="font-semibold text-charcoal">Mobile:</strong> {addr.mobile}
              </p>
            </div>
          ) : (
            <p className="font-sans text-xs text-charcoal/40 italic">No address recorded.</p>
          )}
        </InfoCard>

        {/* Payment */}
        <InfoCard title="Payment Details" icon={<PaymentsIcon fontSize="small" />}>
          <div className="space-y-2 font-sans text-sm">
            {[
              { label: "Payment Status", value: selectedOrder.paymentStatus },
              { label: "Total Amount", value: `₹${selectedOrder.totalSellingPrice}` },
              { label: "MRP Total", value: `₹${selectedOrder.totalMrpPrice}` },
              { label: "Discount", value: `₹${selectedOrder.discount || 0}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/50 text-xs uppercase tracking-wider">{label}</span>
                  <span className="font-semibold text-matte-black text-sm">{value}</span>
                </div>
                <Divider sx={{ mt: 1, borderColor: "rgba(200,162,74,0.1)" }} />
              </div>
            ))}
          </div>
        </InfoCard>

        {/* Update Status */}
        <InfoCard title="Update Order Status">
          <div className="space-y-3">
            <FormControl fullWidth size="small" sx={fieldSx}>
              <InputLabel>New Status</InputLabel>
              <Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={fieldSx}
            />
            <button
              onClick={handleUpdateStatus}
              className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-250"
            >
              Update Status
            </button>
          </div>
        </InfoCard>
      </div>

      {/* Ordered Products */}
      <div className="bg-white border border-brand-gold/15 p-5 space-y-4">
        <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/50 border-b border-brand-gold/10 pb-3">
          Ordered Products
        </h2>
        <div className="space-y-0">
          {selectedOrder.orderItems?.map((item, i) => (
            <div
              key={item.id}
              className={`flex justify-between items-start py-4 ${i < selectedOrder.orderItems.length - 1 ? "border-b border-brand-gold/8" : ""}`}
            >
              <div className="space-y-1 flex-1 mr-4">
                <p className="font-sans font-semibold text-sm text-matte-black">{item.product?.title}</p>
                <p className="font-sans text-xs text-charcoal/50">Qty: {item.quantity}</p>
                {item.personalizedGift && (
                  <div className="mt-1 space-y-1">
                    <p className="font-sans text-xs text-brand-gold">
                      <strong>Personalized:</strong> {item.personalizedGift.customMessage}
                    </p>
                    {item.personalizedGift.uploadedImage && (
                      <img
                        src={item.personalizedGift.uploadedImage}
                        alt="custom"
                        className="w-14 h-14 object-cover border border-brand-gold/15 mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
              <p className="font-serif font-bold text-base text-matte-black">₹{item.sellingPrice}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status Timeline */}
      {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
        <div className="bg-white border border-brand-gold/15 p-5 space-y-4">
          <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/50 border-b border-brand-gold/10 pb-3">
            Status Timeline
          </h2>
          <div className="space-y-2">
            {selectedOrder.statusHistory.map((h: any) => (
              <div key={h.id} className="flex items-start gap-3 py-2 border-b border-brand-gold/8 last:border-0">
                <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border border-brand-gold/30 bg-brand-gold/8 text-brand-gold shrink-0 mt-0.5">
                  {h.status}
                </span>
                <span className="font-sans text-xs text-charcoal/70 flex-1">{h.note}</span>
                <span className="font-sans text-[10px] text-charcoal/40 shrink-0 ml-auto">
                  {new Date(h.changedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
