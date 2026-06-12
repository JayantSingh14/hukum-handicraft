import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types/productTypes';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import CloseIcon from '@mui/icons-material/Close';
import { addProductToWishlist } from '../../../Redux Toolkit/Customer/WishlistSlice';
import { STORE_NAME } from '../../../util/storeConfig';

interface ProductCardProps {
    item: Product;
}

const WishlistProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleIconClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (item.id) {
            dispatch(addProductToWishlist({ productId: item.id }));
        }
    };

    return (
        <div 
            onClick={() => navigate(`/product-details/${item.giftCategory?.toLowerCase() || "gifts"}/${item.title}/${item.id}`)}
            className='w-60 relative group cursor-pointer bg-transparent'
        >
            <div className="w-full overflow-hidden border border-[#C8A24A]/10">
                <img
                    className="object-cover object-top w-full h-[320px] group-hover:scale-105 transition-transform duration-500"
                    src={item.images[0]}
                    alt={`product-${item.title}`}
                />
            </div>
            <div className='pt-3 space-y-1 rounded-md'>
                <div className='space-y-0.5'>
                    <h1 className='font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase'>{STORE_NAME}</h1>
                    <p className='text-charcoal font-sans text-xs tracking-wider line-clamp-1'>{item.title}</p>
                </div>
                <div className='flex items-center gap-3 font-sans text-xs tracking-wider'>
                    <span className='font-semibold text-charcoal'>₹{item.sellingPrice}</span>
                    <span className='text-gray-400 line-through'>₹{item.mrpPrice}</span>
                    <span className='text-brand-gold font-semibold'>{item.discountPercent}% OFF</span>
                </div>
            </div>

            <div className='absolute top-2 right-2 z-10'>
                <button
                    onClick={handleIconClick}
                    className="p-1.5 rounded-full bg-white/85 hover:bg-white text-matte-black border border-[#C8A24A]/25 hover:border-brand-gold transition-colors duration-200 shadow-sm"
                >
                    <CloseIcon sx={{ fontSize: "16px" }} />
                </button>
            </div>
        </div>
    );
};

export default WishlistProductCard;