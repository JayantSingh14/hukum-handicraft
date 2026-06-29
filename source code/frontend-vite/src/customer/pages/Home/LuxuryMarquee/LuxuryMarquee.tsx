const items = [
  "HANDCRAFTED IN INDIA",
  "LUXURY CRAFTSMANSHIP",
  "BESPOKE GIFTS",
  "ARTISAN MADE",
  "LIMITED COLLECTIONS",
  "ROYAL HERITAGE",
  "HANDMADE EXCELLENCE",
  "CURATED LUXURY",
];

const marqueeItems = [...items, ...items, ...items, ...items];
const duplicatedItems = [...marqueeItems, ...marqueeItems];

const marqueeStyle = `
  @keyframes marquee-scroll {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee-scroll {
    display: flex;
    width: max-content;
    animation: marquee-scroll 60s linear infinite;
  }
  .animate-marquee-scroll:hover {
    animation-play-state: paused;
  }
`;

export default function LuxuryMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center"
      style={{
        background: "#0F0F0F",
        borderTop: "1px solid rgba(200,162,74,0.4)",
        borderBottom: "1px solid rgba(200,162,74,0.4)",
        height: 52,
      }}
    >
      <style>{marqueeStyle}</style>

      {/* Edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 lg:w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #0F0F0F, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #0F0F0F, transparent)" }} />

      <div className="w-full overflow-hidden">
        <div className="animate-marquee-scroll flex gap-10 items-center whitespace-nowrap">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-10">
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.3em",
                fontWeight: 600,
                color: "#C8A24A",
                textTransform: "uppercase",
                userSelect: "none",
              }}>
                {item}
              </span>
              <span style={{ color: "rgba(200,162,74,0.35)", fontSize: "0.45rem", userSelect: "none" }}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
