import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  IconButton,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";

/* ─── Luxury Design Styles ─── */
const searchModalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

  .hk-search-drawer {
    background-color: #FDFCF8 !important;
    color: #1a1612;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
  }

    /* Sticky Top Search Header */
  .hk-search-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #FDFCF8;
    border-bottom: 1px solid rgba(200,162,74,0.2);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  @media (min-width: 640px) {
    .hk-search-header {
      padding: 20px 24px;
      gap: 16px;
    }
  }

  .hk-search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #C8A24A;
    padding: 4px 0;
    position: relative;
  }

  .hk-search-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-style: italic;
    color: #1a1612;
    padding: 4px 6px;
    letter-spacing: 0.03em;
  }
  @media (min-width: 640px) {
    .hk-search-input {
      font-size: 1.6rem;
      padding: 4px 8px;
      letter-spacing: 0.05em;
    }
  }
  .hk-search-input::placeholder {
    color: rgba(26, 22, 18, 0.35);
  }

  /* Main Scrollable Content */
  .hk-search-content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 20px 16px 40px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 640px) {
    .hk-search-content {
      padding: 40px 24px 80px;
      gap: 40px;
    }
  }

  @media (min-width: 1024px) {
    .hk-search-content.split-view {
      grid-template-columns: 2fr 1fr;
      gap: 60px;
    }
  }

  /* Typography */
  .hk-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #C8A24A;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(200,162,74,0.12);
    padding-bottom: 6px;
  }
  @media (min-width: 640px) {
    .hk-section-title {
      font-size: 0.8rem;
      letter-spacing: 0.25em;
      margin-bottom: 20px;
      padding-bottom: 8px;
    }
  }

  /* Curated Tags (Trending / Recent) */
  .hk-tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) {
    .hk-tag-cloud {
      gap: 10px;
      margin-bottom: 28px;
    }
  }

  .hk-search-tag {
    font-family: 'Inter', sans-serif;
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #1a1612;
    background: transparent;
    border: 1px solid rgba(26, 22, 18, 0.15);
    padding: 4px 12px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  @media (min-width: 640px) {
    .hk-search-tag {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 6px 16px;
    }
  }
  .hk-search-tag:hover {
    border-color: #C8A24A;
    color: #C8A24A;
    background-color: rgba(200,162,74,0.04);
  }

  .hk-recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .hk-clear-recents {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(26, 22, 18, 0.5);
    cursor: pointer;
    background: none;
    border: none;
  }
  .hk-clear-recents:hover {
    color: #C8A24A;
  }

  /* List Items (Popular Categories) */
  .hk-category-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  @media (min-width: 640px) {
    .hk-category-list {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
  }

  .hk-category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid rgba(200,162,74,0.1);
    background-color: rgba(200,162,74,0.02);
    cursor: pointer;
    transition: all 0.25s ease;
  }
  @media (min-width: 640px) {
    .hk-category-item {
      padding: 12px 16px;
    }
  }
  .hk-category-item:hover {
    border-color: #C8A24A;
    background-color: #FDFCF8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(200,162,74,0.05);
  }
  .hk-category-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #1a1612;
  }
  @media (min-width: 640px) {
    .hk-category-name {
      font-size: 1rem;
    }
  }

  /* Bestsellers Mini Cards */
  .hk-bestseller-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (min-width: 640px) {
    .hk-bestseller-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .hk-bestseller-card {
    cursor: pointer;
    text-align: center;
    transition: transform 0.3s ease;
  }
  .hk-bestseller-card:hover {
    transform: translateY(-4px);
  }
  .hk-bestseller-img-wrap {
    aspect-ratio: 3/4;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1px solid rgba(200,162,74,0.15);
    background-color: #fff;
  }
  .hk-bestseller-img {
    width: 100%;
    height: 100%;
    object-cover: cover;
    transition: transform 0.5s ease;
  }
  .hk-bestseller-card:hover .hk-bestseller-img {
    transform: scale(1.05);
  }
  .hk-bestseller-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1612;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hk-bestseller-price {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: #C8A24A;
    font-weight: 500;
  }

  /* Suggestions Overlay */
  .hk-suggestions-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  @media (min-width: 1024px) {
    .hk-suggestions-container {
      grid-template-columns: 1fr 2fr;
      gap: 48px;
    }
  }

  .hk-suggestion-group {
    margin-bottom: 20px;
  }
  
  .hk-suggestion-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hk-suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid rgba(200,162,74,0.06);
    transition: background 0.2s ease;
  }
  .hk-suggestion-item:hover {
    background-color: rgba(200,162,74,0.04);
  }
  .hk-suggestion-bullet {
    color: #C8A24A;
    font-size: 10px;
  }
  .hk-suggestion-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #1a1612;
    letter-spacing: 0.02em;
  }

  .hk-prod-suggestion-img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border: 1px solid rgba(200,162,74,0.15);
  }
  .hk-prod-suggestion-details {
    display: flex;
    flex-direction: column;
  }
  .hk-prod-suggestion-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1612;
  }
  .hk-prod-suggestion-price {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    color: #C8A24A;
  }

  /* Premium Advanced Search Panel */
  .hk-advanced-panel {
    background-color: rgba(200,162,74,0.02);
    border: 1px solid rgba(200,162,74,0.15);
    padding: 24px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hk-filter-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #C8A24A;
    margin-bottom: 8px;
  }

  .hk-filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .hk-filter-chip {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    color: #1a1612;
    border: 1px solid rgba(26, 22, 18, 0.15);
    padding: 6px 12px;
    cursor: pointer;
    background: #fff;
    transition: all 0.2s ease;
  }
  .hk-filter-chip:hover {
    border-color: #C8A24A;
    color: #C8A24A;
  }
  .hk-filter-chip.selected {
    border-color: #C8A24A;
    background-color: #C8A24A;
    color: #FAF8F2;
  }

  .hk-discover-btn {
    font-family: 'Inter', sans-serif;
    width: 100%;
    padding: 14px;
    background-color: #1a1612;
    color: #C8A24A;
    border: 1px solid #C8A24A;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    margin-top: 10px;
  }
  .hk-discover-btn:hover {
    background-color: #C8A24A;
    color: #1a1612;
  }

  /* Active filters summary */
  .hk-active-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
    padding: 10px;
    border: 1px dashed rgba(200,162,74,0.3);
  }

  .hk-active-chip {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    color: #C8A24A;
    border: 1px solid rgba(200,162,74,0.5);
    background: rgba(200,162,74,0.03);
    padding: 4px 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 1px;
  }
  .hk-active-chip-close {
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
  }
  .hk-active-chip-close:hover {
    color: #1a1612;
  }
