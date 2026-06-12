/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircularProgress, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signin } from '../../../Redux Toolkit/Customer/AuthSlice';
import OTPInput from '../../../customer/components/OtpFild/OTPInput';

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

const AdminLoginForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState<number>(30); // Timer state
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store)

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: ''
        },
        onSubmit: (values: any) => {
            dispatch(signin({ email: values.email, otp, navigate }))
        }
    });

    const handleOtpChange = (otp: any) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: "signing_" + formik.values.email }))
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        handleResendOTP();
    }

    const handleLogin = () => {
        formik.handleSubmit()
    }

    useEffect(() => {
        let interval: any;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30; // Reset timer for next OTP request
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div className="space-y-6">
            <div className="text-center pb-2">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                    Control Panel
                </span>
                <h1 className="font-serif text-2xl font-bold text-matte-black uppercase tracking-wide">
                    Admin Access
                </h1>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <TextField
                    fullWidth
                    size="small"
                    name="email"
                    label="Admin Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email as string : undefined}
                    sx={fieldSx}
                />

                {auth.otpSent && (
                    <div className="space-y-4 pt-2">
                        <p className="font-sans text-[11px] text-brand-gold uppercase tracking-wider font-semibold">
                            * Enter Access OTP
                        </p>
                        <div className="flex justify-center">
                            <OTPInput
                                length={6}
                                onChange={handleOtpChange}
                                error={false}
                            />
                        </div>
                        <p className="text-xs space-x-2 font-sans text-charcoal/60">
                            {isTimerActive ? (
                                <span>Resend in {timer} seconds</span>
                            ) : (
                                <>
                                    Didn't receive code?{" "}
                                    <span
                                        onClick={handleResendOTP}
                                        className="text-brand-gold cursor-pointer hover:opacity-75 font-semibold"
                                    >
                                        Resend Code
                                    </span>
                                </>
                            )}
                        </p>
                        {formik.touched.otp && formik.errors.otp && (
                            <p className="text-red-500 text-xs">{formik.errors.otp as string}</p>
                        )}
                    </div>
                )}

                {auth.otpSent && (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleLogin}
                        className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Verify &amp; Enter"}
                    </button>
                )}

                {!auth.otpSent && (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleSentOtp}
                        className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Request Secure Access"}
                    </button>
                )}
            </form>
        </div>
    )
}

export default AdminLoginForm