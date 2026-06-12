import { useEffect } from 'react'
import { menLevelThree } from '../../../data/category/level three/menLevelThree'
import { menLevelTwo } from '../../../data/category/level two/menLevelTwo'
import { womenLevelThree } from '../../../data/category/level three/womenLevelThree'
import { womenLevelTwo } from '../../../data/category/level two/womenLevelTwo'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { electronicsLevelTwo } from '../../../data/category/level two/electronicsLavelTwo'
import { furnitureLevelTwo } from '../../../data/category/level two/furnitureLevleTwo'
import { furnitureLevelThree } from '../../../data/category/level three/furnitureLevelThree'
import { electronicsLevelThree } from '../../../data/category/level three/electronicsLevelThree'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { fetchOccasions } from '../../../Redux Toolkit/Customer/giftCatalogSlice'
import { formatGiftCategoryLabel } from '../../../util/giftCategoryMapper'

const categoryTwo: { [key: string]: any[] } = {
    men: menLevelTwo,
    women: womenLevelTwo,
    electronics: electronicsLevelTwo,
    home_furniture: furnitureLevelTwo,
}

const categoryThree: { [key: string]: any[] } = {
    men: menLevelThree,
    women: womenLevelThree,
    electronics: electronicsLevelThree,
    home_furniture: furnitureLevelThree,
}

// Curated static info for luxury gift categories
const giftMetaInfo: { [key: string]: { description: string; image: string } } = {
  wall_art: {
    description: "Timeless traditional tapestries and hand-carved wood art to transform your spaces.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80",
  },
  table_decor: {
    description: "Premium brass, marble, and wooden centerpieces crafted for royal table settings.",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&q=80",
  },
  lamps_lanterns: {
    description: "Illuminated elegance featuring shadow casting lanterns and warm brass lighting.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
  },
  pooja_spiritual: {
    description: "Exquisite brass idols, handcrafted bells, and sacred vessels for serene living.",
    image: "https://images.unsplash.com/photo-1608976478549-b5c00e127393?w=500&q=80",
  },
  corporate: {
    description: "Sophisticated executive gifts and leather-bound workspace essentials.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80",
  },
  personalized: {
    description: "Inscribe your initials and personal narratives onto timeless handcrafts.",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80",
  },
  luxury_hampers: {
    description: "Curated gift bundles wrapped in premium boxes and handwoven silks.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
  },
}

