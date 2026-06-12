import { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
    CircularProgress,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
// import { mainCategory } from "../../../data/category/mainCategory";
import { giftCategories } from "../../../data/giftCategories";
import type { GiftCategory } from "../../../types/productTypes";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateAdminProduct } from "../../../Redux Toolkit/Admin/adminProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
interface FormValues {
    title: string;
    description: string;
    mrpPrice: number;
    sellingPrice: number;
    quantity: number;
    giftCategory: GiftCategory | "";
    images: string[];
    createdAt: any;
    numRatings: number;
    in_stock: boolean;
    personalized: boolean;
}
const UpdateProductForm = () => {
    const [uploadImage, setUploadingImage] = useState(false);
    const dispatch = useAppDispatch();
    const { adminProduct, products } = useAppSelector(store => store);
    const { productId } = useParams();

    const [snackbarOpen, setOpenSnackbar] = useState(false);

    const formik = useFormik<FormValues>({
        initialValues:
        {
            title: "",
            description: "",
            mrpPrice: 0,
            sellingPrice: 0,
            quantity: 0,
            giftCategory: "",
            images: [],
            createdAt: null,
            numRatings: 0,
            in_stock: true,
            personalized: false,
        },
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(updateAdminProduct({ productId:Number(productId),product:values}))
            console.log(values);
        },
    });

    const handleImageChange = async (event: any) => {
        const file = event.target.files[0];
        setUploadingImage(true);
        const image = await uploadToCloudinary(file);
        // const image = URL.createObjectURL(file);
        formik.setFieldValue("images", [...formik.values.images, image]);
        setUploadingImage(false);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...formik.values.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("images", updatedImages);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }
    useEffect(() => {
        dispatch(fetchProductById(Number(productId)));
    }, [productId])

    useEffect(() => {
        if (adminProduct.productCreated || adminProduct.error) {
            setOpenSnackbar(true)
        }
    }, [adminProduct.productCreated, adminProduct.error])

    useEffect(() => {
        formik.setValues({

            title: products.product?.title || "",
            description: products.product?.description || "",
            mrpPrice: products.product?.mrpPrice || 0,
            sellingPrice: products.product?.sellingPrice || 0,
            quantity: products.product?.quantity || 0,
            giftCategory: products.product?.giftCategory || "",
            images: products.product?.images || [],
            createdAt: products.product?.createdAt || "",
            numRatings: products.product?.numRatings || 0,
            in_stock: products.product?.in_stock || true,
            personalized: products.product?.personalized || false,

        })
    }, [products.product])

    return (
        <div>
            <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} className="flex flex-wrap gap-5">
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />

                        <label className="relative" htmlFor="fileInput">
                            <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                                <AddPhotoAlternateIcon className="text-gray-700" />
                            </span>
                            {uploadImage && (
                                <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                                    <CircularProgress />
                                </div>
                            )}
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {formik.values.images.map((image, index) => (
                                <div className="relative">
                                    <img
                                        className="w-24 h-24 object-cover"
                                        key={index}
                                        src={image}
                                        alt={`ProductImage ${index + 1}`}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        className=""
                                        size="small"
                                        color="error"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            outline: "none",
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: "1rem" }} />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            multiline
                            rows={4}
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.description && Boolean(formik.errors.description)
                            }
                            helperText={formik.touched.description && formik.errors.description}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <TextField
                            fullWidth
                            id="mrp_price"
                            name="mrpPrice"
                            label="MRP Price"
                            type="number"
                            value={formik.values.mrpPrice}
                            onChange={formik.handleChange}
                            error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                            helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <TextField
                            fullWidth
                            id="sellingPrice"
                            name="sellingPrice"
                            label="Selling Price"
                            type="number"
                            value={formik.values.sellingPrice}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.sellingPrice &&
                                Boolean(formik.errors.sellingPrice)
                            }
                            helperText={
                                formik.touched.sellingPrice && formik.errors.sellingPrice
                            }
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Gift Category</InputLabel>
                            <Select name="giftCategory" value={formik.values.giftCategory} label="Gift Category" onChange={formik.handleChange}>
                                {giftCategories.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                  
               
                    <Grid size={{ xs: 12 }}>
                        <Button
                            sx={{ p: "14px" }}
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                            disabled={adminProduct.loading}
                        >
                            {adminProduct.loading ? <CircularProgress size="small"
                                sx={{ width: "27px", height: "27px" }} /> : "Update Product"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen} autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={adminProduct.error ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {adminProduct.error ? adminProduct.error : "Product updated successfully"}
                </Alert>
            </Snackbar>
        </div>

    );
};

export default UpdateProductForm;
