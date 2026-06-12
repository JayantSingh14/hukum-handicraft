import AddCardIcon from '@mui/icons-material/AddCard';

const SavedCards = () => {
  return (
    <div className='flex flex-col justify-center items-center lg:min-h-[60vh] gap-6 p-6'>
        <div>
            <AddCardIcon sx={{ color: '#C8A24A', fontSize: "120px" }} />
        </div>

        <div className='text-center w-full lg:w-[68%] space-y-3'>
            <h1 className='font-serif text-lg font-bold text-matte-black uppercase tracking-wider'>
                Save Your Cards During Checkout
            </h1>
            <p className='font-sans text-xs text-charcoal/70 leading-relaxed'>
                Save credit or debit cards during your next commission payment. Your financial details are secured using bank-grade 128-bit encryption standards.
            </p>
        </div>
    </div>
  )
}

export default SavedCards