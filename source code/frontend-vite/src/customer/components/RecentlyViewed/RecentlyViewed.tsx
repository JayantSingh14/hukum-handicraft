import { useNavigate } from "react-router-dom";
import { getRecentlyViewed } from "../../../util/recentlyViewed";
import { formatPrice } from "../../../util/formatPrice";

interface RecentlyViewedProps {
    excludeId?: number;
}

const RecentlyViewed = ({ excludeId }: RecentlyViewedProps) => {
    const navigate = useNavigate();
    const items = getRecentlyViewed().filter(p => p.id !== excludeId);

    if (!items.length) return null;

    return (
        <section className="mt-16">
            <div className="pb-4 border-b border-brand-gold/15 mb-6">
                <span className="font-sans text-[9px] tracking-[0.3em] text-brand-gold uppercase font-bold block mb-1">Your Browsing History</span>
                <h2 className="font-serif text-xl font-semibold text-matte-black">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {items.map(p => (
                    <div
                        key={p.id}
                        onClick={() => navigate(`/product-details/${p.giftCategory?.toLowerCase() || "gifts"}/${p.title}/${p.id}`)}
                        className="cursor-pointer group"
                    >
                        <div className="overflow-hidden border border-brand-gold/10 aspect-square">
                            <img
                                src={p.images?.[0]}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="pt-2 space-y-0.5">
                            <p className="font-sans text-[10px] text-charcoal/70 tracking-wide line-clamp-2 leading-tight">{p.title}</p>
                            <p className="font-sans text-xs font-semibold text-matte-black">₹{formatPrice(p.sellingPrice)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
