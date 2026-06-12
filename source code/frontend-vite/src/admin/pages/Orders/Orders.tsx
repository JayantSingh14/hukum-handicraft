import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchAdminOrders } from "../../../Redux Toolkit/Admin/adminOrderSlice";

const ORDER_STATUSES = ["", "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED", "REFUNDED"];

const statusColorMap: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-sky-50 text-sky-700 border-sky-200",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  REFUNDED: "bg-teal-50 text-teal-700 border-teal-200",
};

const StatusBadge = ({ status }: { status: string }) => {
  const cls = statusColorMap[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${cls}`}>
      {status}
    </span>
  );
};

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

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders } = useAppSelector((s) => s.adminOrders);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders({ status: status || undefined, search: search || undefined }));
  }, [dispatch, status]);

  const handleSearch = () => {
    dispatch(fetchAdminOrders({ status: status || undefined, search: search || undefined }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15">
        <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
          Management
        </span>
        <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
          Order Management
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <TextField
          size="small"
          label="Search orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{ ...fieldSx, minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 180, ...fieldSx }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>
                {s || "All Statuses"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 border border-transparent"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="border border-brand-gold/15 bg-white overflow-hidden">
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0F0F0F" }}>
                {["Order ID", "Customer", "Amount", "Status", "Payment", "Date", "Action"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#C8A24A",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(200,162,74,0.2)",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                    "&:hover": { backgroundColor: "rgba(200,162,74,0.05)" },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0F0F0F" }}>
                    {order.orderId || `#${order.id}`}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#4A4A4A" }}>
                    {order.user?.fullName || order.user?.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.9rem", fontWeight: 700, color: "#0F0F0F" }}>
                    ₹{order.totalSellingPrice}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4A4A4A" }}>
                    {order.paymentStatus}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4A4A4A" }}>
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}
                      className="px-3 py-1.5 border border-brand-gold/30 text-brand-gold font-sans text-[9px] tracking-widest uppercase font-bold hover:bg-brand-gold hover:text-white transition-all duration-150"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {orders.length > 0 && (
        <p className="font-sans text-xs text-charcoal/40 text-right">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
      )}
    </div>
  );
};

export default Orders;
