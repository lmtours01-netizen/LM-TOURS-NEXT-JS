
import React from 'react';

interface HeroProps {
  onExplore?: () => void;
  onSeeStory?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onSeeStory }) => {
  return (
    <section id="about" className="relative h-[90vh] md:h-[95vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-charcoal">
        <div className="absolute inset-0 hero-gradient z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center scale-105" 
          style={{ backgroundImage: 'url("https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/Untitled-design-1.webp")' }}
        />
      </div>
      
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="text-accent-gold font-display font-medium tracking-[0.4em] uppercase mb-4 md:mb-6 opacity-90 text-[10px] md:text-sm">
          Curated Global Journeys
        </span>
        <h1 className="text-white text-5xl md:text-8xl font-display font-bold leading-[1.05] tracking-tight max-w-4xl mb-8">
          Your Journey,<br/>
          <span className="italic font-light">Redefined</span>
        </h1>
        <p className="text-white/80 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-12">
          Experience the pinnacle of global travel with our exclusive fleet and curated tours. Precision, privacy, and unparalleled comfort.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
          <button 
            onClick={onExplore}
            className="h-14 px-10 rounded-lg bg-white text-charcoal font-bold tracking-widest hover:bg-accent-gold hover:text-white transition-all text-xs uppercase"
          >
            Explore Fleet
          </button>
          <button 
            onClick={onSeeStory}
            className="h-14 px-10 rounded-lg border border-white/30 text-white font-bold tracking-widest backdrop-blur-sm hover:bg-white/10 transition-all text-xs uppercase"
          >
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
