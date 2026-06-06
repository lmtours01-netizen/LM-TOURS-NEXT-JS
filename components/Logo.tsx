
import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light'; // 'dark' for light backgrounds (Navbar), 'light' for dark backgrounds (Footer)
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  
  // --------------------------------------------------------------------------
  // SUPABASE INTEGRATION:
  // 1. Upload your logo to your Supabase 'assets' bucket.
  // 2. Click "Get URL" on the file in Supabase.
  // 3. Set `useImage` to `true` below.
  // 4. Paste the URL into `supabaseLogoUrl`.
  // --------------------------------------------------------------------------
  
  const useImage = true; // Set to true when you have your Supabase URL
  const supabaseLogoUrl = "https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/LMT%20LOGO.webp";

  if (useImage) {
    return (
      <img 
        src={supabaseLogoUrl} 
        alt="LM Tours Logo" 
        className={`h-10 w-auto object-contain ${className}`} 
      />
    );
  }

  // Default CSS/SVG Logo Implementation
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Container */}
      <div className={`size-8 rounded-lg flex items-center justify-center text-white transition-colors duration-300 ${
        variant === 'dark' 
          ? 'bg-primary group-hover:bg-accent-gold' // Interactive hover state for Navbar
          : 'bg-primary' // Static state for Footer
      }`}>
        <span className="material-symbols-outlined !text-xl">travel_explore</span>
      </div>
      
      {/* Brand Text */}
      <h2 className={`text-xl font-display font-bold leading-tight tracking-tight ${
        variant === 'dark' ? 'text-charcoal' : 'text-white'
      }`}>
        LM TOURS
      </h2>
    </div>
  );
};

export default Logo;
