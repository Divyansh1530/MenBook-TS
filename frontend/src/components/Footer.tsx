import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#fdfaf3] py-10 md:pb-10 px-6 md:px-12 lg:px-24 border-t border-black/5">  
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        
        <div className="md:col-span-6 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#120f0a] rounded-lg flex items-center justify-center">
              <span className="text-[#fdfaf3] font-serif font-bold text-xl">M</span>
            </div>
            <span className="hero-heading font-serif text-xl tracking-tight text-[#1a1a1a] transform scale-y-[1.2] origin-left">
              MenBook
            </span>
          </div>
          
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-sm mb-16">
            A quiet place to find the right person to talk to — one calendar slot at a time.
          </p>
          
          <p className="text-gray-400 text-sm font-sans mt-auto">
            © {new Date().getFullYear()} MenBook Studio
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
            EXPLORE
          </h4>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/browse-mentors" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Browse mentors
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Become a mentor
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
            COMPANY
          </h4>
          <ul className="space-y-4">
            <li>
              <Link to="/about" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                About
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-black transition-colors text-[15px]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;