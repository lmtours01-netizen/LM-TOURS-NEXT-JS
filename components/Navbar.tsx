
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface NavbarProps {
  currentView?: string;
  onBookNow: () => void;
  onGoToFleet: () => void;
  onGoToHome: () => void;
  onGoToAbout: () => void;
  onGoToServices: () => void;
  onGoToContact: () => void;
  onGoToInsights: () => void;
  onGoToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView,
  onBookNow, 
  onGoToFleet, 
  onGoToHome, 
  onGoToAbout, 
  onGoToServices, 
  onGoToContact, 
  onGoToInsights,
  onGoToSection 
}) => {
  const navLinks = [
    { label: 'Home', viewId: 'home', path: '/', action: onGoToHome, icon: 'home' },
    { label: 'About Us', viewId: 'about', path: '/about', action: onGoToAbout, icon: 'info' },
    { label: 'Services', viewId: 'services', path: '/services', action: onGoToServices, icon: 'explore' },
    { label: 'Fleet', viewId: 'fleet', path: '/fleet', action: onGoToFleet, icon: 'directions_car' },
    { label: 'Insights', viewId: 'insights', path: '/insights', action: onGoToInsights, icon: 'article' },
    { label: 'Contact', viewId: 'contact', path: '/contact', action: onGoToContact, icon: 'mail' },
  ];

  return (
    <>
      {/* Top Navbar: Shared for Desktop and Mobile (CTA Focus) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[1200px]">
        <header className="glass-nav border border-white/20 rounded-xl px-4 md:px-8 py-4 flex items-center justify-between shadow-lg">
          {/* Brand Logo */}
          <Link to="/" onClick={(e) => { e.preventDefault(); onGoToHome(); }} className="flex items-center gap-3 group shrink-0">
            <Logo variant="dark" />
          </Link>
          
          {/* Desktop Only Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.path}
                onClick={(e) => { e.preventDefault(); link.action(); }} 
                className={`transition-colors text-[10px] lg:text-xs font-bold tracking-widest uppercase ${
                  currentView === link.viewId ? 'text-primary' : 'text-charcoal/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Area (Logo, Book Now, WhatsApp) */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/booking"
              onClick={(e) => { e.preventDefault(); onBookNow(); }}
              className="flex items-center justify-center rounded-lg h-10 md:h-11 px-4 md:px-8 bg-primary text-white text-[10px] md:text-xs font-bold tracking-[0.2em] hover:bg-charcoal transition-all active:scale-95 shadow-md shadow-primary/20 uppercase"
            >
              Book Now
            </Link>
            
            <a 
              href="https://wa.me/27835765000"
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 md:size-10 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center transition-all shadow-md border border-charcoal/5 active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </header>
      </nav>

      {/* Mobile Bottom Navigation Bar (Hidden on md screens and up) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-charcoal/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,12px)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => {
            const isActive = currentView === link.viewId;
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={(e) => { e.preventDefault(); link.action(); }}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-300 active:scale-90 ${
                  isActive ? 'text-primary' : 'text-charcoal/40'
                }`}
              >
                <span className={`material-symbols-outlined !text-[24px] ${isActive ? 'fill-1' : ''}`}>
                  {link.icon}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                  {link.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
