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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { giftCategories } from "../../../data/giftCategories";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createAdminProduct } from "../../../Redux Toolkit/Admin/adminProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { fetchOccasions } from "../../../Redux Toolkit/Customer/giftCatalogSlice";
import type { GiftCategory } from "../../../types/productTypes";

const ProductForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { adminProduct, giftCatalog } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchOccasions());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      images: [] as string[],
      giftCategory: "" as GiftCategory | "",
      occasionId: "",
      personalized: false,
      quantity: 50,
    },
    onSubmit: (values) => {
      dispatch(
        createAdminProduct({
          request: {
            ...values,
            mrpPrice: Number(values.mrpPrice),
            sellingPrice: Number(values.sellingPrice),
            quantity: Number(values.quantity) || 50,
            occasionId: values.occasionId ? Number(values.occasionId) : null,
          },
        })
      );
    },
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  useEffect(() => {
    if (adminProduct.productCreated || adminProduct.error) {
      setOpenSnackbar(true);
    }
  }, [adminProduct.productCreated, adminProduct.error]);

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
                <div className="relative" key={index}>
                  <img className="w-24 h-24 object-cover" src={image} alt={`Gift ${index + 1}`} />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth name="title" label="Gift Title" value={formik.values.title} onChange={formik.handleChange} required />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth name="mrpPrice" label="MRP Price" type="number" value={formik.values.mrpPrice} onChange={formik.handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth name="sellingPrice" label="Selling Price" type="number" value={formik.values.sellingPrice} onChange={formik.handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth name="quantity" label="Stock Quantity" type="number" value={formik.values.quantity} onChange={formik.handleChange} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Gift Category</InputLabel>
              <Select name="giftCategory" value={formik.values.giftCategory} label="Gift Category" onChange={formik.handleChange}>
                {giftCategories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select name="occasionId" value={formik.values.occasionId} label="Occasion" onChange={formik.handleChange}>
                <MenuItem value="">None</MenuItem>
                {giftCatalog.occasions.map((o) => (
                  <MenuItem key={o.id} value={String(o.id)}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="personalized"
                  checked={formik.values.personalized}
                  onChange={formik.handleChange}
                />
              }
              label="Supports personalization (photo + message)"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button sx={{ p: "14px" }} color="primary" variant="contained" fullWidth type="submit" disabled={adminProduct.loading}>
              {adminProduct.loading ? <CircularProgress size="small" /> : "Add Gift Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={adminProduct.error ? "error" : "success"} variant="filled">
          {adminProduct.error ? adminProduct.error : "Gift product created successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductForm;
