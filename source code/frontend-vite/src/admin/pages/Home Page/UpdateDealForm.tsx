import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { fetchHomeCategories } from "../../../Redux Toolkit/Admin/AdminSlice";
import { updateDeal } from "../../../Redux Toolkit/Admin/DealSlice";

const validationSchema = Yup.object({
  discount: Yup.number()
    .required("Discount is required")
    .min(0, "Discount must be a positive number")
    .max(100, "Discount cannot exceed 100"),
});

const initialValues = {
  discount: 0,
  category: "",
};

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

const UpdateDealForm = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateDeal({
          id,
          deal: {
            discount: values.discount,
            category: { id: Number(values.category) },
          }
        })
      );
    },
  });

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div className="text-center pb-2">
        <h2 className="font-serif text-xl font-bold text-matte-black uppercase tracking-wide">
          Update Campaign
        </h2>
        <p className="font-sans text-[11px] text-charcoal/50 uppercase tracking-widest mt-1">
          Adjust the discount percentage
        </p>
      </div>

      <TextField
        fullWidth
        size="small"
        id="discount"
        name="discount"
        label="Discount Percentage"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
        sx={fieldSx}
      />

      <button
        type="submit"
        className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
      >
        Save Changes
      </button>
    </form>
  );
};

export default UpdateDealForm;
