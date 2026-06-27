import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { HomeCategory } from "../../../../types/homeDataTypes";

interface CategoryDiscoveryProps {
  grid?: HomeCategory[];
}

const fallbackImages: { [key: string]: string } = {
  wall_art: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000",
  table_decor: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000",
  lamps_lanterns: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000",
  pooja_spiritual: "https://images.unsplash.com/photo-1609137144814-8a48ef014674?q=80&w=1000",
  corporate: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000",
  personalized: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1000",
  luxury_hampers: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000",
};

const categoryMetaData = [
  {
    id: "wall_art",
    title: "WALL ART & HANGINGS",
    description: "Curated Heritage Décor",
  },
  {
    id: "table_decor",
    title: "TABLE DÉCOR",
    description: "Artisan Crafted Accents",
  },
  {
    id: "lamps_lanterns",
    title: "LAMPS & LANTERNS",
    description: "Timeless Illumination",
  },
  {
    id: "pooja_spiritual",
    title: "POOJA COLLECTION",
    description: "Sacred Luxury",
  },
  {
    id: "corporate",
    title: "CORPORATE GIFTING",
    description: "Curated Excellence",
  },
  {
    id: "personalized",
    title: "PERSONALIZED GIFTS",
    description: "Made Uniquely Yours",
  },
  {
    id: "luxury_hampers",
    title: "LUXURY GIFT HAMPERS",
    description: "Curated Experiences",
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] as const },
  },
};

const CategoryDiscovery = ({ grid }: CategoryDiscoveryProps) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    handleScroll();
    // Run after a short delay to ensure contents are rendered and clientWidth is calculated
    const timer = setTimeout(handleScroll, 500);
    window.addEventListener("resize", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Map images from DB grid list if they match category ID, else use fallback
  const getCategoryImage = (id: string) => {
    const matched = grid?.find((item) => item.categoryId === id);
    return matched?.image || fallbackImages[id] || "";
  };

  return (
    <section className="bg-[#F8F5F0] py-16 px-5 lg:px-20 border-y border-[#C8A24A]/10 text-center space-y-8 select-none">
      {/* Header section */}
      <div className="max-w-3xl mx-auto space-y-2">
        <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-brand-gold uppercase block">
          Explore Our Collections
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-medium uppercase tracking-wide text-matte-black">
          Curated for Timeless Living
        </h2>
        <div className="h-[1px] w-24 bg-brand-gold mx-auto mt-4" />
      </div>

      {/* Desktop Layout: Centered Horizontal Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="hidden lg:flex justify-center items-stretch gap-0 w-full max-w-7xl mx-auto"
      >
        {categoryMetaData.map((cat, index) => {
          const image = getCategoryImage(cat.id);
          return (
            <div key={cat.id} className="flex items-stretch">
              {/* Category Circle and Details */}
              <motion.div
                variants={cardVariants}
                className="flex flex-col items-center text-center cursor-pointer w-40"
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/products/${cat.id}`)}
              >
                {/* Circular image box with border glow */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-32 h-32 rounded-full overflow-hidden border border-[#C8A46A] shadow-md relative"
                  style={{
                    boxShadow: hoveredId === cat.id ? "0 0 15px rgba(200, 164, 106, 0.5)" : "0 4px 6px -1px rgba(0,0,0,0.05)"
                  }}
                >
                  <img
                    className="w-full h-full object-cover select-none pointer-events-none"
                    src={image}
                    alt={cat.title}
                    loading="lazy"
                  />
                </motion.div>

                {/* Small luxury separator star */}
                <div className="flex justify-center mt-4 mb-1">
                  <span className="text-[10px] text-brand-gold/60">✦</span>
                </div>

                {/* Title */}
                <h4 className="font-serif text-[13px] lg:text-[15px] tracking-[0.18em] font-semibold text-matte-black uppercase max-w-[160px] leading-relaxed">
                  {cat.title}
                </h4>

                {/* Sliding Category Description */}
                <motion.div
                  animate={{
                    height: hoveredId === cat.id ? "auto" : 0,
                    opacity: hoveredId === cat.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden w-full"
                >
                  <p className="font-sans text-[11px] lg:text-[12px] text-charcoal/60 mt-1.5 italic font-light tracking-wide leading-relaxed">
                    {cat.description}
                  </p>
                </motion.div>
              </motion.div>

              {/* Vertical separator line between items */}
              {index < categoryMetaData.length - 1 && (
                <div className="h-16 w-[1px] bg-[#C8A46A]/20 self-center mx-4" />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Mobile Layout: Snap Carousel with Side Arrows */}
      <div className="relative block lg:hidden w-full group/scroll">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1.5 top-[56px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-brand-gold/25 flex items-center justify-center text-matte-black shadow-md active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#C8A24A" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        <motion.div
          ref={scrollRef}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex overflow-x-auto gap-8 px-6 py-4 scrollbar-none snap-x snap-mandatory w-full max-w-full"
          style={{ scrollbarWidth: "none" }}
        >
          {categoryMetaData.map((cat) => {
            const image = getCategoryImage(cat.id);
            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                className="snap-center shrink-0 w-36 flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/products/${cat.id}`)}
                onTapStart={() => setHoveredId(cat.id)}
                onTapCancel={() => setHoveredId(null)}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border border-[#C8A46A] shadow-md">
                  <img
                    className="w-full h-full object-cover select-none pointer-events-none"
                    src={image}
                    alt={cat.title}
                    loading="lazy"
                  />
                </div>

                <div className="flex justify-center mt-3 mb-1">
                  <span className="text-[10px] text-brand-gold/60">✦</span>
                </div>

                <h4 className="font-serif text-[12px] tracking-[0.15em] font-semibold text-matte-black uppercase max-w-[130px] leading-relaxed text-center">
                  {cat.title}
                </h4>
                <p className="font-sans text-[10px] text-charcoal/65 mt-1 italic font-light tracking-wide text-center">
                  {cat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1.5 top-[56px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-brand-gold/25 flex items-center justify-center text-matte-black shadow-md active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#C8A24A" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryDiscovery;
