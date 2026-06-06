import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface FooterProps {
  onGoToBooking?: () => void;
  onGoToFleet?: () => void;
  onGoToContact?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onGoToBooking, onGoToFleet, onGoToContact }) => {
  return (
    <footer id="contact" className="bg-charcoal text-white/40 py-20 px-6 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1">
          <div className="mb-6">
            <Logo variant="light" />
          </div>
          <p className="text-sm leading-relaxed mb-8 max-w-xs">
            Delivering exceptional ground transport experiences across Gauteng and South Africa.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-accent-gold transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
            <a className="hover:text-accent-gold transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
            <a className="hover:text-accent-gold transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><button onClick={onGoToBooking} className="hover:text-white transition-colors">Book Now</button></li>
            <li><button onClick={onGoToFleet} className="hover:text-white transition-colors">Our Fleet</button></li>
            <li><button onClick={onGoToContact} className="hover:text-white transition-colors">Contact</button></li>
            <li><Link to="/insights" className="hover:text-white transition-colors">Travel Insights</Link></li>
          </ul>
        </div>
        
        {/* Service Areas */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Service Areas</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/chauffeur-service/sandton" className="hover:text-white transition-colors">Sandton</Link></li>
            <li><Link to="/chauffeur-service/pretoria" className="hover:text-white transition-colors">Pretoria</Link></li>
            <li><Link to="/chauffeur-service/rosebank" className="hover:text-white transition-colors">Rosebank</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Contact Info</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined !text-lg mt-0.5 text-accent-gold">location_on</span>
              <span>2107, Johannesburg, South Africa</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined !text-lg mt-0.5 text-accent-gold">call</span>
              <span>+27 83 576 5000</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined !text-lg mt-0.5 text-accent-gold">mail</span>
              <span>booking@lmtours.co.za</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 mt-8 text-center text-xs tracking-wider">
        <p>&copy; {new Date().getFullYear()} LM Tours. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
