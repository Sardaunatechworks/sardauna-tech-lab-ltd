import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Box, 
  MessageSquare, 
  Users, 
  LogOut,
  Star,
  Handshake,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Case Studies', path: '/admin/case-studies', icon: FileText },
    { name: 'Products', path: '/admin/products', icon: Box },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Partners', path: '/admin/partners', icon: Handshake },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-blue text-white flex flex-col
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-brand-yellow leading-tight">Admin Panel</h2>
              <p className="text-[0.65rem] text-gray-300 font-bold tracking-wider">SARDAUNA TECH LAB</p>
            </div>
          </div>
          <button 
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-yellow text-brand-blue font-semibold shadow-md translate-x-1' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-brand-blue' : 'text-gray-400 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 sm:px-8 shrink-0">
          <button 
            className="mr-4 lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 truncate">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
