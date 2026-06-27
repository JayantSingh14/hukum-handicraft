import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../Redux Toolkit/Store'
import WishlistProductCard from './WishlistProductCard';

const Wishlist = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!localStorage.getItem("jwt")) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [navigate, location.pathname]);
    const { wishlist } = useAppSelector(store => store)

    return (
        <div className="min-h-screen p-5 lg:p-20 bg-ivory">
            {wishlist.wishlist?.products.length ? (
                <section className="space-y-8">
                    <div className="pb-5 border-b border-brand-gold/15">
                        <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                            Curated Favorites
                        </span>
                        <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
                            My Wishlist <span className="font-sans text-lg font-light text-charcoal/60 lowercase ml-2">({wishlist.wishlist.products.length} items)</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {wishlist.wishlist?.products?.map((item) => (
                            <WishlistProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            ) : (
                <div className="h-[60vh] flex justify-center items-center flex-col gap-4">
                    <div className="text-center space-y-2">
                        <h1 className="font-serif text-2xl font-semibold text-matte-black tracking-wide">
                            Your Wishlist is Empty
                        </h1>
                        <p className="font-sans text-sm text-charcoal/50 max-w-xs mx-auto">
                            Add premium handcrafted artisan products you love to your curated list of favorites.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Wishlist