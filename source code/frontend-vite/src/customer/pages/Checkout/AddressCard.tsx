import { Radio } from '@mui/material'
import type { Address } from '../../../types/userTypes';

interface AddressCardProps {
    value: number;
    selectedValue: number;
    handleChange: (e: any) => void;
    item: Address
}

const AddressCard: React.FC<AddressCardProps> = ({ value, selectedValue, handleChange, item }) => {
    const isSelected = value === selectedValue;
    return (
        <div className={`p-5 border transition-all duration-200 flex items-start gap-4 bg-white
            ${isSelected ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/45'}`}>
            <div className="pt-1">
                <Radio
                    checked={isSelected}
                    onChange={handleChange}
                    value={value}
                    name="radio-buttons"
                    size="small"
                    sx={{
                        color: "rgba(200,162,74,0.4)",
                        "&.Mui-checked": { color: "#C8A24A" },
                        p: 0
                    }}
                />
            </div>

            <div className="space-y-2 font-sans text-sm text-charcoal">
                <h3 className="font-serif font-bold text-base text-matte-black">{item.name}</h3>
                <p className="text-charcoal/70 text-xs leading-relaxed max-w-sm">
                    {item.address}, {item.locality}, {item.city}, {item.state} — {item.pinCode}
                </p>
                <p className="text-xs">
                    <strong className="font-semibold text-matte-black">Mobile:</strong> {item.mobile}
                </p>
            </div>
        </div>
    )
}

export default AddressCard