import { Avatar, IconButton, Rating } from "@mui/material";
import { red } from "@mui/material/colors";
import type { Review } from "../../../types/reviewTypes";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { deleteReview } from "../../../Redux Toolkit/Customer/ReviewSlice";

interface ProductReviewCardProps {
  item: Review;
}

const ProductReviewCard = ({ item }: ProductReviewCardProps) => {
  const { user } = useAppSelector(store => store);
  const dispatch = useAppDispatch()
  const handleDeleteReview = () => {
    dispatch(deleteReview({ reviewId: item.id, jwt: localStorage.getItem("jwt") || "" }))
  };
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex gap-4 flex-1">
        <Avatar
          sx={{ width: 48, height: 48, bgcolor: "#0F0F0F", border: "1px solid rgba(200,162,74,0.3)", fontSize: "1rem", fontFamily: "Cormorant Garamond, serif", fontWeight: 600 }}
          alt={item.user.fullName}
          src=""
        >
          {item.user.fullName[0].toUpperCase()}
        </Avatar>
        <div className="space-y-2 flex-1">
          <div>
            <p className="font-serif font-semibold text-base text-matte-black">{item.user.fullName}</p>
            <p className="font-sans text-xs text-charcoal/50 tracking-wider">{item.createdAt}</p>
          </div>
          <Rating
            readOnly
            value={item.rating}
            name="half-rating"
            defaultValue={2.5}
            precision={0.5}
            sx={{ "& .MuiRating-iconFilled": { color: "#C8A24A" }, fontSize: "1rem" }}
          />
          <p className="font-sans text-sm text-charcoal/80 leading-relaxed">{item.reviewText}</p>
          <div className="flex gap-2 flex-wrap">
            {item.productImages.map((image) => <img key={image} className="w-20 h-20 object-cover border border-[#C8A24A]/10" src={image} alt="" />)}
          </div>
        </div>
      </div>
      {item.user.id === user.user?.id && (
        <IconButton onClick={handleDeleteReview} size="small" sx={{ color: red[600], opacity: 0.7, "&:hover": { opacity: 1 } }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default ProductReviewCard;
