import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../../Redux Toolkit/Customer/ProductSlice';
import { Divider } from '@mui/material';
import ProductReviewCard from './ProductReviewCard';
import { fetchReviewsByProductId } from '../../../Redux Toolkit/Customer/ReviewSlice';
import RatingCard from './RatingCard';
import { STORE_NAME } from '../../../util/storeConfig';

const Reviews = () => {
    const dispatch = useAppDispatch();
    const { products, review } = useAppSelector(store => store)
    const { productId } = useParams()

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(Number(productId)))
            dispatch(fetchReviewsByProductId({ productId: Number(productId) }))
        }
    }, [productId, dispatch])

    return (
        <div className='p-5 lg:p-20 flex flex-col lg:flex-row gap-12'>
            <section className='w-full md:w-1/2 lg:w-[30%] space-y-4'>
                <div className='border border-[#C8A24A]/15 overflow-hidden'>
                    <img className='w-full object-cover' src={products.product?.images[0]} alt={products.product?.title} />
                </div>
                <div className='space-y-1'>
                    <p className='font-serif font-bold text-lg text-matte-black uppercase tracking-wider'>{STORE_NAME}</p>
                    <p className='font-sans text-sm text-charcoal/70'>{products.product?.title}</p>
                    <div className='flex items-center gap-3 font-sans text-sm pt-1'>
                        <span className='font-semibold text-charcoal'>₹{products.product?.sellingPrice}</span>
                        <span className='text-gray-400 line-through'>₹{products.product?.mrpPrice}</span>
                        <span className='text-brand-gold font-semibold'>{products.product?.discountPercent}% OFF</span>
                    </div>
                </div>
            </section>

            <section className="w-full md:w-1/2 lg:w-[70%] space-y-8">
                <div>
                    <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">Customer Voices</span>
                    <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">Reviews & Ratings</h1>
                    <div className="h-[1px] w-16 bg-brand-gold mt-3" />
                </div>
                <RatingCard totalReview={review.reviews.length} />
                <div className='space-y-6'>
                    {review.reviews.map((item, i) => (
                        <div key={item.id} className='space-y-5'>
                            <ProductReviewCard item={item} />
                            {review.reviews.length - 1 !== i && <Divider sx={{ borderColor: 'rgba(200,162,74,0.12)' }} />}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Reviews