import { useEffect } from 'react'
import OrderItemCard from './OrderItemCard'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchUserOrderHistory } from '../../../Redux Toolkit/Customer/OrderSlice';

const Order = () => {
  const dispatch = useAppDispatch()
  const { auth, orders } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""))
  }, [auth.jwt, dispatch])

  return (
    <div className='text-sm min-h-screen space-y-6'>
      <div className='pb-5 border-b border-brand-gold/15'>
        <h1 className='font-serif text-2xl font-bold text-matte-black uppercase tracking-wide'>
          Order History
        </h1>
        <p className="font-sans text-[11px] text-charcoal/50 uppercase tracking-widest mt-1">
          Your lifelong history of Hukum artisan commissions
        </p>
      </div>
      <div className='space-y-4'>
        {orders?.orders?.map((order) =>
          order?.orderItems.map((item) => (
            <OrderItemCard key={item.id} item={item} order={order} />
          ))
        )}
        {(!orders?.orders || orders.orders.length === 0) && (
          <p className="font-sans text-xs text-charcoal/40 italic py-4">No commissions placed yet.</p>
        )}
      </div>
    </div>
  )
}

export default Order