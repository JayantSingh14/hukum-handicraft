import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import type { Coupon } from '../../../types/couponTypes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteCoupon } from '../../../Redux Toolkit/Admin/AdminCouponSlice';

export default function CouponTable() {
    const { adminCoupon } = useAppSelector(store => store)
    const dispatch = useAppDispatch();

    const handleDeleteCoupon = (id: number) => {
        dispatch(deleteCoupon({ id, jwt: localStorage.getItem("jwt") || "" }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-5 border-b border-brand-gold/15">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                    Promotions
                </span>
                <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
                    Active Coupons
                </h1>
            </div>

            {/* Table */}
            <div className="border border-brand-gold/15 bg-white overflow-hidden">
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#0F0F0F" }}>
                                {["Coupon Code", "Start Date", "End Date", "Min Order Value", "Discount %", "Status", "Delete"].map((h) => (
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
                            {adminCoupon.coupons?.map((coupon: Coupon, i) => (
                                <TableRow
                                    key={coupon.id}
                                    sx={{
                                        backgroundColor: i % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                                        "&:hover": { backgroundColor: "rgba(200,162,74,0.04)" },
                                    }}
                                >
                                    <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0F0F0F" }}>
                                        {coupon.code}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4A4A4A" }}>
                                        {coupon.validityStartDate ? new Date(coupon.validityStartDate).toLocaleDateString() : "—"}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4A4A4A" }}>
                                        {coupon.validityEndDate ? new Date(coupon.validityEndDate).toLocaleDateString() : "—"}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.9rem", fontWeight: 700, color: "#0F0F0F" }}>
                                        ₹{coupon.minimumOrderValue}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#C8A24A" }}>
                                        {coupon.discountPercentage}%
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${
                                            coupon.active
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-gray-50 text-gray-500 border-gray-200"
                                        }`}>
                                            {coupon.active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                            size="small"
                                            sx={{
                                                color: "#C0392B",
                                                border: "1px solid rgba(192, 57, 43, 0.25)",
                                                borderRadius: 0,
                                                p: 0.8,
                                                "&:hover": { bgcolor: "rgba(192, 57, 43, 0.08)" }
                                            }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(adminCoupon.coupons || []).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                                        No coupons found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {(adminCoupon.coupons || []).length > 0 && (
                <p className="font-sans text-xs text-charcoal/40 text-right">
                    {adminCoupon.coupons?.length} coupon{adminCoupon.coupons?.length !== 1 ? "s" : ""} active
                </p>
            )}
        </div>
    );
}
