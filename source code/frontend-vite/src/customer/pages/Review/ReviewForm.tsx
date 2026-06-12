import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Rating,
    InputLabel,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from '../../../util/uploadToCloudnary';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { createReview } from '../../../Redux Toolkit/Customer/ReviewSlice';
import { useNavigate, useParams } from 'react-router-dom';

interface CreateReviewRequest {
    reviewText: string;
    reviewRating: number;
    productImages: string[];
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontSize: "0.875rem",
    "& fieldset": { borderColor: "rgba(200,162,74,0.25)" },
    "&:hover fieldset": { borderColor: "#C8A24A" },
    "&.Mui-focused fieldset": { borderColor: "#C8A24A", borderWidth: "1px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#C8A24A" },
};

const ReviewForm: React.FC = () => {
    const [uploadImage, setUploadingImage] = useState(false);
    const dispatch = useAppDispatch()
    const { productId } = useParams();
    const navigate = useNavigate();

    const formik = useFormik<CreateReviewRequest>({
        initialValues: {
            reviewText: '',
            reviewRating: 0,
            productImages: [],
        },
        validationSchema: Yup.object({
            reviewText: Yup.string()
                .required('Review text is required')
                .min(10, 'Review must be at least 10 characters long'),
            reviewRating: Yup.number()
                .required('Rating is required')
                .min(0.5, 'Rating must be at least 0.5')
                .max(5, 'Rating cannot be more than 5'),
        }),
        onSubmit: (values) => {
            if (productId) {
                dispatch(createReview({
                    productId: Number(productId),
                    review: values,
                    jwt: localStorage.getItem("jwt") || "",
                    navigate
                }))
                console.log('Form Submitted:', values);
            }
        },
    });

    const handleImageChange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const image = await uploadToCloudinary(file);
            formik.setFieldValue("productImages", [...formik.values.productImages, image]);
        } catch (err) {
            console.error("Image upload failed", err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...formik.values.productImages];
        updatedImages.splice(index, 1);
        formik.setFieldValue("productImages", updatedImages);
    };

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
            <TextField
                fullWidth
                id="reviewText"
                name="reviewText"
                label="Your Review"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.reviewText}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
                helperText={formik.touched.reviewText && formik.errors.reviewText}
                sx={fieldSx}
            />

            <div className="space-y-1.5">
                <InputLabel sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(26,26,26,0.6)" }}>
                    Rating
                </InputLabel>
                <Rating
                    id="reviewRating"
                    name="reviewRating"
                    value={formik.values.reviewRating}
                    onChange={(_, newValue) =>
                        formik.setFieldValue('reviewRating', newValue)
                    }
                    onBlur={formik.handleBlur}
                    precision={0.5}
                    sx={{ "& .MuiRating-iconFilled": { color: "#C8A24A" } }}
                />
                {formik.touched.reviewRating && formik.errors.reviewRating && (
                    <p className="text-xs text-red-500 font-sans">{formik.errors.reviewRating}</p>
                )}
            </div>

            <div className="space-y-2">
                <InputLabel sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(26,26,26,0.6)" }}>
                    Add Photos
                </InputLabel>
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />

                    <label className="relative" htmlFor="fileInput">
                        <span className="w-20 h-20 cursor-pointer flex flex-col items-center justify-center border border-brand-gold/25 hover:border-brand-gold transition-colors bg-white">
                            <AddPhotoAlternateIcon sx={{ color: "#C8A24A", fontSize: "20px" }} />
                        </span>
                        {uploadImage && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white/70">
                                <CircularProgress size={20} sx={{ color: "#C8A24A" }} />
                            </div>
                        )}
                    </label>

                    <div className="flex flex-wrap gap-2">
                        {formik.values.productImages.map((image, index) => (
                            <div key={index} className="relative w-20 h-20 border border-brand-gold/15 bg-white">
                                <img
                                    className="w-full h-full object-cover"
                                    src={image}
                                    alt={`ProductImage ${index + 1}`}
                                />
                                <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    size="small"
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: -4,
                                        right: -4,
                                        bgcolor: "white",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        p: 0.2,
                                        "&:hover": { bgcolor: "#f5f5f5" }
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: "0.75rem" }} />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="px-8 py-3.5 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300"
            >
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;
