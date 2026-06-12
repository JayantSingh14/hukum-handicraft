import { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import { Alert, Snackbar } from '@mui/material';
import SignupForm from './SignupForm';
import { useAppSelector } from '../../../Redux Toolkit/Store';

const Auth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const handleCloseSnackbar = () => setSnackbarOpen(false)
    const { auth } = useAppSelector(store => store)
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (auth.otpSent || auth.error) {
            setSnackbarOpen(true);
        }
    }, [auth.otpSent, auth.error])

    return (
        <div className='flex justify-center min-h-[90vh] items-center bg-[#FAF8F2] px-4 py-12'>
            <div className='w-full max-w-md bg-white border border-brand-gold/15 p-8 md:p-10 space-y-6'>
                <div>
                    {isLoginPage ? <LoginForm /> : <SignupForm />}

                    <div className='flex flex-col items-center gap-2 justify-center mt-6 pt-4 border-t border-brand-gold/10'>
                        <p className="font-sans text-[11px] text-charcoal/60 uppercase tracking-wider">
                            {isLoginPage ? "New to HUKUM?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={() => setIsLoginPage(!isLoginPage)}
                            className="font-sans text-xs text-brand-gold hover:opacity-75 uppercase tracking-widest font-bold transition-opacity"
                        >
                            {isLoginPage ? "Create an Account" : "Access your account"}
                        </button>
                    </div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen} autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={auth.error ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 0 }}
                >
                    {auth.error ? auth.error : "Verification OTP sent to your email!"}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Auth;