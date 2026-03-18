import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, FlaskConical, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Partners', path: '/partners' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
                  <img src="/src/assets/logo.png" alt="Sardauna Tech Lab Logo" className="h-10 w-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-2xl text-brand-blue leading-none tracking-tight">SARDAUNA</span>
                  <span className="font-sans font-bold text-[0.65rem] text-brand-blue tracking-[0.2em] mt-0.5">TECH LAB <span className="text-brand-yellow">LTD</span></span>
                </div>
              </Link>
            </motion.div>
            
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-blue/5 text-brand-blue'
                          : 'text-gray-600 hover:text-brand-blue hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div 
                className="pl-4 ml-2 border-l border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/contact"
                  className="bg-brand-blue text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300 shadow-sm hover:shadow-md inline-flex items-center gap-2"
                >
                  Start a Project
                </Link>
              </motion.div>
            </nav>

            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                          isActive
                            ? 'bg-brand-blue/5 text-brand-blue'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-blue'
                        }`}
                      >
                        {link.name}
                        {isActive && <ChevronRight className="h-4 w-4 text-brand-blue" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div 
                  className="pt-6 pb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/contact"
                    className="flex items-center justify-center w-full bg-brand-blue text-white px-6 py-3.5 rounded-xl text-base font-bold hover:bg-brand-yellow hover:text-brand-blue transition-colors shadow-sm"
                  >
                    Start a Project
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-brand-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded-xl">
                <img src="/src/assets/logo.png" alt="Sardauna Tech Lab Logo" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl leading-none">SARDAUNA</span>
                <span className="font-sans font-bold text-[0.65rem] tracking-[0.2em] mt-0.5 text-gray-300">TECH LAB <span className="text-brand-yellow">LTD</span></span>
              </div>
            </div>
            <p className="text-gray-300 max-w-sm mb-8 leading-relaxed">
              Building Digital Infrastructure for African Businesses. We design and deliver practical, scalable digital solutions that solve real business problems.
            </p>
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-gray-400 hover:text-brand-yellow transition-colors font-medium">Services</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-brand-yellow transition-colors font-medium">Case Studies</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-brand-yellow transition-colors font-medium">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-brand-yellow transition-colors font-medium">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl mb-6 text-white">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow mt-1">•</span>
                <span>+2347019672820<br/>+2349060276333</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow mt-1">•</span>
                <span>Dutse, Jigawa State</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow mt-1">•</span>
                <a href="mailto:sardaunatechlabs@gmail.com" className="hover:text-brand-yellow transition-colors">sardaunatechlabs@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Sardauna Tech Lab Ltd. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
