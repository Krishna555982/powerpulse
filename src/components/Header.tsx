import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-soft-white/95 backdrop-blur-md shadow-soft border-sky-blue/20'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="flex justify-center lg:justify-between items-center h-20 md:h-24 lg:h-28 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto relative">
        {/* Mobile/Tablet Menu Toggle (Left) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-deep-navy focus:outline-none absolute left-4 md:left-8 z-10"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center hover:opacity-90 active:scale-98 transition-transform h-full relative w-[200px] md:w-[240px] lg:w-[280px]"
        >
          <Logo className="absolute left-1/2 lg:left-0 top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-[200px] h-[180px] md:w-[240px] md:h-[220px] lg:w-[280px] lg:h-[260px] max-w-none" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`btn-signature btn-ghost relative ${
                currentView === item.id ? 'text-warm-gold' : ''
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>



      </div>

      {/* Mobile navigation panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-soft-white border-b border-sky-blue/20 overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left btn-signature btn-ghost w-full justify-start pl-4 ${
                    currentView === item.id ? 'text-warm-gold' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full btn-signature btn-primary"
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