`;

/* ─── Static Data Definitions ─── */
const POPULAR_CATEGORIES = [
  { label: "Wall Art & Hangings", value: "wall_art" },
  { label: "Table Décor", value: "table_decor" },
  { label: "Lamps & Lanterns", value: "lamps_lanterns" },
  { label: "Pooja Collection", value: "pooja_spiritual" },
  { label: "Corporate Gifting", value: "corporate" },
  { label: "Personalized Gifts", value: "personalized" },
  { label: "Luxury Gift Hampers", value: "luxury_hampers" },
];

const MATERIALS = ["Wood", "Brass", "Marble", "Ceramic", "Terracotta", "Glass", "Metal"];

const OCCASIONS = ["Housewarming", "Diwali", "Wedding", "Anniversary", "Birthday", "Corporate"];

const COLLECTION_TAGS = ["Bestseller", "New Arrival", "Artisan Pick", "Limited Edition"];

const PRICE_RANGES = [
  { label: "Under ₹999", value: "0-999" },
  { label: "₹1,000–₹2,499", value: "1000-2499" },
  { label: "₹2,500–₹4,999", value: "2500-4999" },
  { label: "₹5,000–₹9,999", value: "5000-9999" },
  { label: "₹10,000+", value: "10000-99999999" },
];

const TRENDING_TAGS = [
  "Brass idols",
  "Marble inlay",
  "Handcarved wood",
  "Glass lanterns",
  "Pooja collection",
  "Artisan picks",
];

const parseNaturalLanguageQuery = (text: string) => {
  const lowercase = text.toLowerCase().trim();
  
  // Match "under/below/less than rs 1000" or "rs. 1000" or just a number at the end: "table 1000"
  const priceRegex = /(?:under|below|less\s+than|rs\.?|₹|<)?\s*(\d+)\s*$/i;
  const priceMatch = lowercase.match(priceRegex);
  
  let priceRange = "";
  let cleanText = text;
  
  if (priceMatch) {
    const limit = parseInt(priceMatch[1], 10);
    if (limit <= 1000) {
      priceRange = "0-999";
    } else if (limit <= 2500) {
      priceRange = "1000-2499";
    } else if (limit <= 5000) {
      priceRange = "2500-4999";
    } else if (limit <= 10000) {
      priceRange = "5000-9999";
    } else {
      priceRange = "10000-99999999";
    }
    
    // Remove the matched price component from the keyword search text
    const fullMatch = priceMatch[0];
    cleanText = lowercase.replace(fullMatch, "").trim();
  }
  
  // Try matching words to category IDs and strip them
  let category = "";
  let finalSearch = cleanText;
  const categoryKeywords: Record<string, string> = {
    "table decor": "table_decor",
    "table": "table_decor",
    "decor": "table_decor",
    "wall art": "wall_art",
    "wall": "wall_art",
    "art": "wall_art",
    "lamps & lanterns": "lamps_lanterns",
    "lamps": "lamps_lanterns",
    "lamp": "lamps_lanterns",
    "lantern": "lamps_lanterns",
    "pooja collection": "pooja_spiritual",
    "pooja": "pooja_spiritual",
    "spiritual": "pooja_spiritual",
    "temple": "pooja_spiritual",
    "corporate gifting": "corporate",
    "corporate": "corporate",
    "personalized gifts": "personalized",
    "personalized": "personalized",
    "luxury hampers": "luxury_hampers",
    "hamper": "luxury_hampers",
  };
  
  for (const key in categoryKeywords) {
    if (cleanText.includes(key)) {
      category = categoryKeywords[key];
      // Strip the category keyword from the search term
      finalSearch = cleanText.replace(key, "").trim();
      break;
    }
  }
  
  return {
    search: finalSearch,
    price: priceRange,
    category: category
  };
};

// Curated mockup bestseller products in case fetch results are empty on load
const MOCK_BESTSELLERS = [
  {
    id: 101,
    title: "Handcrafted Royal Brass Diya",
    sellingPrice: 1499,
    images: ["https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?q=80&w=300&auto=format&fit=crop"],
  },
  {
    id: 102,
    title: "Bespoke Engraved Wooden Keepsake",
    sellingPrice: 2999,
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop"],
  },
  {
    id: 103,
    title: "Exquisite Marble Ganesha Idol",
    sellingPrice: 4500,
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop"],
  },
  {
    id: 104,
    title: "Traditional Terracotta Tea Lights",
    sellingPrice: 899,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=300&auto=format&fit=crop"],
  },
];

interface LuxurySearchModalProps {
  open: boolean;
  onClose: () => void;
}

const LuxurySearchModal = ({ open, onClose }: LuxurySearchModalProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  /* ─── Advanced Filter States ─── */
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("");

  /* ─── Fetch Recent Searches from localStorage ─── */
  useEffect(() => {
    try {
      const recents = localStorage.getItem("hk_recent_searches");
      if (recents) {
        setRecentSearches(JSON.parse(recents));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, [open]);

  /* ─── Debounce Search Input to avoid rapid API requests ─── */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  /* ─── Trigger dispatch when debouncedQuery changes ─── */
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const parsed = parseNaturalLanguageQuery(debouncedQuery);
      dispatch(searchProduct(parsed.search || debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  /* ─── Helper: Save Search to Recents ─── */
  const saveSearchToRecents = (searchVal: string) => {
    if (!searchVal.trim()) return;
    const cleanVal = searchVal.trim();
    let updated = [cleanVal, ...recentSearches.filter((item) => item !== cleanVal)];
    updated = updated.slice(0, 6); // Keep last 6 searches
    setRecentSearches(updated);
    try {
      localStorage.setItem("hk_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("hk_recent_searches");
    } catch (e) {
      console.error(e);
    }
  };

  /* ─── Helper: Execute Search Action ─── */
  const triggerSearch = (searchVal: string) => {
    saveSearchToRecents(searchVal);
    
    const parsed = parseNaturalLanguageQuery(searchVal);
    
    // Build parameters for collection page redirection
    const params = new URLSearchParams();
    if (parsed.search.trim()) params.set("search", parsed.search.trim());
    if (parsed.category || selectedCategory) params.set("category", parsed.category || selectedCategory);
    if (selectedMaterial) params.set("material", selectedMaterial);
    if (parsed.price || selectedPrice) params.set("price", parsed.price || selectedPrice);
    if (inStockOnly) params.set("stock", "in_stock");
    if (selectedTag) params.set("tag", selectedTag);

    onClose();
    setQuery("");
    navigate(`/products?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(query);
    }
  };

  const handleTrendingClick = (tag: string) => {
    setQuery(tag);
    triggerSearch(tag);
  };

  const handleCategoryClick = (catVal: string) => {
    onClose();
    navigate(`/products/${catVal}`);
  };

  const handleQuickGuideClick = (guide: any) => {
    onClose();
    setQuery("");
    const params = new URLSearchParams();
    if (guide.search) params.set("search", guide.search);
    if (guide.category) params.set("category", guide.category);
    if (guide.material) params.set("material", guide.material);
    if (guide.price) params.set("price", guide.price);
    if (guide.tag) params.set("tag", guide.tag);
    navigate(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedMaterial("");
    setSelectedPrice("");
    setInStockOnly(false);
    setSelectedTag("");
  };

  /* ─── Filtering logic for client-side suggestions ─── */
  const matchingCategories = query.trim()
    ? POPULAR_CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingMaterials = query.trim()
    ? MATERIALS.filter((m) => m.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchingOccasions = query.trim()
    ? OCCASIONS.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasSuggestions =
    matchingCategories.length > 0 ||
    matchingMaterials.length > 0 ||
    matchingOccasions.length > 0 ||
    (products.searchProduct && products.searchProduct.length > 0);

  // Take the first 4 products from API as bestseller recommendation fallback
  const displayBestsellers =
    products.products && products.products.length >= 4
      ? products.products.slice(0, 4)
      : MOCK_BESTSELLERS;

  return (
    <>
      <style>{searchModalStyles}</style>
      <Drawer
        anchor="top"
        open={open}
        onClose={onClose}
        transitionDuration={350}
        sx={{
          "& .MuiDrawer-paper": {
            height: "100vh",
            maxHeight: "100vh",
            backgroundColor: "#FDFCF8",
            border: "none",
          },
          zIndex: 1400,
        }}
      >
        <div className="hk-search-drawer">
          {/* Sticky Header */}
          <div className="hk-search-header">
            <SearchIcon sx={{ color: "#C8A24A", fontSize: { xs: 22, sm: 28 } }} />
            <div className="hk-search-input-wrap">
              <input
                className="hk-search-input"
                type="text"
                placeholder="Search products, materials, occasions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              {products.loading && query && (
                <CircularProgress
                  size={14}
                  sx={{ color: "#C8A24A", position: "absolute", right: 8 }}
                />
              )}
            </div>

            {/* Toggle Advanced Filters Button */}
            <IconButton
              onClick={() => setShowAdvanced((prev) => !prev)}
              title="Advanced Search Filters"
              sx={{
                color: showAdvanced ? "#C8A24A" : "#1a1612",
                border: showAdvanced ? "1px solid #C8A24A" : "1px solid rgba(26,22,18,0.15)",
                borderRadius: "2px",
                padding: { xs: "6px", sm: "8px" },
              }}
            >
              <TuneIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
            </IconButton>

            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                color: "#1a1612",
                border: "1px solid rgba(26,22,18,0.15)",
                borderRadius: "2px",
                padding: { xs: "6px", sm: "8px" },
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
            </IconButton>
          </div>

          {/* Drawer Content */}
          <div className={`hk-search-content ${showAdvanced ? "split-view" : ""}`}>
            
            {/* Left/Main Column: Suggestions or Default Discovery */}
            <div style={{ minWidth: 0 }}>
              {query.trim() ? (
                /* SUGGESTIONS VIEW */
                <div className="hk-suggestions-container">
                  
                  {/* Left sub-column: suggestions lists for filters */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {matchingCategories.length > 0 && (
                      <div className="hk-suggestion-group">
                        <h4 className="hk-section-title">Matching Categories</h4>
                        <div className="hk-suggestion-list">
                          {matchingCategories.map((cat) => (
                            <div
                              key={cat.value}
                              className="hk-suggestion-item"
                              onClick={() => handleCategoryClick(cat.value)}
                            >
                              <span className="hk-suggestion-bullet">✦</span>
                              <span className="hk-suggestion-text">{cat.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingMaterials.length > 0 && (
                      <div className="hk-suggestion-group">
                        <h4 className="hk-section-title">Matching Materials</h4>
                        <div className="hk-suggestion-list">
                          {matchingMaterials.map((mat) => (
                            <div
                              key={mat}
                              className="hk-suggestion-item"
                              onClick={() => {
                                setSelectedMaterial(mat);
                                triggerSearch(query);
                              }}
                            >
                              <span className="hk-suggestion-bullet">✦</span>
                              <span className="hk-suggestion-text">{mat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingOccasions.length > 0 && (
                      <div className="hk-suggestion-group">
                        <h4 className="hk-section-title">Matching Occasions</h4>
                        <div className="hk-suggestion-list">
                          {matchingOccasions.map((occ) => (
                            <div
                              key={occ}
                              className="hk-suggestion-item"
                              onClick={() => {
                                setQuery(occ);
                                triggerSearch(occ);
                              }}
                            >
                              <span className="hk-suggestion-bullet">✦</span>
                              <span className="hk-suggestion-text">{occ}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasSuggestions && !products.loading && (
                      <div style={{ padding: "20px 0", textAlign: "center" }}>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontStyle: "italic", opacity: 0.6 }}>
                          No direct suggestions matching "{query}"
                        </p>
                        <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "6px" }}>
                          Press enter to search products description text
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right sub-column: live matching products */}
                  <div>
                    <h4 className="hk-section-title">Matching Products</h4>
                    <div className="hk-suggestion-list">
                      {(() => {
                        let filtered = products.searchProduct || [];
                        const parsed = parseNaturalLanguageQuery(query);
                        if (parsed.price) {
                          const [min, max] = parsed.price.split("-").map(Number);
                          filtered = filtered.filter(item => item.sellingPrice >= min && item.sellingPrice <= max);
                        }
                        return filtered.length > 0 ? (
                          filtered.slice(0, 6).map((item) => (
                            <div
                              key={item.id}
                              className="hk-suggestion-item"
                              onClick={() => {
                                saveSearchToRecents(query);
                                onClose();
                                setQuery("");
                                navigate(`/product-details/${item.giftCategory}/${item.title}/${item.id}`);
                              }}
                            >
                              <img
                                className="hk-prod-suggestion-img"
                                src={item.images?.[0] || MOCK_BESTSELLERS[0].images[0]}
                                alt={item.title}
                              />
                              <div className="hk-prod-suggestion-details">
                                <span className="hk-prod-suggestion-title">{item.title}</span>
                                <span className="hk-prod-suggestion-price">₹{item.sellingPrice}</span>
                              </div>
                              <ArrowForwardIosIcon
                                sx={{ fontSize: 10, color: "#C8A24A", marginLeft: "auto" }}
                              />
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: "0.8rem", color: "#8a7a6a", opacity: 0.8, padding: "12px" }}>
                            {products.loading ? "Searching..." : "No products match this query and price limit..."}
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                </div>
              ) : (
                /* DEFAULT DISCOVERY VIEW */
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                  
                  {/* Recents and Trending row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recent Searches */}
                    <div>
                      <div className="hk-recent-header mb-4">
                        <h4 className="hk-section-title" style={{ margin: 0, border: "none", padding: 0 }}>
                          Recent Searches
                        </h4>
                        {recentSearches.length > 0 && (
                          <button className="hk-clear-recents" onClick={clearRecents}>
                            Clear
                          </button>
                        )}
                      </div>
                      {recentSearches.length > 0 ? (
                        <div className="hk-tag-cloud">
                          {recentSearches.map((term, index) => (
                            <button
                              key={index}
                              className="hk-search-tag"
                              onClick={() => {
                                setQuery(term);
                                triggerSearch(term);
                              }}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "0.75rem", color: "rgba(26,22,18,0.4)" }}>
                          No recent searches. Try discovering something new below.
                        </p>
                      )}
                    </div>

                    {/* Trending Searches */}
                    <div>
                      <h4 className="hk-section-title">Trending Searches</h4>
                      <div className="hk-tag-cloud">
                        {TRENDING_TAGS.map((tag) => (
                          <button
                            key={tag}
                            className="hk-search-tag"
                            onClick={() => handleTrendingClick(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div>
                    <h4 className="hk-section-title">Popular Categories</h4>
                    <div className="hk-category-list">
                      {POPULAR_CATEGORIES.map((cat) => (
                        <div
                          key={cat.value}
                          className="hk-category-item"
                          onClick={() => handleCategoryClick(cat.value)}
                        >
                          <span className="hk-category-name">{cat.label}</span>
                          <ArrowForwardIosIcon sx={{ fontSize: 11, color: "#C8A24A" }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* End default discovery lists */}

                </div>
              )}
            </div>

            {/* Right Column: Premium Advanced Filter Panel (Visible if showAdvanced is true) */}
            {showAdvanced && (
              <div className="hk-advanced-panel">
                <div style={{ borderBottom: "1px solid rgba(200,162,74,0.15)", paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1a1612" }}>
                    Advanced Filters
                  </h4>
                  <button onClick={clearAllFilters} style={{ background: "none", border: "none", color: "#C8A24A", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, cursor: "pointer" }}>
                    Clear All
                  </button>
                </div>

                {/* Category Selection */}
                <div>
                  <h5 className="hk-filter-section-title">Category</h5>
                  <div className="hk-filter-options">
                    {POPULAR_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.value;
                      return (
                        <button
                          key={cat.value}
                          className={`hk-filter-chip${isSelected ? " selected" : ""}`}
                          onClick={() => setSelectedCategory(isSelected ? "" : cat.value)}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <h5 className="hk-filter-section-title">Material</h5>
                  <div className="hk-filter-options">
                    {MATERIALS.map((mat) => {
                      const isSelected = selectedMaterial === mat;
                      return (
                        <button
                          key={mat}
                          className={`hk-filter-chip${isSelected ? " selected" : ""}`}
                          onClick={() => setSelectedMaterial(isSelected ? "" : mat)}
                        >
                          {mat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h5 className="hk-filter-section-title">Price Range</h5>
                  <div className="hk-filter-options">
                    {PRICE_RANGES.map((range) => {
                      const isSelected = selectedPrice === range.value;
                      return (
                        <button
                          key={range.value}
                          className={`hk-filter-chip${isSelected ? " selected" : ""}`}
                          onClick={() => setSelectedPrice(isSelected ? "" : range.value)}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collection Tags */}
                <div>
                  <h5 className="hk-filter-section-title">Collection Tags</h5>
                  <div className="hk-filter-options">
                    {COLLECTION_TAGS.map((tag) => {
                      const isSelected = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          className={`hk-filter-chip${isSelected ? " selected" : ""}`}
                          onClick={() => setSelectedTag(isSelected ? "" : tag)}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h5 className="hk-filter-section-title">Availability</h5>
                  <div className="hk-filter-options">
                    <button
                      className={`hk-filter-chip${inStockOnly ? " selected" : ""}`}
                      onClick={() => setInStockOnly((prev) => !prev)}
                    >
                      In Stock Only
                    </button>
                  </div>
                </div>

                {/* Active Filter Chips Summary */}
                {(selectedCategory || selectedMaterial || selectedPrice || selectedTag || inStockOnly) && (
                  <div className="hk-active-summary">
                    <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#8a7a6a", marginRight: "4px" }}>
                      Active:
                    </span>
                    {selectedCategory && (
                      <span className="hk-active-chip">
                        {POPULAR_CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                        <span className="hk-active-chip-close" onClick={() => setSelectedCategory("")}>✕</span>
                      </span>
                    )}
                    {selectedMaterial && (
                      <span className="hk-active-chip">
                        {selectedMaterial}
                        <span className="hk-active-chip-close" onClick={() => setSelectedMaterial("")}>✕</span>
                      </span>
                    )}
                    {selectedPrice && (
                      <span className="hk-active-chip">
                        {PRICE_RANGES.find((p) => p.value === selectedPrice)?.label}
                        <span className="hk-active-chip-close" onClick={() => setSelectedPrice("")}>✕</span>
                      </span>
                    )}
                    {selectedTag && (
                      <span className="hk-active-chip">
                        {selectedTag}
                        <span className="hk-active-chip-close" onClick={() => setSelectedTag("")}>✕</span>
                      </span>
                    )}
                    {inStockOnly && (
                      <span className="hk-active-chip">
                        In Stock
                        <span className="hk-active-chip-close" onClick={() => setInStockOnly(false)}>✕</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Submit Discovery Button */}
                <button className="hk-discover-btn" onClick={() => triggerSearch(query)}>
                  Discover Selection
                </button>
              </div>
            )}

          </div>
        </div>
      </Drawer>
    </>
  );
};

export default LuxurySearchModal;
