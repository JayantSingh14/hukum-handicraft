import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { HomeCategory } from "../../../../types/homeDataTypes";

interface CollectionItem {
  id: number;
  image: string;
  categoryId: string;
}

const collections: CollectionItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000",
    categoryId: "wall_art",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000",
    categoryId: "table_decor",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000",
    categoryId: "lamps_lanterns",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1609137144814-8a48ef014674?q=80&w=1000",
    categoryId: "pooja_spiritual",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000",
    categoryId: "corporate",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1000",
    categoryId: "personalized",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000",
    categoryId: "luxury_hampers",
  },
];

interface LuxuryShowcaseProps {
  grid?: HomeCategory[];
}

const LuxuryShowcase = ({ grid }: LuxuryShowcaseProps) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [isHovered, setIsHovered] = useState(false);

  const list = (grid && grid.length > 0)
    ? grid.map((item, index) => ({
        id: item.id || index + 1,
        image: item.image,
        categoryId: item.categoryId,
      }))
    : collections;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % list.length);
  }, [list.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  }, [list.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  const handlePreviewClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const activeItem = list[activeIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 200, damping: 26 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 200, damping: 26 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <section className="relative px-5 lg:px-20 space-y-6">
      {/* Slider Viewport Container */}
      <div
        className="relative w-full aspect-[2.35/1] md:aspect-[2.5/1] lg:aspect-[2.8/1] min-h-[300px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden rounded-2xl md:rounded-3xl border border-brand-gold/10 bg-[#FAF8F2] shadow-luxury cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/products/${activeItem.categoryId}`)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              className="w-full h-full object-cover select-none pointer-events-none"
              src={activeItem.image}
              alt=""
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer (Left Arrow, Indicator Dots, Right Arrow) */}
      <div className="flex items-center justify-between px-2 pt-2 select-none">
        {/* Left Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="w-12 h-12 flex items-center justify-start text-matte-black/60 hover:text-brand-gold transition-colors duration-200 cursor-pointer"
          aria-label="Previous slide"
        >
          <span className="font-serif text-3xl font-light">←</span>
        </button>

        {/* Indicator Dots */}
        <div className="flex items-center gap-3">
          {list.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewClick(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-8 bg-brand-gold"
                    : "w-2 bg-matte-black/10 hover:bg-matte-black/20"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="w-12 h-12 flex items-center justify-end text-matte-black/60 hover:text-brand-gold transition-colors duration-200 cursor-pointer"
          aria-label="Next slide"
        >
          <span className="font-serif text-3xl font-light">→</span>
        </button>
      </div>
    </section>
  );
};

export default LuxuryShowcase;
