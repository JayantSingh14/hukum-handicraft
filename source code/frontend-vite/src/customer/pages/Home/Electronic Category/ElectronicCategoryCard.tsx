import { useNavigate } from 'react-router-dom'


const ElectronicCategoryCard = ({item}:any) => {
  const navigate=useNavigate();

  return (
    <div 
      onClick={()=>navigate(`/products/${item.categoryId}`)} 
      className='flex flex-col items-center gap-2 cursor-pointer group px-3 py-1 transition-all duration-300'
    >
      <div className="w-14 h-14 rounded-full bg-white border border-[#C8A24A]/10 flex items-center justify-center p-2.5 group-hover:border-[#C8A24A] transition-colors duration-300 shadow-sm">
        <img className='object-contain h-full w-full group-hover:scale-110 transition-transform duration-300' src={item.image} alt={item.name} />
      </div>
      <h2 className='font-sans text-[10px] tracking-wider uppercase font-semibold text-charcoal group-hover:text-brand-gold transition-colors duration-300 text-center'>{item.name}</h2>
    </div>
  )
}

export default ElectronicCategoryCard