import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { searchProduct } from '../../../Redux Toolkit/Customer/ProductSlice';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import ProductCard from '../Products/ProductCard/ProductCard';

const SearchProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(store => store)

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }
  const handleProductSearch = () => {
    dispatch(searchProduct(searchQuery))
  }

  return (
    <div className="min-h-screen px-5 lg:px-20 bg-ivory pt-10">
      {/* Search Input Bar */}
      <div className="flex justify-center py-8">
        <div className="w-full lg:w-1/2 flex items-center border border-brand-gold/25 bg-white px-4 py-2 hover:border-brand-gold focus-within:border-brand-gold transition-all duration-200">
          <input
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleProductSearch();
                console.log("Searching for ", searchQuery);
              }
            }}
            onChange={handleSearchChange}
            value={searchQuery}
            className="w-full bg-transparent border-none outline-none font-sans text-sm text-charcoal placeholder-charcoal/45 py-1"
            type="text"
            placeholder="Search premium handicrafts..."
          />
          <button
            onClick={handleProductSearch}
            className="ml-2 px-4 py-1.5 bg-matte-black text-brand-gold font-sans text-xs tracking-wider uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-250"
          >
            Search
          </button>
        </div>
      </div>

      <section className="pt-6">
        {products.searchProduct?.length > 0 ? (
          <section className="space-y-6">
            <div className="pb-4 border-b border-brand-gold/15">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                Search Results
              </span>
              <h2 className="font-serif text-2xl font-semibold text-matte-black uppercase tracking-wide">
                Showing results for: <span className="font-sans text-lg font-light text-charcoal/60 ml-2">"{searchQuery || 'Recent Search'}"</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.searchProduct.map((item: any, index: number) => (
                <ProductCard key={item.id || index} item={item} />
              ))}
            </div>
          </section>
        ) : (
          <div className="h-[55vh] flex flex-col justify-center items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold text-matte-black tracking-wider uppercase">
              Discover Fine Crafts
            </h1>
            <p className="font-sans text-sm text-charcoal/50 max-w-xs text-center">
              Search for personalized gifts, royal home decor, and authentic traditional Indian craftsmanship.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default SearchProducts