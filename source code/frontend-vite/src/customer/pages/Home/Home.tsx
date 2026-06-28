import { useState, useEffect, useRef } from "react";
import BestSellers from "./BestSellers/BestSellers";
import LuxuryShowcase from "./TopBrands/LuxuryShowcase";
import LuxuryMarquee from "./LuxuryMarquee/LuxuryMarquee";
import CategoryDiscovery from "./CategoryDiscovery/CategoryDiscovery";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Backdrop, Button, CircularProgress, Divider, TextField } from "@mui/material";
import ChatBot from "../ChatBot/ChatBot";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useNavigate } from "react-router-dom";
import { STORE_NAME } from "../../../util/storeConfig";
import { motion } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StarIcon from "@mui/icons-material/Star";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import heroVideo from "../../../assets/hero-video.mp4";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Framer Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Home = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  const { homePage } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  // GSAP ScrollTrigger reveals — runs after data loads
  useEffect(() => {
    if (homePage.loading) return;

    let ctx: any;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Reveal every [data-reveal] section as it enters viewport
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }, pageRef);

      // Force recalculation of scroll coordinates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [homePage.loading]);

  return (
    <>
      {!homePage.loading ? (
        <div ref={pageRef} className="space-y-8 lg:space-y-12 relative bg-[#FAF8F2] text-[#1A1A1A] overflow-hidden pb-12">

          {/* 1. Hero Section & Marquee Visual Bridge */}
          <div>
            <section className="hero-section relative h-[65vh] lg:h-[85vh] w-full overflow-hidden bg-matte-black flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <video
                className="hero-video w-full h-full object-cover"
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

            <div className="relative z-10 text-center px-5 max-w-4xl space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-sans text-xs lg:text-sm tracking-[0.5em] font-bold text-brand-gold uppercase block"
              >
                Heritage-Rich & Handcrafted
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium tracking-wide text-ivory-white"
              >
                Where Heritage Meets Elegance
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="font-sans text-sm md:text-lg text-ivory-white/80 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Experience world-class Indian craftsmanship and personalized luxury lifestyle creations curated for timeless living.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="pt-6 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => navigate("/products")}
                  variant="contained"
                  sx={{
                    bgcolor: "#C8A24A",
                    color: "#0F0F0F",
                    border: "1px solid #C8A24A",
                    borderRadius: "0px",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#C8A24A",
                    }
                  }}
                >
                  Explore Collection
                </Button>
                <Button
                  onClick={() => navigate("/products/personalized")}
                  variant="outlined"
                  sx={{
                    borderColor: "#FAF8F2",
                    color: "#FAF8F2",
                    borderRadius: "0px",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#C8A24A",
                      color: "#C8A24A",
                      bgcolor: "rgba(200, 162, 74, 0.1)"
                    }
                  }}
                >
                  Bespoke Gifts
                </Button>
              </motion.div>
            </div>
          </section>
          {/* Luxury Marquee Visual Bridge */}
          <LuxuryMarquee />
        </div>

        {/* 2. Premium Category Discovery Experience */}
        <CategoryDiscovery grid={homePage.homePageData?.grid} />

          {/* 3. Featured Collections Slider */}
          <section data-reveal>
            <LuxuryShowcase grid={homePage.homePageData?.grid} />
          </section>



          {/* 5. Bestselling Masterpieces Showcase */}
          <section data-reveal>
            <BestSellers />
          </section>

          {/* 6. Editorial Artisan Story Section */}
          <section data-reveal className="lazy-section px-5 lg:px-20 py-16 bg-white border-y border-[#C8A24A]/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[300px] lg:h-[500px] border border-[#C8A24A]/20 p-3">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1565192647048-f997ded87920?q=80&w=800"
                  alt="Artisanal Handcrafting"
                />
                <div className="absolute -bottom-6 -right-6 hidden lg:block bg-[#0F0F0F] text-[#FAF8F2] p-6 max-w-xs border border-[#C8A24A]/30">
                  <p className="font-serif text-lg italic text-[#C8A24A]">&ldquo;Heritage is not defined by time, but by the hands that preserve it.&rdquo;</p>
                </div>
              </div>
              <div className="space-y-6 lg:pl-10">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block">
                  The Heritage of {STORE_NAME}
                </span>
                <h2 className="font-serif text-3xl lg:text-5xl font-medium tracking-wide text-matte-black leading-tight uppercase">
                  Preserving Traditional Royal Indian Craftsmanship
                </h2>
                <p className="font-sans text-sm text-charcoal/80 leading-relaxed font-light">
                  Each masterpiece at {STORE_NAME} is meticulously crafted by hand, carrying the soul of centuries-old Indian artisan heritage. We collaborate directly with generations of traditional masters, ensuring every detail of carving, weave, and metalwork shines with authentic royal luxury.
                </p>
                <p className="font-sans text-sm text-charcoal/80 leading-relaxed font-light">
                  By bringing these exquisite creations directly into your home, we keep these historic artistic cultures alive. Experience the elegance of heritage tailored for the sophisticated modern home.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => navigate("/products")}
                    variant="outlined"
                    sx={{
                      borderColor: "#0F0F0F",
                      color: "#0F0F0F",
                      borderRadius: "0px",
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#C8A24A",
                        color: "#C8A24A",
                        bgcolor: "rgba(200, 162, 74, 0.05)"
                      }
                    }}
                  >
                    Our Artisan Story
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Why Choose HUKUM Section */}
          <section data-reveal className="lazy-section px-5 lg:px-20 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase">
                Signature Values
              </span>
              <h2 className="font-serif text-3xl lg:text-5xl font-semibold uppercase tracking-wide">
                Why Choose {STORE_NAME}
              </h2>
              <div className="h-[1px] w-24 bg-brand-gold mx-auto mt-4" />
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  title: "100% Authentic Handcrafted",
                  desc: "Every item is certified handcrafted by master Indian artisans with no factory automation.",
                  icon: <AutoAwesomeIcon sx={{ color: "#C8A24A", fontSize: "2.5rem" }} />
                },
                {
                  title: "Royal Indian Heritage",
                  desc: "Designs inspired by regal history, preserving traditional Indian craft processes.",
                  icon: <WorkspacePremiumIcon sx={{ color: "#C8A24A", fontSize: "2.5rem" }} />
                },
                {
                  title: "Bespoke Personalization",
                  desc: "Add custom engravings, metal plates, or photo canvas prints to make gifts uniquely theirs.",
                  icon: <LocalMallIcon sx={{ color: "#C8A24A", fontSize: "2.5rem" }} />
                },
                {
                  title: "Signature Luxury Wrapping",
                  desc: "Packed beautifully in handmade luxury boxes, designed to make a memorable first impression.",
                  icon: <StarIcon sx={{ color: "#C8A24A", fontSize: "2.5rem" }} />
                }
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="bg-white border border-[#C8A24A]/10 p-8 text-center space-y-4 hover:border-brand-gold hover:shadow-luxury transition-all duration-300"
                >
                  <div className="flex justify-center">{value.icon}</div>
                  <h4 className="font-serif text-lg font-semibold text-matte-black uppercase tracking-wider">{value.title}</h4>
                  <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-light">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* 8. Customer Testimonials */}
          <section data-reveal className="lazy-section px-5 lg:px-20 py-16 bg-[#0F0F0F] text-[#FAF8F2] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1606744824163-985d376605aa?w=1600&q=80"
                alt="Backdrop texture"
              />
            </div>
            <div className="relative z-10 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase">
                  Distinguished Voices
                </span>
                <h2 className="font-serif text-3xl lg:text-5xl font-semibold uppercase tracking-wide text-white">
                  Customer Testimonials
                </h2>
                <div className="h-[1px] w-24 bg-brand-gold mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Meera R.",
                    location: "Mumbai, India",
                    text: "The quality of the handcrafted brass vase is exquisite. It feels like a piece of living history in my room. The personalized card was a elegant touch."
                  },
                  {
                    name: "Vikram S.",
                    location: "Delhi, India",
                    text: "Perfect corporate gifts! The custom engraving option was seamless and our premium clients were deeply impressed by the traditional craftsmanship."
                  },
                  {
                    name: "Ananya P.",
                    location: "Bangalore, India",
                    text: "Unbelievable details and luxury presentation. HUKUM has redefined online gifting for traditional crafts. Highly recommended for weddings!"
                  }
                ].map((review, idx) => (
                  <div key={idx} className="bg-matte-black/60 border border-[#C8A24A]/25 p-8 rounded-none space-y-4 backdrop-blur-sm">
                    <div className="flex gap-1 justify-center lg:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: "#C8A24A", fontSize: "14px" }} />
                      ))}
                    </div>
                    <p className="font-serif text-sm italic text-ivory-white/80 leading-relaxed font-light">&ldquo;{review.text}&rdquo;</p>
                    <Divider sx={{ borderColor: "rgba(200, 162, 74, 0.15)" }} />
                    <div className="text-center lg:text-left">
                      <h5 className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-gold">{review.name}</h5>
                      <span className="text-[10px] text-ivory-white/50">{review.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Newsletter Section */}
          <section className="lazy-section px-5 lg:px-20">
            <div className="max-w-4xl mx-auto border border-[#C8A24A]/30 p-8 lg:p-12 text-center space-y-6 bg-white shadow-luxury">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block">
                The {STORE_NAME} Society
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium tracking-wide text-matte-black uppercase">
                Subscribe For Private Previews
              </h2>
              <p className="font-sans text-sm text-charcoal/70 max-w-md mx-auto font-light leading-relaxed">
                Receive exclusive invites to new collection launches, artisan stories, and seasonal private offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  size="small"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0px",
                      "& fieldset": {
                        borderColor: "rgba(200, 162, 74, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#C8A24A",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#C8A24A",
                      },
                    },
                    "& input": {
                      fontSize: "13px",
                      fontFamily: "Inter"
                    }
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#0F0F0F",
                    color: "#FAF8F2",
                    borderRadius: "0px",
                    fontWeight: 600,
                    px: 4,
                    height: "40px",
                    "&:hover": {
                      bgcolor: "#C8A24A",
                      color: "#0F0F0F"
                    }
                  }}
                >
                  Join
                </Button>
              </div>
            </div>
          </section>

          {/* Chat Launcher */}
          <section className="z-[999]">
            {showChatBot ? (
              <div className="fixed inset-4 md:inset-auto md:bottom-10 md:right-10 z-[999]">
                <ChatBot handleClose={() => setShowChatBot(false)} />
              </div>
            ) : (
              <div className="fixed bottom-10 right-10 z-[999]">
                <Button
                  onClick={() => setShowChatBot(true)}
                  sx={{
                    borderRadius: "2rem",
                    bgcolor: "#0F0F0F",
                    border: "1px solid #C8A24A",
                    "&:hover": {
                      bgcolor: "#C8A24A",
                      borderColor: "#0F0F0F"
                    }
                  }}
                  variant="contained"
                  className="h-14 w-14 flex justify-center items-center rounded-full shadow-lg"
                >
                  <ChatBubbleIcon sx={{ color: "white", fontSize: "1.8rem" }} />
                </Button>
              </div>
            )}
          </section>
        </div>
      ) : (
        <Backdrop open={true} sx={{ zIndex: 9999, color: "#C8A24A" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Home;
