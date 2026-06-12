import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createCoupon } from "../../../Redux Toolkit/Admin/AdminCouponSlice";

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontSize: "0.8rem",
    "& fieldset": { borderColor: "rgba(200,162,74,0.25)" },
    "&:hover fieldset": { borderColor: "#C8A24A" },
    "&.Mui-focused fieldset": { borderColor: "#C8A24A" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#C8A24A" },
};

const CouponForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminCoupon } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Coupon code is required")
        .min(3, "Code should be at least 3 characters")
        .max(20, "Code should be at most 20 characters"),
      discountPercentage: Yup.number()
        .required("Discount percentage is required")
        .min(1, "Discount should be at least 1%")
        .max(100, "Discount cannot exceed 100%"),
      validityStartDate: Yup.date()
        .nullable()
        .required("Start date is required")
        .typeError("Invalid date"),
      validityEndDate: Yup.date()
        .nullable()
        .required("End date is required")
        .typeError("Invalid date")
        .min(
          Yup.ref("validityStartDate"),
          "End date cannot be before start date"
        ),
      minimumOrderValue: Yup.number()
        .required("Minimum order value is required")
        .min(1, "Minimum order value should be at least 1"),
    }),
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        validityStartDate: values.validityStartDate
          ? values.validityStartDate.toISOString()
          : null,
        validityEndDate: values.validityEndDate
          ? values.validityEndDate.toISOString()
          : null,
      };
      dispatch(
        createCoupon({
          coupon: formattedValues,
          jwt: localStorage.getItem("jwt") || "",
        })
      );
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (adminCoupon.couponCreated) {
      setOpenSnackbar(true);
    }
  }, [adminCoupon.couponCreated]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15">
        <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
          Promotions
        </span>
        <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
          Create New Coupon
        </h1>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={formik.handleSubmit} className="bg-white border border-brand-gold/15 p-6">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                id="code"
                name="code"
                label="Coupon Code (e.g. LUXURY20)"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                id="discountPercentage"
                name="discountPercentage"
                label="Discount Percentage"
                type="number"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.discountPercentage &&
                  Boolean(formik.errors.discountPercentage)
                }
                helperText={
                  formik.touched.discountPercentage &&
                  formik.errors.discountPercentage
                }
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Validity Start Date"
                value={formik.values.validityStartDate}
                onChange={(date) => formik.setFieldValue("validityStartDate", date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: fieldSx,
                    error: formik.touched.validityStartDate && Boolean(formik.errors.validityStartDate),
                    helperText: formik.touched.validityStartDate && (formik.errors.validityStartDate as any)
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Validity End Date"
                value={formik.values.validityEndDate}
                onChange={(date) => formik.setFieldValue("validityEndDate", date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: fieldSx,
                    error: formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate),
                    helperText: formik.touched.validityEndDate && (formik.errors.validityEndDate as any)
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                id="minimumOrderValue"
                name="minimumOrderValue"
                label="Minimum Order Value (₹)"
                type="number"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.minimumOrderValue &&
                  Boolean(formik.errors.minimumOrderValue)
                }
                helperText={
                  formik.touched.minimumOrderValue &&
                  formik.errors.minimumOrderValue
                }
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <button
                type="submit"
                disabled={adminCoupon.loading}
                className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
              >
                {adminCoupon.loading ? (
                  <CircularProgress size={18} sx={{ color: "#C8A24A" }} />
                ) : (
                  "Create Coupon"
                )}
              </button>
            </Grid>
          </Grid>
        </form>
      </LocalizationProvider>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={adminCoupon.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%", borderRadius: 0 }}
        >
          {adminCoupon.error ? adminCoupon.error : "Coupon created successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CouponForm;
