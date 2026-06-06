
import React, { useState, useEffect } from 'react';

const targets = [
  {
    title: 'Business Executives',
    desc: 'Corporate travellers requiring punctual, discreet, and comfortable transport for meetings and airport transfers.',
    img: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-pavel-danilyuk-8425044.jpg'
  },
  {
    title: 'Diplomats & Embassies',
    desc: 'Secure and professional transport services tailored for embassy personnel and international dignitaries.',
    img: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/g20-countries-flags.jpg'
  },
  {
    title: 'Event & VIP Guests',
    desc: ' Seamless logistics for event planners, VIP guests, and families attending weddings, galas, or private functions.',
    img: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-jdgromov-4717550.jpg'
  }
];

type TargetItem = typeof targets[0];

// Reusable Card Component to ensure consistency across views
const TargetCard: React.FC<{ item: TargetItem }> = ({ item }) => (
  <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer w-full shadow-xl">
    <img 
      src={item.img} 
      alt={item.title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-90"></div>
    {/* Changed breakpoints from lg: to md: to allow hover effects on tablets as well */}
    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
      <h3 className="text-white text-2xl font-display font-bold mb-3">{item.title}</h3>
      {/* Changed breakpoints from lg: to md: */}
      <p className="text-white/70 text-sm leading-relaxed mb-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity delay-100">{item.desc}</p>
      <div className="w-8 h-1 bg-accent-gold group-hover:w-full transition-all duration-500"></div>
    </div>
  </div>
);

const WhoFor: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % targets.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + targets.length) % targets.length);
  };

  // Auto-play effect: Advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % targets.length);
    }, 3000);

    // Clear interval on unmount or when currentIndex changes (resets timer on manual interaction)
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Who We Serve</h2>
          <p className="text-charcoal/50 text-sm tracking-[0.2em] uppercase font-bold">Diverse Clientele</p>
        </div>
        
        {/* Tablet & Desktop View (Grid) - Visible on md screens (768px) and up */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {targets.map((item, idx) => (
            <TargetCard key={idx} item={item} />
          ))}
        </div>

        {/* Mobile View (Carousel) - Hidden on md screens and up */}
        <div className="md:hidden relative group/carousel">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {targets.map((item, idx) => (
                <div key={idx} className="min-w-full px-1">
                  <TargetCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-20 size-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all active:scale-95 border border-charcoal/5"
            aria-label="Previous Slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-20 size-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all active:scale-95 border border-charcoal/5"
             aria-label="Next Slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {targets.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-charcoal/20 hover:bg-charcoal/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhoFor;
