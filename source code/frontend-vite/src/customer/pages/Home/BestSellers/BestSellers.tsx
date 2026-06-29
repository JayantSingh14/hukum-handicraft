import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, IconButton } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../../Redux Toolkit/Customer/ProductSlice";

interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge: "BESTSELLER" | "LIMITED EDITION" | "ARTISAN PICK" | "CUSTOMER FAVORITE" | "PERSONALIZED";
}

const bestsellerProducts: ProductItem[] = [
  {
    id: "royal_brass_urli",
    name: "Royal Brass Urli",
    description: "Exquisite hand-hammered brass vessel for floating floral arrangements.",
    price: "₹4,999",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
    badge: "BESTSELLER",
  },
  {
    id: "terracotta_vase",
    name: "Artisanal Terracotta Vase",
    description: "Earth-toned clay vessel meticulously detailed by native potters.",
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800",
    badge: "LIMITED EDITION",
  },
  {
    id: "mughal_silk_cushion",
    name: "Mughal Silk Cushion",
    description: "Fine hand-woven silk tapestry cover inspired by Mughal gardens.",
    price: "₹1,899",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800",
    badge: "ARTISAN PICK",
  },
  {
    id: "filigree_brass_lantern",
    name: "Filigree Brass Lantern",
    description: "Delicate geometric hand-cut metal patterns projecting warm ambient shadows.",
    price: "₹3,799",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
    badge: "CUSTOMER FAVORITE",
  },
  {
    id: "carved_teakwood_box",
    name: "Carved Teakwood Box",
    description: "Premium rosewood finish box featuring ornate floral relief carvings.",
    price: "₹2,999",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800",
    badge: "BESTSELLER",
  },
  {
    id: "inlaid_marble_coasters",
    name: "Inlaid Marble Coasters",
    description: "White Makrana marble set with intricate semi-precious stone inlay work.",
    price: "₹1,599",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800",
    badge: "LIMITED EDITION",
  },
  {
    id: "gilded_ganesha_idol",
    name: "Gilded Ganesha Idol",
    description: "Handcrafted copper-infused metal idol with gold leaf details.",
    price: "₹3,299",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800",
    badge: "ARTISAN PICK",
  },
  {
    id: "royal_emerald_vase",
    name: "Royal Emerald Vase",
    description: "Exquisite hand-carved soapstone vase with premium gold leaf filigree detailing.",
    price: "₹6,499",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800",
    badge: "LIMITED EDITION",
  },
  {
    id: "dhokra_horse",
    name: "Dhokra Tribal Horse",
    description: "Lost-wax cast tribal horse figurine in ancient Dhokra bronze tradition.",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
    badge: "ARTISAN PICK",
  },
  {
    id: "warli_wall_panel",
    name: "Warli Wall Panel",
    description: "Hand-painted Warli tribal art on reclaimed wood — a village story on your wall.",
    price: "₹2,799",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800",
    badge: "LIMITED EDITION",
  },
  {
    id: "pattachitra_box",
    name: "Pattachitra Keepsake Box",
    description: "Lacquered mango-wood box adorned with intricate Odishan Pattachitra motifs.",
    price: "₹1,999",
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?q=80&w=800",
    badge: "CUSTOMER FAVORITE",
  },
  {
    id: "brass_diya_set",
    name: "Heirloom Brass Diya Set",
    description: "Set of five hand-etched pure brass diyas — timeless temple craftsmanship.",
    price: "₹2,199",
    image: "https://images.unsplash.com/photo-1574274711972-3a5f9a70e7e5?q=80&w=800",
    badge: "BESTSELLER",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.06,
      duration: 0.8,
      ease: [0.25, 0.8, 0.25, 1] as const,
    },
  }),
};

