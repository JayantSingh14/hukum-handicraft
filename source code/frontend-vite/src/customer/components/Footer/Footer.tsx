import { useNavigate } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#0f0f0f] text-[#FAF8F2] border-t border-[#C8A24A]/15 pb-16 md:pb-0">
            <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-14 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

                    {/* Brand */}
                    <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                        <div>
                            <h5 className="font-serif text-2xl font-bold tracking-widest text-[#C8A24A] uppercase">HUKUM</h5>
                            <p className="text-[9px] tracking-[0.3em] text-[#C8A24A]/50 uppercase mt-1">Artisanal Luxury · Est. India</p>
                        </div>
                        <p className="font-sans text-[11px] text-[#FAF8F2]/45 leading-relaxed max-w-[220px]">
                            Each piece in our collection is handcrafted by master artisans, carrying centuries of Indian craftsmanship tradition.
                        </p>
                        <div className="flex gap-3 pt-1">
                            {[
                                { icon: <InstagramIcon sx={{ fontSize: 17 }} />, label: "Instagram" },
                                { icon: <FacebookIcon sx={{ fontSize: 17 }} />, label: "Facebook" },
                                { icon: <PinterestIcon sx={{ fontSize: 17 }} />, label: "Pinterest" },
                            ].map(s => (
                                <button
                                    key={s.label}
                                    aria-label={s.label}
                                    style={{
                                        width: 32, height: 32, borderRadius: "50%",
                                        border: "1px solid rgba(200,162,74,0.25)",
                                        background: "transparent",
                                        color: "rgba(250,248,242,0.5)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", transition: "all 0.2s",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget).style.borderColor = "#C8A24A"; (e.currentTarget).style.color = "#C8A24A"; }}
                                    onMouseLeave={e => { (e.currentTarget).style.borderColor = "rgba(200,162,74,0.25)"; (e.currentTarget).style.color = "rgba(250,248,242,0.5)"; }}
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h6 className="font-sans text-[9px] tracking-[0.3em] text-[#C8A24A] uppercase font-bold">Shop</h6>
                        <ul className="space-y-3">
                            {[
                                { label: "All Products", path: "/products" },
                                { label: "Wall Art", path: "/products/wall-art" },
                                { label: "Table Decor", path: "/products/table-decor" },
                                { label: "Lamps & Lanterns", path: "/products/lamps" },
                                { label: "Corporate Gifts", path: "/products/corporate" },
                                { label: "Wishlist", path: "/wishlist" },
                            ].map(item => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="font-sans text-[11px] text-[#FAF8F2]/50 hover:text-[#C8A24A] tracking-wider transition-colors duration-200 text-left"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-4">
                        <h6 className="font-sans text-[9px] tracking-[0.3em] text-[#C8A24A] uppercase font-bold">Account</h6>
                        <ul className="space-y-3">
                            {[
                                { label: "My Orders", path: "/account/orders" },
                                { label: "My Profile", path: "/account/profile" },
                                { label: "Saved Addresses", path: "/account/addresses" },
                                { label: "Shopping Cart", path: "/cart" },
                                { label: "Login / Sign Up", path: "/login" },
                            ].map(item => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="font-sans text-[11px] text-[#FAF8F2]/50 hover:text-[#C8A24A] tracking-wider transition-colors duration-200 text-left"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="space-y-4">
                        <h6 className="font-sans text-[9px] tracking-[0.3em] text-[#C8A24A] uppercase font-bold">Help</h6>
                        <ul className="space-y-3">
                            {[
                                "Shipping Policy",
                                "Return & Exchange",
                                "Track Your Order",
                                "Contact Us",
                                "About HUKUM",
                                "Artisan Stories",
                            ].map(item => (
                                <li key={item}>
                                    <span className="font-sans text-[11px] text-[#FAF8F2]/50 hover:text-[#C8A24A] tracking-wider transition-colors duration-200 cursor-pointer">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-[#C8A24A]/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="font-sans text-[10px] text-[#FAF8F2]/30 tracking-wider">
                        © {new Date().getFullYear()} HUKUM. All rights reserved. Handcrafted with ♥ in India.
                    </p>
                    <div className="flex gap-5">
                        {["Privacy Policy", "Terms of Service"].map(item => (
                            <span key={item} className="font-sans text-[10px] text-[#FAF8F2]/30 hover:text-[#C8A24A] cursor-pointer tracking-wider transition-colors duration-200">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
