/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircularProgress, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup, loginWithGoogle } from '../../../Redux Toolkit/Customer/AuthSlice';
import { GoogleLogin } from '@react-oauth/google';

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

const SignupForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState<number>(30); // Timer state
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store)

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            name: ""
        },
        onSubmit: (values: any) => {
            dispatch(signup({ fullName: values.name, email: values.email, otp, navigate }))
        }
    });

    const handleOtpChange = (otp: any) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }))
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        handleResendOTP();
    }

    const handleLogin = () => {
        formik.handleSubmit()
    }

    const handleGoogleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            dispatch(loginWithGoogle({ idToken: credentialResponse.credential, navigate }));
        }
    };

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
                <h1 className="font-serif text-2xl font-bold text-matte-black uppercase tracking-wide">
                    Create Account
                </h1>
                <p className="font-sans text-[11px] text-charcoal/50 uppercase tracking-widest mt-1">
                    Sign up with your email to start your luxury journey
                </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <TextField
                    fullWidth
                    size="small"
                    name="email"
                    label="Enter Your Email"
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
                            * Enter OTP sent to your email
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
                                <span>Resend OTP in {timer} seconds</span>
                            ) : (
                                <>
                                    Didn't receive OTP?{" "}
                                    <span
                                        onClick={handleResendOTP}
                                        className="text-brand-gold cursor-pointer hover:opacity-75 font-semibold"
                                    >
                                        Resend OTP
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
                    <TextField
                        fullWidth
                        size="small"
                        name="name"
                        label="Enter Your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name as string : undefined}
                        sx={fieldSx}
                    />
                )}

                {auth.otpSent && (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleLogin}
                        className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Signup"}
                    </button>
                )}

                {!auth.otpSent && (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleSentOtp}
                        className="w-full py-3 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Send OTP"}
                    </button>
                )}

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-brand-gold/10"></div>
                    <span className="flex-shrink mx-4 text-[10px] tracking-widest text-charcoal/40 uppercase font-sans">Or</span>
                    <div className="flex-grow border-t border-brand-gold/10"></div>
                </div>

                <div className="flex justify-center w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.error("Google Sign-In Failed")}
                        theme="outline"
                        size="large"
                        width="100%"
                        logo_alignment="center"
                    />
                </div>
            </form>
        </div>
    );
};

export default SignupForm;