import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../../Redux Toolkit/Customer/ProductSlice';
import ReviewForm from './ReviewForm';
import { STORE_NAME } from '../../../util/storeConfig';

const WriteReviews = () => {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector(store => store)
    const { productId } = useParams()

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(Number(productId)))
        }
    }, [productId, dispatch])

    return (
        <div className="p-5 lg:p-20 flex flex-col lg:flex-row gap-12 bg-ivory min-h-screen">
            <div className="w-full lg:w-[30%] space-y-4">
                <div className="border border-brand-gold/15 bg-white p-2">
                    <img className="w-full object-cover" src={products.product?.images[0]} alt="" />
                </div>
                <div className="space-y-1">
                    <h2 className="font-serif font-bold text-lg text-matte-black uppercase tracking-wider">
                        {STORE_NAME}
                    </h2>
                    <p className="font-sans text-sm text-charcoal/70">{products.product?.title}</p>
                    <div className="flex items-center gap-3 font-sans text-sm pt-2">
                        <span className="font-semibold text-matte-black">₹{products.product?.sellingPrice}</span>
                        <span className="text-charcoal/40 line-through">₹{products.product?.mrpPrice}</span>
                        <span className="text-brand-gold font-semibold">{products.product?.discountPercent}% off</span>
                    </div>
                </div>
            </div>

            <section className="w-full lg:w-[70%] space-y-6">
                <div>
                    <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                        Share Your Thoughts
                    </span>
                    <h1 className="font-serif text-2xl font-semibold text-matte-black uppercase tracking-wide">
                        Write a Review & Rate Product
                    </h1>
                    <div className="h-[1px] w-16 bg-brand-gold mt-3" />
                </div>
                <div className="border border-brand-gold/15 bg-white p-6 md:p-8">
                    <ReviewForm />
                </div>
            </section>
        </div>
    )
}

export default WriteReviews