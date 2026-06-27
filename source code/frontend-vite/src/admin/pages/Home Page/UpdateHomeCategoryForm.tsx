import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { updateHomeCategory } from "../../../Redux Toolkit/Admin/AdminSlice";
import type { HomeCategory } from "../../../types/homeDataTypes";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";

// Define validation schema using Yup
const validationSchema = Yup.object({
  image: Yup.string().required("Image is required"),
  category: Yup.string().required("Category is required"),
});


const UpdateHomeCategoryForm = ({
  category,
  handleClose,
}: {
  category: HomeCategory | undefined;
  handleClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      image: category?.image || "",
      category: category?.categoryId || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form Data:", values, category);
      if (category?.id) {
        const result = await dispatch(
          updateHomeCategory({
            id: category.id,
            data: { image: values.image, categoryId: values.category },
          })
        );
        if (updateHomeCategory.fulfilled.match(result)) {
          dispatch(fetchHomePageData());
        }
      }
      handleClose();
    },
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        formik.setFieldValue("image", url);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 500, margin: "auto", padding: 3 }}
      className="space-y-6"
    >
      <Typography variant="h4" gutterBottom>
        Update Category
      </Typography>

      {/* Premium Gallery Photo Selector */}
      <Box className="my-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="home-category-file-input"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <label htmlFor="home-category-file-input" className="cursor-pointer block">
          <Box
            sx={{
              width: "100%",
              height: 220,
              border: "1px dashed rgba(200, 162, 74, 0.4)",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FAF8F2",
              overflow: "hidden",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#C8A24A",
                backgroundColor: "rgba(200, 162, 74, 0.03)",
              }
            }}
          >
            {formik.values.image ? (
              <>
                <img
                  src={formik.values.image}
                  alt="Gallery Preview"
                  className="w-full h-full object-cover"
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(15, 15, 15, 0.6)",
                    color: "#FFFFFF",
                    py: 1,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Change Photo
                </Box>
              </>
            ) : (
              <Box className="flex flex-col items-center p-4">
                <AddPhotoAlternateIcon sx={{ color: "#C8A24A", fontSize: 40, mb: 1 }} />
                <Typography sx={{ fontSize: "0.8rem", color: "#C8A24A", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Select from Gallery
                </Typography>
                <Typography variant="caption" sx={{ color: "#777", mt: 0.5 }}>
                  Supports PNG, JPG, WEBP
                </Typography>
              </Box>
            )}
            
            {uploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <CircularProgress size={32} sx={{ color: "#C8A24A", mb: 1 }} />
                <Typography sx={{ fontSize: "0.75rem", color: "#C8A24A", letterSpacing: "0.05em", fontWeight: 600 }}>
                  UPLOADING...
                </Typography>
              </Box>
            )}
          </Box>
        </label>
        {formik.touched.image && formik.errors.image && (
          <FormHelperText error className="mt-2 text-center">
            {formik.errors.image}
          </FormHelperText>
        )}
      </Box>

      <FormControl
        fullWidth
        error={formik.touched.category && Boolean(formik.errors.category)}
        required
      >
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          label="Category"
        >
          {mainCategory.map((item) => (
            <MenuItem key={item.categoryId} value={item.categoryId}>{item.name}</MenuItem>
          ))}
        </Select>
        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
      </FormControl>

      {/* Submit Button */}
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        sx={{ py: ".9rem" }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default UpdateHomeCategoryForm;
