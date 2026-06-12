import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchAdminCustomers } from "../../../Redux Toolkit/Admin/adminCustomerSlice";

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

const StatusBadge = ({ banned }: { banned: boolean }) => {
  const cls = banned
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${cls}`}>
      {banned ? "Banned" : "Active"}
    </span>
  );
};

const Customers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customers } = useAppSelector((s) => s.adminCustomers);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminCustomers(undefined));
  }, [dispatch]);

  const handleSearch = () => dispatch(fetchAdminCustomers(search || undefined));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
            Accounts
          </span>
          <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
            Customer Directory
          </h1>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex gap-3 items-end">
        <TextField
          size="small"
          label="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{ ...fieldSx, minWidth: 260 }}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 border border-transparent"
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
                {["Name", "Email", "Mobile", "Status", "Actions"].map((h) => (
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
              {customers.map((c, i) => (
                <TableRow
                  key={c.id}
                  hover
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                    "&:hover": { backgroundColor: "rgba(200,162,74,0.05)" },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                >
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0F0F0F" }}>
                    {c.fullName}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#4A4A4A" }}>
                    {c.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#4A4A4A" }}>
                    {c.mobile || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge banned={c.accountStatus === "BANNED"} />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${c.id}`); }}
                      className="px-3 py-1.5 border border-brand-gold/30 text-brand-gold font-sans text-[9px] tracking-widest uppercase font-bold hover:bg-brand-gold hover:text-white transition-all duration-150"
                    >
                      View Profile
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {customers.length > 0 && (
        <p className="font-sans text-xs text-charcoal/40 text-right">{customers.length} customer{customers.length !== 1 ? "s" : ""} registered</p>
      )}
    </div>
  );
};

export default Customers;
