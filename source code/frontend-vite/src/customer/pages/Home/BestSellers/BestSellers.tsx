import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, IconButton } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../../Redux Toolkit/Customer/ProductSlice";

type Badge = "BESTSELLER" | "LIMITED EDITION" | "ARTISAN PICK" | "CUSTOMER FAVORITE" | "PERSONALIZED" | "NEW ARRIVAL";
type Tab = "ALL" | "BESTSELLER" | "LIMITED EDITION" | "ARTISAN PICK" | "UNDER ₹2,000";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: Badge;
}

const mockProducts: ProductItem[] = [
  { id: "royal_brass_urli", name: "Royal Brass Urli", category: "Table Décor", price: 4999, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800", badge: "BESTSELLER" },
  { id: "terracotta_vase", name: "Artisanal Terracotta Vase", category: "Table Décor", price: 2499, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800", badge: "LIMITED EDITION" },
  { id: "mughal_silk_cushion", name: "Mughal Silk Cushion", category: "Home Décor", price: 1899, image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800", badge: "ARTISAN PICK" },
  { id: "filigree_brass_lantern", name: "Filigree Brass Lantern", category: "Lamps & Lanterns", price: 3799, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800", badge: "CUSTOMER FAVORITE" },
  { id: "carved_teakwood_box", name: "Carved Teakwood Box", category: "Gifting", price: 2999, image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800", badge: "BESTSELLER" },
  { id: "inlaid_marble_coasters", name: "Inlaid Marble Coasters", category: "Table Décor", price: 1599, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800", badge: "LIMITED EDITION" },
  { id: "gilded_ganesha_idol", name: "Gilded Ganesha Idol", category: "Pooja & Spiritual", price: 3299, image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800", badge: "ARTISAN PICK" },
  { id: "royal_emerald_vase", name: "Royal Emerald Vase", category: "Table Décor", price: 6499, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800", badge: "LIMITED EDITION" },
  { id: "dhokra_horse", name: "Dhokra Tribal Horse", category: "Wall Art", price: 3499, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800", badge: "ARTISAN PICK" },
  { id: "warli_wall_panel", name: "Warli Wall Panel", category: "Wall Art", price: 2799, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800", badge: "LIMITED EDITION" },
  { id: "pattachitra_box", name: "Pattachitra Keepsake Box", category: "Gifting", price: 1999, image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?q=80&w=800", badge: "CUSTOMER FAVORITE" },
  { id: "brass_diya_set", name: "Heirloom Brass Diya Set", category: "Pooja & Spiritual", price: 2199, image: "https://images.unsplash.com/photo-1574274711972-3a5f9a70e7e5?q=80&w=800", badge: "BESTSELLER" },
  { id: "woven_silk_runner", name: "Woven Silk Table Runner", category: "Table Décor", price: 1799, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800", badge: "NEW ARRIVAL" },
  { id: "blue_pottery_bowl", name: "Blue Pottery Serving Bowl", category: "Table Décor", price: 1299, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800", badge: "NEW ARRIVAL" },
  { id: "madhubani_canvas", name: "Madhubani Art Canvas", category: "Wall Art", price: 3999, image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?q=80&w=800", badge: "ARTISAN PICK" },
  { id: "copper_water_set", name: "Copper Water Set", category: "Kitchen & Dining", price: 1499, image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=800", badge: "BESTSELLER" },
];

const BADGE_COLORS: Record<Badge, { bg: string; text: string }> = {
  "BESTSELLER":       { bg: "#C8A24A", text: "#0F0F0F" },
  "LIMITED EDITION":  { bg: "#0F0F0F", text: "#C8A24A" },
  "ARTISAN PICK":     { bg: "#5C3D2E", text: "#FAF8F2" },
  "CUSTOMER FAVORITE":{ bg: "#2E4A3D", text: "#FAF8F2" },
  "PERSONALIZED":     { bg: "#1A2E4A", text: "#FAF8F2" },
  "NEW ARRIVAL":      { bg: "#C8A24A", text: "#0F0F0F" },
};

const TABS: Tab[] = ["ALL", "BESTSELLER", "LIMITED EDITION", "ARTISAN PICK", "UNDER ₹2,000"];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.55, ease: [0.25, 0.8, 0.25, 1] as const } }),
};

const BestSellers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store: any) => store.products);
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");

  useEffect(() => {
    dispatch(getAllProducts({ pageNumber: 0 }));
  }, [dispatch]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Build product list from DB + pad with mock
  const allProducts: ProductItem[] = (() => {
    const dbProducts = (products || []).map((p: any) => ({
      id: String(p.id),
      name: p.title,
      category: p.category?.name || "Handcrafted",
      price: p.sellingPrice,
      image: p.images?.[0] || mockProducts[0].image,
      badge: (p.personalized ? "PERSONALIZED" : p.featured ? "BESTSELLER" : "NEW ARRIVAL") as Badge,
    }));
    if (dbProducts.length >= 16) return dbProducts.slice(0, 16);
    const needed = 16 - dbProducts.length;
    return [...dbProducts, ...mockProducts.slice(0, needed)];
  })();

  // Filter by tab
  const filtered = activeTab === "ALL"
    ? allProducts
    : activeTab === "UNDER ₹2,000"
    ? allProducts.filter(p => p.price < 2000)
    : allProducts.filter(p => p.badge === activeTab);

  const handleClick = (product: ProductItem) => {
    if (isNaN(Number(product.id))) {
      navigate("/products");
    } else {
      const raw = (products || []).find((p: any) => String(p.id) === product.id);
      const catId = raw?.category?.categoryId || "wall_art";
      const name = raw?.title?.replace(/\s+/g, "-") || product.name.replace(/\s+/g, "-");
      navigate(`/product-details/${catId}/${name}/${product.id}`);
    }
  };

  return (
    <section className="bg-[#FAF8F2] py-16 px-4 lg:px-16 border-y border-[#C8A24A]/10">
      {/* Header */}
      {/* Header + Tabs — full width, two columns */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <span className="text-[9px] tracking-[0.35em] font-sans font-bold text-[#C8A24A] uppercase block">
            Most Loved by Our Patrons
          </span>
          <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl font-medium uppercase tracking-wide text-[#1A1A1A] whitespace-nowrap">
            Bestselling Masterpieces
          </h2>
        </div>

        {/* Tab Filter Bar */}
        <div className="flex gap-1.5 flex-wrap sm:justify-end">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-sans text-[8px] tracking-[0.18em] uppercase px-3 py-1.5 border transition-all duration-200 whitespace-nowrap"
              style={{
                borderColor: activeTab === tab ? "#C8A24A" : "rgba(200,162,74,0.25)",
                background: activeTab === tab ? "#C8A24A" : "transparent",
                color: activeTab === tab ? "#0F0F0F" : "rgba(26,26,26,0.55)",
                fontWeight: activeTab === tab ? 700 : 500,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-sans text-sm text-[#1A1A1A]/40 tracking-wider">No products in this category yet.</p>
              <button onClick={() => setActiveTab("ALL")} className="mt-4 font-sans text-xs text-[#C8A24A] underline underline-offset-4">Show all</button>
            </div>
          ) : (
            <>
              {/* Desktop + Tablet: CSS grid */}
              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
              >
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id + activeTab}
                    custom={idx}
                    variants={cardVariants}
                    onClick={() => handleClick(product)}
                    className="group cursor-pointer bg-white border border-[#C8A24A]/12 hover:border-[#C8A24A]/40 hover:shadow-md transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[3/4]">
                      {/* Badge */}
                      <div
                        className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5"
                        style={{ background: BADGE_COLORS[product.badge].bg, color: BADGE_COLORS[product.badge].text }}
                      >
                        <span className="font-sans text-[7px] font-bold tracking-[0.18em] uppercase">{product.badge}</span>
                      </div>
                      {/* Wishlist */}
                      <IconButton
                        onClick={(e) => toggleWishlist(product.id, e)}
                        sx={{
                          position: "absolute", top: 6, right: 6, zIndex: 10,
                          bgcolor: "rgba(255,255,255,0.9)", width: 28, height: 28,
                          color: wishlisted.includes(product.id) ? "#C8A24A" : "#1A1A1A",
                          opacity: 0, transition: "opacity 0.2s",
                          ".group:hover &": { opacity: 1 },
                          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                        }}
                      >
                        {wishlisted.includes(product.id) ? <Favorite sx={{ fontSize: 13 }} /> : <FavoriteBorder sx={{ fontSize: 13 }} />}
                      </IconButton>
                      {/* Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {/* Quick Add — slides up on hover */}
                      <div
                        className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 py-2.5"
                        style={{ background: "rgba(15,15,15,0.88)", backdropFilter: "blur(4px)" }}
                      >
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 13, color: "#C8A24A" }} />
                        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#FAF8F2] font-semibold">Quick Add</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-3 py-3 space-y-1">
                      <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-[#C8A24A]/70">{product.category}</p>
                      <h4 className="font-serif text-sm font-medium text-[#1A1A1A] leading-snug line-clamp-2">{product.name}</h4>
                      <p className="font-sans text-sm font-bold text-[#1A1A1A] pt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile: Horizontal scroll carousel */}
              <div
                className="flex sm:hidden gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
              >
                {filtered.map((product) => (
                  <div
                    key={product.id + activeTab}
                    onClick={() => handleClick(product)}
                    className="snap-center shrink-0 w-[185px] cursor-pointer bg-white border border-[#C8A24A]/15"
                  >
                    <div className="relative overflow-hidden h-[220px]">
                      <div
                        className="absolute top-2 left-2 z-10 px-2 py-0.5"
                        style={{ background: BADGE_COLORS[product.badge].bg, color: BADGE_COLORS[product.badge].text }}
                      >
                        <span className="font-sans text-[7px] font-bold tracking-[0.15em] uppercase">{product.badge}</span>
                      </div>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="px-2.5 py-2.5 space-y-0.5">
                      <p className="font-sans text-[8px] tracking-widest uppercase text-[#C8A24A]/70">{product.category}</p>
                      <h4 className="font-serif text-xs font-medium text-[#1A1A1A] leading-snug line-clamp-2">{product.name}</h4>
                      <p className="font-sans text-xs font-bold text-[#1A1A1A] pt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="pt-12 text-center">
        <Button
          onClick={() => navigate("/products")}
          variant="contained"
          sx={{
            bgcolor: "#C8A24A", color: "#0F0F0F", fontFamily: "Inter",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
            borderRadius: "0px", px: 6, py: 1.75, border: "1px solid #C8A24A",
            "&:hover": { bgcolor: "transparent", color: "#C8A24A", boxShadow: "none" },
          }}
        >
          Explore All Collections
        </Button>
      </div>
    </section>
  );
};

export default BestSellers;
