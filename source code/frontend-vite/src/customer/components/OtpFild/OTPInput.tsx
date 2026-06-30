import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
    length: number;
    onChange: (otp: string) => void;
    error?: boolean;
}

const OTPInput = ({ length, onChange, error = false }: OTPInputProps) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        onChangeRef.current(otp.join(''));
    }, [otp]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input field if there is a next one
            if (value && index < otp.length - 1) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
        if (!pasted) return;
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, length - 1);
        document.getElementById(`otp-input-${nextIndex}`)?.focus();
    };

    return (
        <div className='flex gap-3'>
            {otp.map((item, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={item}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength={1}
                    className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none sm:text-sm h-10 w-10 flex justify-center items-center text-center focus:border-brand-gold`}
                />
            ))}
        </div>
    );
};

export default OTPInput;
