import { useEffect, useRef, useState } from 'react'
import LoginForm from './LoginForm'
import { Alert, Snackbar } from '@mui/material';
import SignupForm from './SignupForm';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { resetOtpState } from '../../../Redux Toolkit/Customer/AuthSlice';

const Auth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const { auth } = useAppSelector(store => store);
    const dispatch = useAppDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
    const isFirstRender = useRef(true);

    // Reset OTP state on first mount so stale state doesn't show OTP fields
    useEffect(() => {
        dispatch(resetOtpState());
    }, []);

    // Reset OTP state when switching between login/signup tabs
    const handleTabSwitch = () => {
        dispatch(resetOtpState());
        setIsLoginPage(prev => !prev);
    };

    // Show Snackbar whenever auth state changes (skip on first render to avoid stale state)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (auth.otpSent && !auth.error) {
            setSnackbarMsg('OTP sent! Please check your email inbox.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else if (auth.error) {
            setSnackbarMsg(auth.error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [auth.otpSent, auth.error]);

    const handleCloseSnackbar = () => setSnackbarOpen(false);

    const handleGoogleError = (msg?: string) => {
        setSnackbarMsg(msg || 'Google Sign-In failed. Please try again or use OTP login.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    return (
        <div className='flex justify-center min-h-[90vh] items-center bg-[#FAF8F2] px-4 py-12'>
            <div className='w-full max-w-md bg-white border border-brand-gold/15 p-8 md:p-10 space-y-6'>
                <div>
                    {isLoginPage
                        ? <LoginForm onGoogleError={handleGoogleError} />
                        : <SignupForm onGoogleError={handleGoogleError} />
                    }

                    <div className='flex flex-col items-center gap-2 justify-center mt-6 pt-4 border-t border-brand-gold/10'>
                        <p className="font-sans text-[11px] text-charcoal/60 uppercase tracking-wider">
                            {isLoginPage ? "New to HUKUM?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={handleTabSwitch}
                            className="font-sans text-xs text-brand-gold hover:opacity-75 uppercase tracking-widest font-bold transition-opacity"
                        >
                            {isLoginPage ? "Create an Account" : "Access your account"}
                        </button>
                    </div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 0 }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Auth;