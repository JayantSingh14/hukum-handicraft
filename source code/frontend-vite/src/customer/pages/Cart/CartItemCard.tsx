import { Divider, IconButton } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { CartItem } from '../../../types/cartTypes';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { deleteCartItem, updateCartItem } from '../../../Redux Toolkit/Customer/CartSlice';
import { STORE_NAME } from '../../../util/storeConfig';

interface CartItemProps {
    item: CartItem
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
    const dispatch = useAppDispatch();

    const handleUpdateQuantity = (value: number) => {
        dispatch(updateCartItem({
            jwt: localStorage.getItem("jwt"),
            cartItemId: item.id,
            cartItem: { quantity: item.quantity + value }
        }))
    }

    const handleRemoveCartItem = () => {
        dispatch(deleteCartItem({
            jwt: localStorage.getItem("jwt") || "",
            cartItemId: item.id
        }))
    }

    return (
        <div className="border border-brand-gold/15 bg-white relative group hover:border-brand-gold/40 transition-all duration-200">
            <div className="p-5 flex gap-5">
                {/* Product Image */}
                <div className="shrink-0">
                    <img
                        className="w-[90px] h-[110px] object-cover"
                        src={item.product.images[0]}
                        alt={item.product.title}
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-1.5 flex-1">
                    <h2 className="font-serif font-bold text-base text-matte-black uppercase tracking-wider">
                        {STORE_NAME}
                    </h2>
                    <p className="font-sans text-sm text-charcoal/70">{item.product.title}</p>
                    {item.personalizedGift && (
                        <p className="text-xs text-brand-gold font-sans">
                            <strong className="font-semibold">Personalized:</strong>{" "}
                            {item.personalizedGift.customMessage}
                        </p>
                    )}
                    <p className="font-sans text-xs text-charcoal/50 uppercase tracking-widest">
                        Qty: {item.quantity}
                    </p>
                </div>
            </div>

            <Divider sx={{ borderColor: "rgba(200,162,74,0.12)" }} />

            {/* Quantity Controls */}
            <div className="px-5 py-3 flex justify-between items-center">
                <div className="flex items-center gap-1 border border-brand-gold/20 w-fit">
                    <IconButton
                        size="small"
                        disabled={item.quantity === 1}
                        onClick={() => handleUpdateQuantity(-1)}
                        sx={{ borderRadius: 0, color: "#0F0F0F", "&:hover": { bgcolor: "#f5f0e8" } }}
                    >
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                    <span className="px-4 font-sans text-sm font-semibold text-matte-black min-w-[2rem] text-center">
                        {item.quantity}
                    </span>
                    <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(1)}
                        sx={{ borderRadius: 0, color: "#0F0F0F", "&:hover": { bgcolor: "#f5f0e8" } }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </div>
                <p className="font-sans font-semibold text-sm text-matte-black">₹{item.sellingPrice}</p>
            </div>

            {/* Remove Button */}
            <div className="absolute top-2 right-2">
                <IconButton
                    onClick={handleRemoveCartItem}
                    size="small"
                    sx={{
                        color: "#888",
                        "&:hover": { color: "#ef4444", bgcolor: "transparent" },
                        transition: "color 0.2s"
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
        </div>
    )
}

export default CartItemCard