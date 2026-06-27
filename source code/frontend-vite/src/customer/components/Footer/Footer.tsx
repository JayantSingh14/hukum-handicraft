
const Footer = () => {
  return (
    <footer className="mt-20 bg-[#1a1612] text-[#FAF8F2] border-t border-[#C8A24A]/20 px-6 lg:px-20 py-12 lg:py-16 font-sans">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <h5 className="font-serif text-2xl font-bold tracking-widest text-[#C8A24A] uppercase">HUKUM</h5>
            <p className="text-[10px] tracking-[0.25em] text-[#C8A24A]/60 uppercase">Artisanal Luxury</p>
            <p className="text-xs text-[#FAF8F2]/50 font-light mt-2">
              © {new Date().getFullYear()} HUKUM. All rights reserved.
            </p>
          </div>
          <div className="text-center">
            <ul className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest font-semibold">
              <li><a href="/" className="hover:text-[#C8A24A] transition-colors duration-200">Home</a></li>
              <li><a href="/products" className="hover:text-[#C8A24A] transition-colors duration-200">Shop</a></li>
              <li><a href="/wishlist" className="hover:text-[#C8A24A] transition-colors duration-200">Wishlist</a></li>
              <li><a href="/account/orders" className="hover:text-[#C8A24A] transition-colors duration-200">Orders</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer