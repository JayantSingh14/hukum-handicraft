import React from 'react'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderItem } from '../../../types/orderTypes';
import { formatDate } from '../../util/fomateDate';
import { STORE_NAME } from '../../../util/storeConfig';

interface OrderItemCardProps {
    item: OrderItem,
    order: Order
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, order }) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)} className='text-sm bg-white p-5 space-y-4 border border-brand-gold/15 rounded-none cursor-pointer hover:border-brand-gold/40 transition-all duration-200'>

            <div className='flex items-center gap-3'>
                <div>
                    <Avatar sizes='small' sx={{ bgcolor: '#C8A24A', borderRadius: 0 }}>
                        <ElectricBoltIcon sx={{ color: '#0F0F0F' }} />
                    </Avatar>
                </div>
                <div>
                    <h1 className='font-bold text-brand-gold tracking-widest uppercase text-xs'>{order.orderStatus}</h1>
                    <p className="font-sans text-[11px] text-charcoal/50 mt-0.5">Arriving by {formatDate(order.deliverDate)}</p>
                </div>
            </div>
            <div className='p-4 bg-brand-gold/5 border border-brand-gold/10 flex gap-4'>
                <div className='shrink-0'>
                    <img className='w-[70px] h-[90px] object-cover border border-brand-gold/10'
                     src={item.product?.images?.[0] || item.uploadedImage} alt="" />
                </div>
                <div className='w-full space-y-1.5'>
                    <h1 className='font-sans font-bold text-xs uppercase tracking-wider text-matte-black'>{STORE_NAME}</h1>
                    <p className="font-serif text-sm font-semibold text-charcoal">
                        {item.product?.title || item.productTitle}
                    </p>
                    {item.customMessage && (
                      <p className="font-sans text-xs text-brand-gold font-medium"><strong>Message:</strong> {item.customMessage}</p>
                    )}
                </div>
            </div>

        </div>
    )
}

export default OrderItemCard