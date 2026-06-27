const items = [
  "HANDCRAFTED IN INDIA",
  "LUXURY CRAFTSMANSHIP",
  "BESPOKE GIFTS",
  "ARTISAN MADE",
  "LIMITED COLLECTIONS",
  "ROYAL HERITAGE",
  "HANDMADE EXCELLENCE",
  "CURATED LUXURY"
];

// Repeat the array to guarantee length is wider than the viewport
const marqueeItems = [...items, ...items, ...items, ...items];
// Duplicate for the infinite scroll reset loop
const duplicatedItems = [...marqueeItems, ...marqueeItems];

const marqueeStyle = `
  @keyframes marquee-scroll {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee-scroll {
    display: flex;
    width: max-content;
    animation: marquee-scroll 70s linear infinite;
  }

  .animate-marquee-scroll:hover {
    animation-play-state: paused;
  }

  .shimmer-gold-text {
    color: #1A1A1A;
    font-weight: 600;
  }

  .gold-glow-star {
    color: #8C6B2D;
    text-shadow: 0 0 8px rgba(140, 107, 45, 0.4);
    display: inline-block;
  }
`;

export default function LuxuryMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-[#F8F5F0] border-y border-[#8C6B2D]/20 py-5 lg:py-6 h-[75px] lg:h-[85px] flex items-center z-20">
      <style>{marqueeStyle}</style>
      
      {/* Edge gradient fade overlays (High-Performance hardware-accelerated static overlays) */}
      <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-32 bg-gradient-to-r from-[#F8F5F0] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-32 bg-gradient-to-l from-[#F8F5F0] to-transparent z-10 pointer-events-none" />
      
      <div className="w-full overflow-hidden">
        <div className="animate-marquee-scroll flex gap-12 items-center whitespace-nowrap">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-12">
              <span className="shimmer-gold-text font-serif text-sm lg:text-base font-medium uppercase tracking-[0.25em] select-none">
                {item}
              </span>
              <span className="gold-glow-star text-lg select-none">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
