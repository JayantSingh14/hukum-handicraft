import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField } from '@mui/material';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice';
import type { Address } from '../../../types/userTypes';

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Invalid pincode')
    .required('Required'),
  address: Yup.string().required('Required'),
  locality: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
});

interface AddressFormProp {
  handleClose: () => void;
  paymentGateway: string
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

const AddressForm: React.FC<AddressFormProp> = ({ handleClose, paymentGateway }) => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      pinCode: '',
      address: '',
      locality: '',
      city: '',
      state: '',
    },
    validationSchema: ContactSchema,
    onSubmit: (values) => {
      handleCreateOrder(values as Address);
      handleClose();
    },
  });

  const handleCreateOrder = (address: Address) => {
    dispatch(createOrder({ address, jwt: localStorage.getItem('jwt') || "", paymentGateway }))
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Modal Header */}
      <div className="pb-5 border-b border-brand-gold/20 mb-6">
        <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
          New Address
        </span>
        <p className="font-serif text-xl font-semibold text-matte-black">
          Contact Details
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-4">

          {/* Full Name */}
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={fieldSx}
          />

          {/* Mobile + PinCode */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              name="mobile"
              label="Mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              name="pinCode"
              label="Pin Code"
              value={formik.values.pinCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
              helperText={formik.touched.pinCode && formik.errors.pinCode}
              sx={fieldSx}
            />
          </div>

          {/* Address */}
          <TextField
            fullWidth
            name="address"
            label="Address (House No, Building, Street)"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            sx={fieldSx}
          />

          {/* Locality */}
          <TextField
            fullWidth
            name="locality"
            label="Locality / Town"
            value={formik.values.locality}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.locality && Boolean(formik.errors.locality)}
            helperText={formik.touched.locality && formik.errors.locality}
            sx={fieldSx}
          />

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              sx={fieldSx}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-300"
          >
            Save Address
          </button>
        </div>
      </form>
    </Box>
  );
};

export default AddressForm;
