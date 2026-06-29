import { useState, useEffect, useRef } from "react";
import BestSellers from "./BestSellers/BestSellers";
import LuxuryShowcase from "./TopBrands/LuxuryShowcase";
import LuxuryMarquee from "./LuxuryMarquee/LuxuryMarquee";
import CategoryDiscovery from "./CategoryDiscovery/CategoryDiscovery";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, Button, CircularProgress, Divider, IconButton, TextField } from "@mui/material";
import ChatBot from "../ChatBot/ChatBot";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useNavigate } from "react-router-dom";
import { STORE_NAME } from "../../../util/storeConfig";
import { motion, AnimatePresence } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StarIcon from "@mui/icons-material/Star";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import heroVideo from "../../../assets/hero-video.mp4";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Count-up hook ──────────────────────────────────────────────
const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
};

// ── Stat counter component ────────────────────────────────────
const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-6 py-4">
      <p className="font-serif text-3xl lg:text-4xl font-bold text-[#C8A24A]">
        {count}{suffix}
      </p>
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/60 mt-1">{label}</p>
    </div>
  );
};

// ── Gallery images ─────────────────────────────────────────────
const galleryImages = [
  "https://images.unsplash.com/photo-1565192647048-f997ded87920?q=80&w=600",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600",
  "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?q=80&w=600",
  "https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=600",
  "https://images.unsplash.com/photo-1573408301185-9519f94816b5?q=80&w=600",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600",
];

