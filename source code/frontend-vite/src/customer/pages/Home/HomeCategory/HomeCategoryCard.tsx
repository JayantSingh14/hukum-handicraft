import "./HomeCategoryCard.css"
import { useNavigate } from 'react-router-dom'
import { giftCategories } from "../../../../data/giftCategories"

const HomeCategoryCard = ({item}:any) => {
  const navigate = useNavigate();
  const giftCat = giftCategories.find(c => c.categoryId === item.categoryId);
  const subtitle = giftCat ? giftCat.subtitle : "";

  return (
    <div 
      onClick={() => navigate(`/products/${item.categoryId}`)} 
      className='relative w-[260px] h-[360px] lg:w-[300px] lg:h-[400px] group cursor-pointer overflow-hidden border border-[#C8A24A]/20 shadow-lg'
    >
      {/* Image Background */}
      <img 
        className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' 
        src={item.image} 
        alt={item.name} 
      />
      {/* Premium Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent transition-opacity duration-300 group-hover:via-[#0F0F0F]/40' />
      
      {/* Content */}
      <div className='absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-2 z-10'>
        {subtitle && (
          <span className='font-sans text-[9px] lg:text-[10px] tracking-[0.25em] font-bold text-brand-gold uppercase block transition-all duration-300 group-hover:tracking-[0.3em]'>
            {subtitle}
          </span>
        )}
        <h3 className='font-serif text-lg lg:text-xl font-medium tracking-wide text-[#FAF8F2] group-hover:text-brand-gold transition-colors duration-300'>
          {item.name}
        </h3>
        <div className='h-[1px] w-0 bg-brand-gold transition-all duration-500 group-hover:w-16 mt-2' />
      </div>

      {/* Border Hover Effect */}
      <div className='absolute inset-4 border border-[#C8A24A]/0 transition-all duration-500 group-hover:border-[#C8A24A]/30 pointer-events-none' />
    </div>
  )
}

export default HomeCategoryCard