import type { Address } from '../../../types/userTypes'

const UserAddressCard = ({ item }: { item: Address }) => {
  return (
    <div className='p-5 border border-brand-gold/15 bg-white relative'>
      <div className='space-y-2 font-sans text-xs'>
        <h1 className='font-sans font-bold text-sm text-matte-black uppercase tracking-wider'>{item.name}</h1>
        <p className='text-charcoal/70 leading-relaxed max-w-[320px]'>
          {item.address}, {item.locality}, {item.city}, {item.state} — {item.pinCode}
        </p>
        <p className="text-charcoal/50">
          <strong className="font-semibold text-charcoal">Mobile:</strong> {item.mobile}
        </p>
      </div>
    </div>
  )
}

export default UserAddressCard