const Home = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const { homePage } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const pageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  // Parallax on video
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP scroll reveals
  useEffect(() => {
    if (homePage.loading) return;
    let ctx: any;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } }
          );
        });
      }, pageRef);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, 150);
    return () => { clearTimeout(timer); if (ctx) ctx.revert(); };
  }, [homePage.loading]);

  // Auto-advance testimonials on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    { name: "Meera R.", location: "Mumbai", initials: "MR", text: "The quality of the handcrafted brass vase is exquisite. It feels like a piece of living history in my room. The personalized card was an elegant touch." },
    { name: "Vikram S.", location: "Delhi", initials: "VS", text: "Perfect corporate gifts! The custom engraving option was seamless and our premium clients were deeply impressed by the traditional craftsmanship." },
    { name: "Ananya P.", location: "Bangalore", initials: "AP", text: "Unbelievable details and luxury presentation. HUKUM has redefined online gifting for traditional crafts. Highly recommended for weddings!" },
  ];

  return (
    <>
      {!homePage.loading ? (
        <div ref={pageRef} className="space-y-0 relative bg-[#FAF8F2] text-[#1A1A1A] overflow-hidden">

          {/* ── 1. HERO ──────────────────────────────────────────── */}
          <section className="relative h-[65vh] lg:h-[90vh] w-full overflow-hidden bg-matte-black flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ transformOrigin: "top center" }}
                src={heroVideo}
                autoPlay loop muted playsInline
              />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/15" />

            {/* Hero text */}
            <div className="relative z-10 text-center px-5 max-w-4xl space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-sans text-xs lg:text-sm tracking-[0.5em] font-bold text-brand-gold uppercase block"
              >
                Heritage-Rich & Handcrafted
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium tracking-wide text-ivory-white"
                style={{ textShadow: "2px 4px 24px rgba(0,0,0,0.55)" }}
              >
                Where Heritage Meets Elegance
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="font-sans text-sm md:text-lg text-ivory-white/85 max-w-2xl mx-auto font-light leading-relaxed"
                style={{ textShadow: "1px 1px 8px rgba(0,0,0,0.4)" }}
              >
                Experience world-class Indian craftsmanship and personalized luxury lifestyle creations curated for timeless living.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="pt-6 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button onClick={() => navigate("/products")} variant="contained" sx={{ bgcolor: "#C8A24A", color: "#0F0F0F", border: "1px solid #C8A24A", borderRadius: "0px", fontWeight: 600, px: 4, py: 1.5, letterSpacing: "0.1em", "&:hover": { bgcolor: "transparent", color: "#C8A24A" } }}>
                  Explore Collection
                </Button>
                <Button onClick={() => navigate("/products/personalized")} variant="outlined" sx={{ borderColor: "#FAF8F2", color: "#FAF8F2", borderRadius: "0px", fontWeight: 600, px: 4, py: 1.5, letterSpacing: "0.1em", "&:hover": { borderColor: "#C8A24A", color: "#C8A24A", bgcolor: "rgba(200,162,74,0.1)" } }}>
                  Bespoke Gifts
                </Button>
              </motion.div>
            </div>

            {/* Scroll arrow */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" })}
            >
              <span className="font-sans text-[9px] tracking-[0.25em] text-[#FAF8F2]/60 uppercase">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A24A" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </section>

          {/* ── MARQUEE ───────────────────────────────────────────── */}
          <LuxuryMarquee />

          {/* ── STATS BAR ─────────────────────────────────────────── */}
          <div className="bg-[#0F0F0F] border-b border-[#C8A24A]/15">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center divide-x divide-[#C8A24A]/15">
              <StatCounter value={500} suffix="+" label="Master Artisans" />
              <StatCounter value={1000} suffix="+" label="Handcrafted Products" />
              <StatCounter value={50} suffix="+" label="Craft Traditions" />
              <StatCounter value={10000} suffix="+" label="Happy Customers" />
            </div>
          </div>

          {/* ── 2. CATEGORY DISCOVERY ────────────────────────────── */}
          <CategoryDiscovery grid={homePage.homePageData?.grid} />

          {/* ── 3. FEATURED COLLECTIONS ──────────────────────────── */}
          <section data-reveal>
            <LuxuryShowcase grid={homePage.homePageData?.grid} />
          </section>

          {/* ── 4. BESTSELLERS ───────────────────────────────────── */}
          <section data-reveal>
            <BestSellers />
          </section>

          {/* ── 5. ARTISAN STORY ─────────────────────────────────── */}
          <section data-reveal className="px-5 lg:px-20 py-16 lg:py-24 bg-white border-y border-[#C8A24A]/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image side */}
              <div className="relative">
                <div className="relative h-[300px] lg:h-[520px] border border-[#C8A24A]/20 p-3">
                  <img
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1565192647048-f997ded87920?q=80&w=800"
                    alt="Artisanal Handcrafting"
                  />
                  {/* Play button overlay */}
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                    style={{ background: "rgba(0,0,0,0)" }}
                  >
                    <div className="w-16 h-16 rounded-full bg-black/50 border border-[#C8A24A]/60 flex items-center justify-center group-hover:bg-[#C8A24A] transition-all duration-300 backdrop-blur-sm">
                      <PlayCircleOutlineIcon sx={{ fontSize: 32, color: "#FAF8F2" }} />
                    </div>
                    <span className="absolute bottom-6 left-0 right-0 text-center font-sans text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/80">
                      Watch Craftsmanship
                    </span>
                  </button>
                </div>

                {/* Quote box */}
                <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-6 lg:-right-6 bg-[#0F0F0F] text-[#FAF8F2] p-5 lg:p-6 lg:max-w-xs border border-[#C8A24A]/30">
                  <p className="font-serif text-sm lg:text-base italic text-[#C8A24A] leading-relaxed">&ldquo;Heritage is not defined by time, but by the hands that preserve it.&rdquo;</p>
                </div>
              </div>

              {/* Text side */}
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

                {/* Impact numbers */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#C8A24A]/15">
                  {[
                    { val: "200+", label: "Master Artisans" },
                    { val: "15+", label: "States of India" },
                    { val: "30yr", label: "Heritage" },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <p className="font-serif text-2xl lg:text-3xl font-bold text-[#C8A24A]">{stat.val}</p>
                      <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal/50 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate("/products")}
                  variant="outlined"
                  sx={{ borderColor: "#0F0F0F", color: "#0F0F0F", borderRadius: "0px", px: 4, py: 1.5, fontWeight: 600, letterSpacing: "0.1em", "&:hover": { borderColor: "#C8A24A", color: "#C8A24A", bgcolor: "rgba(200,162,74,0.05)" } }}
                >
                  Our Artisan Story
                </Button>
              </div>
            </div>
          </section>

          {/* ── 6. PROCESS SECTION ───────────────────────────────── */}
          <section data-reveal className="px-5 lg:px-20 py-16 bg-[#F8F5F0] border-b border-[#C8A24A]/10">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase">Our Process</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold uppercase tracking-wide text-matte-black">How It's Made</h2>
              <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Selected by Artisans",
                  desc: "Each raw material — brass, wood, clay or textile — is hand-picked by master craftspeople from ethically sourced Indian suppliers.",
                  icon: "✦",
                },
                {
                  step: "02",
                  title: "Handcrafted with Care",
                  desc: "Using age-old techniques passed down across generations, every piece is shaped, carved, painted and finished entirely by hand. No factory. No shortcuts.",
                  icon: "◈",
                },
                {
                  step: "03",
                  title: "Delivered to You",
                  desc: "Carefully packed in our signature luxury boxes with handmade tissue wrapping and a personal artisan card, delivered straight to your door.",
                  icon: "◇",
                },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center p-8 lg:p-10 group">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-16 right-0 w-[1px] h-16 bg-[#C8A24A]/20" />
                  )}
                  <div className="w-14 h-14 rounded-full border border-[#C8A24A]/40 flex items-center justify-center mb-5 group-hover:border-[#C8A24A] transition-colors duration-300 bg-white">
                    <span className="font-sans text-[10px] tracking-[0.2em] font-bold text-[#C8A24A]">{step.step}</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-matte-black uppercase tracking-wide mb-3">{step.title}</h4>
                  <p className="font-sans text-xs text-charcoal/65 leading-relaxed font-light">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. WHY CHOOSE HUKUM ──────────────────────────────── */}
          <section data-reveal className="px-5 lg:px-20 py-16 lg:py-20" style={{ background: "linear-gradient(160deg, #FAF8F2 0%, #F0E8D8 100%)" }}>
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase">Signature Values</span>
              <h2 className="font-serif text-3xl lg:text-5xl font-semibold uppercase tracking-wide">Why Choose {STORE_NAME}</h2>
              <div className="h-[1px] w-24 bg-brand-gold mx-auto mt-4" />
            </div>

            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { title: "100% Authentic Handcrafted", desc: "Every item is certified handcrafted by master Indian artisans with no factory automation.", icon: <AutoAwesomeIcon sx={{ color: "#C8A24A", fontSize: "2.2rem" }} /> },
                { title: "Royal Indian Heritage", desc: "Designs inspired by regal history, preserving traditional Indian craft processes.", icon: <WorkspacePremiumIcon sx={{ color: "#C8A24A", fontSize: "2.2rem" }} /> },
                { title: "Bespoke Personalization", desc: "Add custom engravings, metal plates, or photo canvas prints to make gifts uniquely theirs.", icon: <LocalMallIcon sx={{ color: "#C8A24A", fontSize: "2.2rem" }} /> },
                { title: "Signature Luxury Wrapping", desc: "Packed in handmade luxury boxes designed to make a memorable first impression.", icon: <StarIcon sx={{ color: "#C8A24A", fontSize: "2.2rem" }} /> },
              ].map((value, idx) => (
                <motion.div
                  key={idx} variants={fadeUp} custom={idx}
                  className="bg-white border border-[#C8A24A]/10 p-8 text-center space-y-4 group hover:shadow-lg transition-all duration-300"
                  style={{ borderTop: "2px solid transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.borderTop = "2px solid #C8A24A")}
                  onMouseLeave={e => (e.currentTarget.style.borderTop = "2px solid transparent")}
                >
                  <div className="flex justify-center mb-2">{value.icon}</div>
                  <h4 className="font-serif text-base font-semibold text-matte-black uppercase tracking-wider leading-tight">{value.title}</h4>
                  <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-light">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── 8. TESTIMONIALS ──────────────────────────────────── */}
          <section data-reveal className="px-5 lg:px-20 py-16 lg:py-20 bg-[#0F0F0F] text-[#FAF8F2] relative overflow-hidden">
            <div className="absolute inset-0 opacity-8 pointer-events-none">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1606744824163-985d376605aa?w=1600&q=80" alt="" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase">Distinguished Voices</span>
                {/* Star summary */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: "#C8A24A", fontSize: "14px" }} />)}</div>
                  <span className="font-sans text-xs text-[#FAF8F2]/60">4.9 out of 5 — 200+ verified reviews</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-5xl font-semibold uppercase tracking-wide text-white">Customer Testimonials</h2>
                <div className="h-[1px] w-24 bg-brand-gold mx-auto mt-4" />
              </div>

              {/* Desktop: 3 columns */}
              <div className="hidden md:grid grid-cols-3 gap-6">
                {testimonials.map((review, idx) => (
                  <div key={idx} className="bg-white/5 border border-[#C8A24A]/20 p-8 space-y-5 backdrop-blur-sm hover:border-[#C8A24A]/50 transition-colors duration-300">
                    <div className="flex gap-1">{[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: "#C8A24A", fontSize: "12px" }} />)}</div>
                    <p className="font-serif text-sm italic text-ivory-white/80 leading-relaxed font-light">&ldquo;{review.text}&rdquo;</p>
                    <Divider sx={{ borderColor: "rgba(200,162,74,0.15)" }} />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C8A24A] flex items-center justify-center shrink-0">
                        <span className="font-sans text-[11px] font-bold text-[#0F0F0F]">{review.initials}</span>
                      </div>
                      <div>
                        <h5 className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-gold">{review.name}</h5>
                        <span className="text-[10px] text-ivory-white/40">{review.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: carousel */}
              <div className="block md:hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white/5 border border-[#C8A24A]/20 p-7 space-y-4 backdrop-blur-sm"
                  >
                    <div className="flex gap-1">{[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: "#C8A24A", fontSize: "12px" }} />)}</div>
                    <p className="font-serif text-sm italic text-ivory-white/80 leading-relaxed">&ldquo;{testimonials[activeTestimonial].text}&rdquo;</p>
                    <Divider sx={{ borderColor: "rgba(200,162,74,0.15)" }} />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C8A24A] flex items-center justify-center shrink-0">
                        <span className="font-sans text-[11px] font-bold text-[#0F0F0F]">{testimonials[activeTestimonial].initials}</span>
                      </div>
                      <div>
                        <h5 className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-gold">{testimonials[activeTestimonial].name}</h5>
                        <span className="text-[10px] text-ivory-white/40">{testimonials[activeTestimonial].location}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setActiveTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-[#C8A24A] w-5" : "bg-[#FAF8F2]/20"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 9. GALLERY STRIP ─────────────────────────────────── */}
          <section data-reveal className="py-12 bg-[#FAF8F2]">
            <div className="text-center mb-8 space-y-1 px-5">
              <span className="font-sans text-[9px] tracking-[0.3em] text-brand-gold uppercase font-bold">The Craft in Detail</span>
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-matte-black uppercase tracking-wide">Artisan Gallery</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5 px-0">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative overflow-hidden aspect-square group cursor-pointer" onClick={() => navigate("/products")}>
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="font-sans text-[10px] tracking-[0.25em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop Now</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/products")}
                className="font-sans text-xs tracking-[0.2em] uppercase text-brand-gold hover:text-matte-black border-b border-brand-gold/40 pb-0.5 transition-colors duration-200"
              >
                View Full Collection →
              </button>
            </div>
          </section>

          {/* ── 10. NEWSLETTER ───────────────────────────────────── */}
          <section data-reveal className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1208 50%, #0f0f0f 100%)" }}>
            {/* Gold mandala watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
              <span className="font-serif text-[40vw] text-[#C8A24A]">✦</span>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto px-5 py-16 lg:py-20 text-center space-y-6">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block">The {STORE_NAME} Society</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium tracking-wide text-[#FAF8F2] uppercase">
                Subscribe For Private Previews
              </h2>
              <p className="font-sans text-sm text-[#FAF8F2]/55 max-w-md mx-auto font-light leading-relaxed">
                Receive exclusive invites to new collection launches, artisan stories, and seasonal private offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <TextField
                  fullWidth placeholder="Enter your email" size="small" variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0px",
                      "& fieldset": { borderColor: "rgba(200,162,74,0.3)" },
                      "&:hover fieldset": { borderColor: "#C8A24A" },
                      "&.Mui-focused fieldset": { borderColor: "#C8A24A" },
                    },
                    "& input": { fontSize: "13px", fontFamily: "Inter", color: "#FAF8F2" },
                    "& .MuiInputBase-input::placeholder": { color: "rgba(250,248,242,0.4)" },
                  }}
                />
                <Button variant="contained" sx={{ bgcolor: "#C8A24A", color: "#0F0F0F", borderRadius: "0px", fontWeight: 700, px: 4, height: "40px", letterSpacing: "0.1em", whiteSpace: "nowrap", "&:hover": { bgcolor: "#FAF8F2", color: "#0F0F0F" } }}>
                  Get Early Access
                </Button>
              </div>
              <p className="font-sans text-[10px] text-[#FAF8F2]/30 tracking-wider">✦ No spam. Unsubscribe anytime.</p>
            </div>
          </section>

          {/* ── CHAT LAUNCHER ────────────────────────────────────── */}
          <section className="z-[999]">
            {showChatBot ? (
              <div className="fixed inset-4 md:inset-auto md:bottom-10 md:right-10 z-[999]">
                <ChatBot handleClose={() => setShowChatBot(false)} />
              </div>
            ) : (
              <div className="fixed bottom-20 md:bottom-10 right-4 md:right-10 z-[999]">
                <Button
                  onClick={() => setShowChatBot(true)}
                  sx={{ borderRadius: "2rem", bgcolor: "#0F0F0F", border: "1px solid #C8A24A", "&:hover": { bgcolor: "#C8A24A", borderColor: "#0F0F0F" } }}
                  variant="contained"
                  className="h-14 w-14 flex justify-center items-center rounded-full shadow-lg"
                >
                  <ChatBubbleIcon sx={{ color: "white", fontSize: "1.8rem" }} />
                </Button>
              </div>
            )}
          </section>

          {/* ── VIDEO MODAL ──────────────────────────────────────── */}
          <AnimatePresence>
            {showVideo && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4"
                onClick={() => setShowVideo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                  className="relative w-full max-w-3xl aspect-video bg-black"
                  onClick={e => e.stopPropagation()}
                >
                  <IconButton
                    onClick={() => setShowVideo(false)}
                    sx={{ position: "absolute", top: -40, right: 0, color: "#FAF8F2" }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Artisan Craftsmanship"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
