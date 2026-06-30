/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircularProgress, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendLoginSignupOtp, signup, loginWithGoogle, setAuthError } from '../../../Redux Toolkit/Customer/AuthSlice';
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

interface SignupFormProps {
    onGoogleError?: (msg?: string) => void;
}

const SignupForm = ({ onGoogleError }: SignupFormProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    const formik = useFormik({
        initialValues: { email: '', name: '' },
        onSubmit: (values: any) => {
            if (!otp || otp.length < 6) {
                dispatch(setAuthError('Please enter the 6-digit OTP sent to your email.'));
                return;
            }
            if (!values.name.trim()) {
                dispatch(setAuthError('Please enter your full name.'));
                return;
            }
            const from = location.state?.from || "/";
            dispatch(signup({ fullName: values.name, email: values.email, otp, navigate, from }));
        }
    });

    const handleOtpChange = (val: any) => setOtp(val);

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        if (!formik.values.email) {
            dispatch(setAuthError('Please enter your email address.'));
            return;
        }
        handleResendOTP();
    };

    const handleSignup = () => formik.handleSubmit();

    const handleGoogleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            const from = location.state?.from || "/";
            dispatch(loginWithGoogle({ idToken: credentialResponse.credential, navigate, from }));
        }
    };

    const handleGoogleError = () => {
        const msg = 'Google Sign-In failed. Make sure pop-ups are allowed and try again.';
        if (onGoogleError) onGoogleError(msg);
    };

    useEffect(() => {
        let interval: any;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (interval) clearInterval(interval); };
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
                    disabled={auth.otpSent}
                />

                {auth.otpSent && (
                    <div className="space-y-4 pt-2">
                        <p className="font-sans text-[11px] text-brand-gold uppercase tracking-wider font-semibold">
                            ✦ OTP sent to {formik.values.email}
                        </p>
                        <div className="flex justify-center">
                            <OTPInput length={6} onChange={handleOtpChange} error={false} />
                        </div>
                        <p className="text-xs space-x-2 font-sans text-charcoal/60">
                            {isTimerActive ? (
                                <span>Resend OTP in {timer}s</span>
                            ) : (
                                <>
                                    Didn&apos;t receive OTP?{" "}
                                    <span
                                        onClick={handleResendOTP}
                                        className="text-brand-gold cursor-pointer hover:opacity-75 font-semibold"
                                    >
                                        Resend OTP
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                )}

                {auth.otpSent && (
                    <TextField
                        fullWidth
                        size="small"
                        name="name"
                        label="Enter Your Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name as string : undefined}
                        sx={fieldSx}
                    />
                )}

                {auth.otpSent ? (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleSignup}
                        className="w-full py-3 border border-brand-gold text-brand-gold bg-transparent font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 disabled:opacity-50"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Create Account"}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={auth.loading}
                        onClick={handleSentOtp}
                        className="w-full py-3 border border-brand-gold text-brand-gold bg-transparent font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 disabled:opacity-50"
                    >
                        {auth.loading ? <CircularProgress size={18} sx={{ color: '#C8A24A' }} /> : "Send OTP"}
                    </button>
                )}

                {auth.error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 font-sans">
                        {auth.error}
                    </p>
                )}

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-brand-gold/10"></div>
                    <span className="flex-shrink mx-4 text-[10px] tracking-widest text-charcoal/40 uppercase font-sans">Or</span>
                    <div className="flex-grow border-t border-brand-gold/10"></div>
                </div>

                <div className="flex justify-center w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
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