const BestSellers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store: any) => store.products);
  const [wishlisted, setWishlisted] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getAllProducts({ pageNumber: 0 }));
  }, [dispatch]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Dynamically map from DB and pad with mock products if we have fewer than 8
  const displayProducts: ProductItem[] = (() => {
    const dbFeatured = products?.filter((p: any) => p.featured) || [];
    const mappedDbProducts = dbFeatured.map((p: any) => ({
      id: String(p.id),
      name: p.title,
      description: p.description || "Handcrafted with love by local artisans.",
      price: `₹${p.sellingPrice.toLocaleString("en-IN")}`,
      image: p.images?.[0] || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
      badge: (p.personalized ? "PERSONALIZED" : "BESTSELLER") as any,
    }));

    if (mappedDbProducts.length >= 12) {
      return mappedDbProducts.slice(0, 12);
    }

    const needed = 12 - mappedDbProducts.length;
    const padding = bestsellerProducts.slice(0, needed);
    return [...mappedDbProducts, ...padding];
  })();

  const handleProductClick = (product: ProductItem) => {
    if (isNaN(Number(product.id))) {
      navigate(`/products`);
    } else {
      const rawProduct = products?.find((p: any) => String(p.id) === product.id);
      const categoryId = rawProduct?.category?.categoryId || "wall_art";
      const name = rawProduct?.title?.replace(/\s+/g, "-") || product.name;
      navigate(`/product-details/${categoryId}/${name}/${product.id}`);
    }
  };

  return (
    <section className="bg-[#F8F5F0] py-16 px-5 lg:px-20 border-y border-[#C8A24A]/10 text-center select-none overflow-hidden">
      {/* Header Block */}
      <div className="max-w-3xl mx-auto space-y-2 mb-12">
        <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-[#C8A46A] uppercase block">
          Most Loved by Our Patrons
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-medium uppercase tracking-wide text-[#1A1A1A]">
          Bestselling Masterpieces
        </h2>
        <p className="font-sans text-xs md:text-sm text-[#1A1A1A]/70 font-light tracking-wide max-w-xl mx-auto">
          Discover the handcrafted creations most cherished by our customers.
        </p>
        <div className="h-[1px] w-24 bg-[#C8A46A] mx-auto mt-6" />
      </div>

      {/* 3. Products Container */}

      {/* Desktop Layout: Balanced Symmetrical Row/Flex Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="hidden lg:flex flex-wrap justify-center gap-8 w-full max-w-7xl mx-auto"
      >
        {displayProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            custom={idx}
            variants={cardVariants}
            onClick={() => handleProductClick(product)}
            className="group relative overflow-hidden rounded-[20px] border border-[#C8A46A]/20 bg-white shadow-sm hover:shadow-[0_0_25px_rgba(200,164,106,0.25)] hover:border-[#C8A46A]/50 transition-all duration-500 cursor-pointer w-[260px]"
          >
            <div className="h-[300px] w-full overflow-hidden relative">
              {/* Badge */}
              <div className="absolute top-3 left-3 bg-[#C8A46A] text-[#FAF8F2] px-2.5 py-1 text-[8px] font-sans font-bold tracking-widest uppercase shadow-[0_2px_8px_rgba(200,164,106,0.3)] z-10">
                {product.badge}
              </div>

              {/* Wishlist */}
              <IconButton
                onClick={(e) => toggleWishlist(product.id, e)}
                className="absolute top-3 right-3 z-10"
                sx={{
                  bgcolor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(4px)",
                  width: 30, height: 30,
                  color: wishlisted.includes(product.id) ? "#C8A46A" : "#1A1A1A",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.95)", transform: "scale(1.1)" },
                }}
              >
                {wishlisted.includes(product.id) ? <Favorite sx={{ fontSize: 14 }} /> : <FavoriteBorder sx={{ fontSize: 14 }} />}
              </IconButton>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Price overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] py-2.5 flex justify-center">
                <span className="font-sans text-[13px] font-bold text-white tracking-widest">
                  {product.price}
                </span>
              </div>

              {/* Hover quick-view */}
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pb-10">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FAF8F2", color: "#1A1A1A", fontFamily: "Inter",
                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em",
                    borderRadius: "0px", px: 3, py: 1, border: "1px solid #C8A46A",
                    "&:hover": { bgcolor: "#C8A46A", color: "white" },
                    transition: "all 0.3s ease",
                  }}
                >
                  Quick View
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tablet Layout: 2-Column Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="hidden sm:grid lg:hidden grid-cols-2 gap-8 max-w-2xl mx-auto"
      >
        {displayProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            custom={idx}
            variants={cardVariants}
            onClick={() => handleProductClick(product)}
            className="group relative overflow-hidden rounded-[20px] border border-[#C8A46A]/20 bg-white shadow-sm hover:shadow-[0_0_25px_rgba(200,164,106,0.25)] hover:border-[#C8A46A]/50 transition-all duration-500 cursor-pointer w-full"
          >
            <div className="h-[280px] w-full overflow-hidden relative">
              <div className="absolute top-3 left-3 bg-[#C8A46A] text-[#FAF8F2] px-2.5 py-1 text-[8px] font-sans font-bold tracking-widest uppercase z-10">
                {product.badge}
              </div>
              <IconButton
                onClick={(e) => toggleWishlist(product.id, e)}
                className="absolute top-3 right-3 z-10"
                sx={{ bgcolor: "rgba(255,255,255,0.85)", width: 30, height: 30, color: wishlisted.includes(product.id) ? "#C8A46A" : "#1A1A1A" }}
              >
                {wishlisted.includes(product.id) ? <Favorite sx={{ fontSize: 14 }} /> : <FavoriteBorder sx={{ fontSize: 14 }} />}
              </IconButton>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] py-2.5 flex justify-center">
                <span className="font-sans text-[13px] font-bold text-white tracking-widest">{product.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile Layout: Snap Swipe Carousel */}
      <div
        className="flex sm:hidden overflow-x-auto gap-6 px-4 py-4 scrollbar-none snap-x snap-mandatory w-full max-w-full"
        style={{ scrollbarWidth: "none" }}
      >
        {displayProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="snap-center shrink-0 w-[240px] relative overflow-hidden rounded-[20px] border border-[#C8A46A]/20 bg-white shadow-sm cursor-pointer"
          >
            <div className="h-[260px] w-full overflow-hidden relative">
              <div className="absolute top-3 left-3 bg-[#C8A46A] text-[#FAF8F2] px-2.5 py-1 text-[8px] font-sans font-bold tracking-widest uppercase z-10">
                {product.badge}
              </div>
              <IconButton
                onClick={(e) => toggleWishlist(product.id, e)}
                className="absolute top-3 right-3 z-10"
                sx={{ bgcolor: "rgba(255,255,255,0.85)", width: 28, height: 28, color: wishlisted.includes(product.id) ? "#C8A46A" : "#1A1A1A" }}
              >
                {wishlisted.includes(product.id) ? <Favorite sx={{ fontSize: 13 }} /> : <FavoriteBorder sx={{ fontSize: 13 }} />}
              </IconButton>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] py-2 flex justify-center">
                <span className="font-sans text-[12px] font-bold text-white tracking-widest">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Luxury CTA Button */}
      <div className="pt-12 text-center">
        <Button
          onClick={() => navigate("/products")}
          variant="contained"
          sx={{
            bgcolor: "#C8A46A",
            color: "#FAF8F2",
            fontFamily: "Inter",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            borderRadius: "0px",
            px: 6,
            py: 2,
            border: "1px solid #C8A46A",
            boxShadow: "0 4px 15px rgba(200, 164, 106, 0.2)",
            "&:hover": {
              bgcolor: "transparent",
              color: "#C8A46A",
              boxShadow: "0 4px 20px rgba(200, 164, 106, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Explore All Collections
        </Button>
      </div>
    </section>
  );
};

export default BestSellers;