const CategorySheet = ({ selectedCategory, toggleDrawer, setShowSheet }: any) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { occasions } = useAppSelector((store) => store.giftCatalog)

    useEffect(() => {
        if (occasions.length === 0) dispatch(fetchOccasions())
    }, [dispatch, occasions.length])

    const childCategory = (category: any, parentCategoryId: any) => {
        return category.filter((child: any) => {
            return child.parentCategoryId === parentCategoryId
        })
    }

    const handleCategoryClick = (category: string, searchStr?: string) => {
        if (toggleDrawer) {
            toggleDrawer(false)()
        }
        if (setShowSheet) {
            setShowSheet(false)
        }
        navigate(`/products/${category}${searchStr || ""}`)
    }

    // Check if the selected category is one of our luxury gift categories
    const isGiftCategory = giftMetaInfo[selectedCategory] !== undefined

    return (
        <Box className='bg-white shadow-luxury border-t border-[#C8A24A]/10 w-full min-h-[400px] overflow-y-auto px-10 py-8 lg:px-20'>
            {isGiftCategory ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Column 1: Feature Editorial Image Card */}
                    <div className="lg:col-span-2 border-r border-[#C8A24A]/10 pr-8 flex flex-col justify-between">
                        <div className="space-y-4">
                            <span className="font-sans text-[10px] tracking-[0.3em] font-bold text-brand-gold uppercase block">
                                Featured Showcase
                            </span>
                            <h2 className="font-serif text-3xl font-bold text-matte-black capitalize">
                                {formatGiftCategoryLabel(selectedCategory)}
                            </h2>
                            <p className="text-sm font-sans text-charcoal/70 leading-relaxed max-w-sm">
                                {giftMetaInfo[selectedCategory].description}
                            </p>
                        </div>
                        <div className="mt-6 group relative overflow-hidden h-[180px] w-full border border-[#C8A24A]/25">
                            <img 
                                src={giftMetaInfo[selectedCategory].image} 
                                alt={selectedCategory} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-matte-black/25 flex items-center justify-center">
                                <span className="font-sans text-[10px] tracking-widest text-white uppercase border border-white/50 px-3 py-1 bg-matte-black/45 backdrop-blur-sm">
                                    View Editorial
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Shop By Budget */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-base font-semibold text-brand-gold uppercase tracking-wider pb-2 border-b border-[#C8A24A]/10">
                            Price Range
                        </h4>
                        <ul className="space-y-3 font-sans text-xs uppercase tracking-widest">
                            {[
                                { name: "Under ₹1,000", val: "0-1000" },
                                { name: "₹1,000 - ₹3,000", val: "1000-3000" },
                                { name: "₹3,000 - ₹5,000", val: "3000-5000" },
                                { name: "Above ₹5,000", val: "5000-100000" }
                            ].map((budget) => (
                                <li 
                                    key={budget.val}
                                    onClick={() => handleCategoryClick(selectedCategory, `?price=${budget.val}`)}
                                    className="hover:text-brand-gold cursor-pointer transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span className="h-[1px] w-2 bg-[#C8A24A]/30"></span>
                                    {budget.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Personalization & Quickshop */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-base font-semibold text-brand-gold uppercase tracking-wider pb-2 border-b border-[#C8A24A]/10">
                            Options
                        </h4>
                        <ul className="space-y-3 font-sans text-xs uppercase tracking-widest">
                            <li 
                                onClick={() => handleCategoryClick(selectedCategory, `?personalized=true`)}
                                className="hover:text-brand-gold cursor-pointer transition-colors duration-200 flex items-center gap-2 font-bold"
                            >
                                <span className="h-[1px] w-2 bg-[#C8A24A]"></span>
                                Personalized Gifts
                            </li>
                            <li 
                                onClick={() => handleCategoryClick(selectedCategory, `?personalized=false`)}
                                className="hover:text-brand-gold cursor-pointer transition-colors duration-200 flex items-center gap-2"
                            >
                                <span className="h-[1px] w-2 bg-[#C8A24A]/30"></span>
                                Standard Gifts
                            </li>
                            <li 
                                onClick={() => handleCategoryClick(selectedCategory)}
                                className="hover:text-brand-gold cursor-pointer transition-colors duration-200 flex items-center gap-2 underline underline-offset-4"
                            >
                                <span className="h-[1px] w-2 bg-[#C8A24A]/30"></span>
                                Browse All {selectedCategory}
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                /* Original Categories (men, women, electronics, etc.) Styled Luxury */
                <div className='flex text-sm flex-wrap gap-y-6'>
                    {categoryTwo[selectedCategory]?.map((item: any) => (
                        <div key={item.name} className={`p-6 lg:w-[25%] border-r border-[#C8A24A]/10 last:border-0`}>
                            <p className='text-brand-gold mb-4 font-serif text-lg font-semibold tracking-wider uppercase'>{item.name}</p>
                            <ul className='space-y-3 text-charcoal font-sans text-xs tracking-widest uppercase'>
                                {childCategory(categoryThree[selectedCategory], item.categoryId)?.map((item: any) => (
                                    <li 
                                        key={item.name}
                                        onClick={() => handleCategoryClick(item.categoryId)}
                                        className='hover:text-brand-gold cursor-pointer transition-colors duration-200 flex items-center gap-2'
                                    >
                                        <span className="h-[1px] w-2 bg-[#C8A24A]/30"></span>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </Box>
    )
}

export default CategorySheet