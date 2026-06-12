import { useNavigate } from 'react-router-dom';
import { STORE_NAME } from '../../../../util/storeConfig';

const SimilarProductCard = ({ product }: any) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(
                `/product-details/${product.category?.categoryId || "gifts"}/${product.title}/${product.id}`
            )} 
            className='group cursor-pointer'
        >
            <div className="relative h-[300px] overflow-hidden border border-[#C8A24A]/10">
                <img
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.images[0]}
                    alt={`product-similar`}
                />
            </div>
            <div className='details pt-3 space-y-1 transition-all duration-300'>
                <div className='name space-y-0.5'>
                    <h1 className='font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase'>{STORE_NAME}</h1>
                    <p className='text-charcoal font-sans text-xs tracking-wider line-clamp-1'>{product.title}</p>
                </div>
                <div className='price flex items-center gap-3 font-sans text-xs tracking-wider'>
                    <span className='font-semibold text-charcoal'>₹{product.sellingPrice}</span>
                    <span className='text-gray-400 line-through'>₹{product.mrpPrice}</span>
                    <span className='text-brand-gold font-semibold'>{product.discountPercent}% OFF</span>
                </div>
            </div>
        </div>
    );
};

export default SimilarProductCard;
