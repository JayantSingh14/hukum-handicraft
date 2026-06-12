import { useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchAdminProducts,
  updateAdminProductStock,
} from "../../../Redux Toolkit/Admin/adminProductSlice";

export default function AdminProductTable() {
  const { adminProduct } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleUpdateStock = (id: number | undefined) => () => {
    if (id) dispatch(updateAdminProductStock(id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
            Catalogue
          </span>
          <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
            Gift Products
          </h1>
        </div>
        <button
          onClick={() => navigate("/admin/add-product")}
          className="px-6 py-2.5 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 border border-transparent"
        >
          + Add New Gift
        </button>
      </div>

      {/* Table */}
      <div className="border border-brand-gold/15 bg-white overflow-hidden">
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0F0F0F" }}>
                {["Image", "Title", "Category", "MRP", "Selling Price", "Stock", "Edit"].map((h) => (
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
              {adminProduct.products.map((item, i) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                    "&:hover": { backgroundColor: "rgba(200,162,74,0.04)" },
                  }}
                >
                  {/* Images */}
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {item.images?.slice(0, 1).map((image, idx) => (
                        <img
                          key={idx}
                          className="w-16 h-20 object-cover border border-brand-gold/10"
                          src={image}
                          alt=""
                        />
                      ))}
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0F0F0F", maxWidth: 200 }}>
                    <p className="truncate max-w-[180px]">{item.title}</p>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border border-brand-gold/25 bg-brand-gold/8 text-brand-gold">
                      {item.giftCategory || "—"}
                    </span>
                  </TableCell>

                  {/* MRP */}
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#888", textDecoration: "line-through" }}>
                    ₹{item.mrpPrice}
                  </TableCell>

                  {/* Selling Price */}
                  <TableCell sx={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 700, color: "#0F0F0F" }}>
                    ₹{item.sellingPrice}
                  </TableCell>

                  {/* Stock Toggle */}
                  <TableCell>
                    <button
                      onClick={handleUpdateStock(item.id)}
                      className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-1 border transition-all duration-150 ${
                        item.in_stock
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {item.in_stock ? "In Stock" : "Out of Stock"}
                    </button>
                  </TableCell>

                  {/* Edit */}
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/admin/update-product/${item.id}`)}
                      size="small"
                      sx={{
                        color: "#C8A24A",
                        border: "1px solid rgba(200,162,74,0.3)",
                        borderRadius: 0,
                        p: 0.8,
                        "&:hover": { bgcolor: "rgba(200,162,74,0.1)" }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {adminProduct.products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                    No products found. Add your first artisan gift product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {adminProduct.products.length > 0 && (
        <p className="font-sans text-xs text-charcoal/40 text-right">
          {adminProduct.products.length} product{adminProduct.products.length !== 1 ? "s" : ""} in catalogue
        </p>
      )}
    </div>
  );
}
