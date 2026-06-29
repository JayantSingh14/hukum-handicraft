import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard/ProductCard";
import type { CardVariant } from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import {
  Drawer,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Tooltip,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";
import LuxurySearchModal from "../../components/LuxurySearch/LuxurySearchModal";

/* ─── Price label helper ─── */
const PRICE_LABELS: Record<string, string> = {
  "0-999":           "Under ₹999",
  "1000-2499":       "₹1,000 – ₹2,499",
  "2500-4999":       "₹2,500 – ₹4,999",
  "5000-9999":       "₹5,000 – ₹9,999",
  "10000-99999999":  "₹10,000+",
};

/* ─── Styles ─── */
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');

  .hk-products-page {
    min-height: 100vh;
    background: #FDFCF8;
    margin-top: 0;
    padding-top: 30px;
  }

  .hk-page-hero {
    text-align: center;
    padding: 40px 24px 28px;
    border-bottom: 1px solid rgba(200,162,74,0.15);
  }

  .hk-page-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #C8A24A;
    margin-bottom: 10px;
  }

  .hk-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    color: #1a1612;
    letter-spacing: 0.05em;
    line-height: 1.15;
  }

  .hk-page-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    color: #8a7a6a;
    letter-spacing: 0.06em;
    margin-top: 8px;
  }

  /* ─── Active Chips ─── */
  .hk-chips-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    min-height: 50px;
    border-bottom: 1px solid rgba(200,162,74,0.1);
    background: rgba(200,162,74,0.03);
  }

  .hk-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: #FDFCF8;
    border: 1px solid rgba(200,162,74,0.5);
    border-radius: 2px;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    color: #C8A24A;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .hk-chip:hover {
    background: rgba(200,162,74,0.08);
  }

  .hk-chip-close {
    width: 12px;
    height: 12px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  .hk-chips-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: #8a7a6a;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-right: 4px;
  }

  /* ─── Toolbar ─── */
  .hk-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    border-bottom: 1px solid rgba(200,162,74,0.1);
  }

  .hk-product-count {
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    color: #8a7a6a;
    letter-spacing: 0.06em;
  }

  .hk-filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: none;
    border: 1px solid rgba(200,162,74,0.4);
    border-radius: 2px;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C8A24A;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .hk-filter-btn:hover {
    background: rgba(200,162,74,0.08);
    border-color: #C8A24A;
  }

  /* ─── Empty state ─── */
  .hk-empty {
    text-align: center;
    padding: 80px 20px;
  }
  .hk-empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.4;
  }
  .hk-empty-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    color: #8a7a6a;
    letter-spacing: 0.04em;
  }
  .hk-empty-sub {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 8px;
  }

  /* ─── Pagination ─── */
  .hk-pagination-wrap {
    display: flex;
    justify-content: center;
    padding: 40px 0 60px;
  }

  /* ─── Layout ─── */
  .hk-layout {
    display: flex;
    align-items: flex-start;
  }
  .hk-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 80px;
    padding: 24px 20px 24px 24px;
  }
  .hk-main {
    flex: 1;
    min-width: 0;
  }
  .hk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    padding: 24px 28px;
  }
  @media (max-width: 640px) {
    .hk-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 16px;
    }
    .hk-toolbar {
      padding: 12px 16px;
    }
    .hk-chips-bar {
      padding: 10px 16px;
    }
    .hk-page-hero {
      padding: 28px 16px 20px;
    }
    .hk-sidebar {
      display: none;
    }
  }

  .hk-collection-search-bar {
    max-width: 600px;
    margin: 24px auto 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border: 1px solid rgba(200,162,74,0.3);
    background-color: rgba(200,162,74,0.02);
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .hk-collection-search-bar:hover {
    border-color: #C8A24A;
    background-color: rgba(200,162,74,0.06);
  }
  .hk-search-placeholder-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: rgba(26, 22, 18, 0.45);
    letter-spacing: 0.05em;
  }

  /* ─── Skeleton shimmer ─── */
  @keyframes hk-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .hk-skeleton {
    border-radius: 4px;
    background: linear-gradient(90deg, #ede8df 25%, #f5f1ea 50%, #ede8df 75%);
    background-size: 600px 100%;
    animation: hk-shimmer 1.4s infinite linear;
  }
  .hk-skeleton-card {
    border: 1px solid rgba(200,162,74,0.12);
    overflow: hidden;
    background: #FDFCF8;
  }
`;

type ViewMode = "editorial" | "grid" | "list";

const Products = () => {
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("editorial");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFilter, setShowFilter] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  // Track when a fresh fetch starts so we can show skeletons
  const [fetching, setFetching] = useState(true);

  const handleSortChange = (e: SelectChangeEvent) => {
    setSort(e.target.value);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const priceParam = searchParams.get("price") || "";
    const [minPrice, maxPrice] = priceParam.split("-");
    const materialParam = searchParams.get("material") || "";
    const searchVal = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const stockParam = searchParams.get("stock") || "";

    setFetching(true);
    dispatch(
      getAllProducts({
        query: searchVal || undefined,
        giftCategory: categoryId || categoryParam || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        material: materialParam || undefined,
        stock: stockParam || undefined,
        pageNumber: page - 1,
        sort,
      })
    ).finally(() => setFetching(false));
  }, [searchParams, categoryId, sort, page, dispatch]);

  /* ─── Active chips ─── */
  const activePrice = searchParams.get("price") || "";
  const activeMaterials: string[] = searchParams.get("material")
    ? searchParams.get("material")!.split(",")
    : [];
  const activeSearch = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "";
  const activeStock = searchParams.get("stock") || "";
  const activeTag = searchParams.get("tag") || "";

  const removePrice = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("price");
    setSearchParams(np);
  };

  const removeMaterial = (mat: string) => {
    const np = new URLSearchParams(searchParams.toString());
    const remaining = activeMaterials.filter((m) => m !== mat);
    if (remaining.length === 0) np.delete("material");
    else np.set("material", remaining.join(","));
    setSearchParams(np);
  };

  const removeSearch = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("search");
    setSearchParams(np);
  };

  const removeCategoryParam = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("category");
    setSearchParams(np);
  };

  const removeStock = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("stock");
    setSearchParams(np);
  };

  const removeTag = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("tag");
    setSearchParams(np);
  };

  const clearAll = () => {
    const np = new URLSearchParams(searchParams.toString());
    np.delete("price");
    np.delete("material");
    np.delete("search");
    np.delete("category");
    np.delete("stock");
    np.delete("tag");
    setSearchParams(np);
  };

  const hasChips =
    !!activePrice ||
    activeMaterials.length > 0 ||
    !!activeSearch ||
    !!activeCategory ||
    !!activeStock ||
    !!activeTag;

  /* ─── Page title ─── */
  const pageTitle = categoryId
    ? categoryId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "The Collection";

  const filterDrawer = (
    <Drawer
      anchor="left"
      open={showFilter}
      onClose={() => setShowFilter(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 290,
          boxSizing: "border-box",
          border: "none",
          bgcolor: "#FDFCF8",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(200,162,74,0.15)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1a1612",
          }}
        >
          Filters
        </span>
        <IconButton size="small" onClick={() => setShowFilter(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <FilterSection />
      </div>
    </Drawer>
  );

  return (
    <>
      <style>{pageStyles}</style>
      <div className="hk-products-page">
        {/* Page Hero */}
        <div className="hk-page-hero">
          <p className="hk-page-eyebrow">Hukum Handicraft</p>
          <h1 className="hk-page-title">{pageTitle}</h1>
          <p className="hk-page-subtitle">
            Handcrafted with love · Ethically sourced · Made in India
          </p>
        </div>

        {/* Luxury Search Bar Trigger */}
        <div className="hk-collection-search-bar" onClick={() => setIsSearchOpen(true)}>
          <span className="hk-search-placeholder-text">
            Search products, materials, occasions...
          </span>
          <SearchIcon sx={{ color: "#C8A24A", fontSize: 18 }} />
        </div>

        {/* Active Filter Chips */}
        {hasChips && (
          <div className="hk-chips-bar">
            <span className="hk-chips-label">Active:</span>
            {activeSearch && (
              <button className="hk-chip" onClick={removeSearch} title="Remove search filter">
                Search: "{activeSearch}"
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {activeCategory && (
              <button className="hk-chip" onClick={removeCategoryParam} title="Remove category filter">
                Category: {activeCategory.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {activePrice && (
              <button className="hk-chip" onClick={removePrice} title="Remove price filter">
                {PRICE_LABELS[activePrice] || activePrice}
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {activeMaterials.map((mat) => (
              <button
                key={mat}
                className="hk-chip"
                onClick={() => removeMaterial(mat)}
                title={`Remove ${mat} filter`}
              >
                {mat}
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ))}
            {activeStock && (
              <button className="hk-chip" onClick={removeStock} title="Remove stock filter">
                In Stock Only
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {activeTag && (
              <button className="hk-chip" onClick={removeTag} title="Remove tag filter">
                Tag: {activeTag}
                <svg className="hk-chip-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              className="hk-chip"
              onClick={clearAll}
              style={{ marginLeft: "auto", opacity: 0.7 }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="hk-layout">
          {/* Sidebar (desktop) */}
          {isLarge && (
            <aside className="hk-sidebar">
              <FilterSection />
            </aside>
          )}

          {/* Mobile filter drawer */}
          {!isLarge && filterDrawer}

          {/* Products Area */}
          <main className="hk-main">
            {/* Toolbar */}
            <div className="hk-toolbar">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {!isLarge && (
                  <button
                    className="hk-filter-btn"
                    onClick={() => setShowFilter(true)}
                    id="filter-toggle-btn"
                  >
                    <FilterAltIcon sx={{ fontSize: 14 }} />
                    Filters
                    {hasChips && (
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "#C8A24A", color: "#fff", fontSize: 9, fontWeight: 700 }}>
                        {(activePrice ? 1 : 0) + activeMaterials.length}
                      </span>
                    )}
                  </button>
                )}
                <span className="hk-product-count">{products.products.length} products</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* View mode toggle */}
                <div style={{ display: "flex", gap: 2, border: "1px solid rgba(200,162,74,0.25)", borderRadius: 2, overflow: "hidden" }}>
                  {([
                    { mode: "editorial", icon: <DashboardIcon sx={{ fontSize: 16 }} />, label: "Editorial" },
                    { mode: "grid",      icon: <ViewModuleIcon sx={{ fontSize: 16 }} />, label: "Grid" },
                    { mode: "list",      icon: <ViewListIcon sx={{ fontSize: 16 }} />,   label: "List" },
                  ] as const).map(({ mode, icon, label }) => (
                    <Tooltip key={mode} title={label} placement="top">
                      <button
                        onClick={() => setViewMode(mode)}
                        style={{
                          padding: "6px 10px",
                          background: viewMode === mode ? "rgba(200,162,74,0.12)" : "transparent",
                          color: viewMode === mode ? "#C8A24A" : "#8a7a6a",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {icon}
                      </button>
                    </Tooltip>
                  ))}
                </div>

                <FormControl size="small" sx={{ minWidth: 150, "& .MuiOutlinedInput-root": { fontFamily: "Inter, sans-serif", fontSize: "0.78rem", borderRadius: "2px", "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(200,162,74,0.6)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C8A24A" } }, "& .MuiInputLabel-root": { fontFamily: "Inter, sans-serif", fontSize: "0.78rem", "&.Mui-focused": { color: "#C8A24A" } } }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sort} label="Sort By" onChange={handleSortChange}>
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Product Grid */}
            {fetching ? (
              <div className="hk-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="hk-skeleton-card">
                    <div className="hk-skeleton" style={{ height: 280 }} />
                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div className="hk-skeleton" style={{ height: 14, borderRadius: 3, width: "70%" }} />
                      <div className="hk-skeleton" style={{ height: 11, borderRadius: 3, width: "45%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.products.length === 0 ? (
              <div className="hk-empty">
                <div className="hk-empty-icon">✦</div>
                <p className="hk-empty-text">No products found</p>
                <p className="hk-empty-sub">Try adjusting your filters</p>
              </div>
            ) : viewMode === "list" ? (
              /* ── LIST view ── */
              <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                {products.products.map((item: any, idx: number) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.3) }}>
                    <ProductCard item={item} variant="list" />
                  </motion.div>
                ))}
              </div>
            ) : viewMode === "editorial" && products.products.length >= 3 ? (
              /* ── EDITORIAL view ── */
              <div style={{ padding: "24px 28px" }}>
                {/* First editorial block: 1 featured + 4 side */}
                <div style={{ display: "grid", gridTemplateColumns: isLarge ? "2fr 1fr 1fr" : "1fr 1fr", gridTemplateRows: isLarge ? "auto auto" : "auto", gap: 16, marginBottom: 16 }}>
                  {/* Featured hero */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ gridRow: isLarge ? "span 2" : "span 1", gridColumn: isLarge ? "1" : "1 / -1" }}
                  >
                    <ProductCard item={products.products[0]} variant="featured" />
                  </motion.div>

                  {/* Side products (up to 4) */}
                  {products.products.slice(1, isLarge ? 5 : 3).map((item: any, idx: number) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: (idx + 1) * 0.06 }}>
                      <ProductCard item={item} variant="standard" />
                    </motion.div>
                  ))}
                </div>

                {/* Remaining products in regular grid */}
                {products.products.length > (isLarge ? 5 : 3) && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0 20px" }}>
                      <div style={{ flex: 1, height: 1, background: "rgba(200,162,74,0.15)" }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#C8A24A", textTransform: "uppercase" }}>More From The Collection</span>
                      <div style={{ flex: 1, height: 1, background: "rgba(200,162,74,0.15)" }} />
                    </div>
                    <div className="hk-grid" style={{ padding: 0 }}>
                      {products.products.slice(isLarge ? 5 : 3).map((item: any, idx: number) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.3) }}>
                          <ProductCard item={item} variant="standard" />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* ── GRID view (also fallback for editorial with < 3 products) ── */
              <div className="hk-grid">
                {products.products.map((item: any, idx: number) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: Math.min(idx * 0.035, 0.35), ease: "easeOut" }}>
                    <ProductCard item={item} variant={"standard" as CardVariant} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.totalPages > 1 && (
              <div className="hk-pagination-wrap">
                <Pagination
                  count={products.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.8rem",
                      "&.Mui-selected": {
                        background: "rgba(200,162,74,0.15)",
                        color: "#C8A24A",
                        border: "1px solid rgba(200,162,74,0.5)",
                      },
                      "&:hover": {
                        background: "rgba(200,162,74,0.08)",
                      },
                    },
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Luxury Search Modal Overlay */}
      <LuxurySearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Products;
