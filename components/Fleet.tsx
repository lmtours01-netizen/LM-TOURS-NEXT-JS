
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// Simplified vehicle type for this component
interface Vehicle {
  id: string;
  name: string;
  description: string;
  hero_image_url: string;
  specs: { icon: string; label: string }[];
}

interface FleetProps {
  onSelect?: () => void;
}

const Fleet: React.FC<FleetProps> = ({ onSelect }) => {
  const [fleetData, setFleetData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, name, description, hero_image_url, specs')
          .limit(4); // Limit to a few for the homepage preview

        if (error) throw error;
        
        if (data) {
          // Sort vehicles: V-Class, C-Class, H1, Corolla
          const sortOrder = ['V-Class', 'C-Class', 'H1', 'Corolla'];
          const sortedData = data.sort((a, b) => {
            const indexA = sortOrder.findIndex(key => a.name.includes(key));
            const indexB = sortOrder.findIndex(key => b.name.includes(key));
            
            const safeIndexA = indexA === -1 ? 999 : indexA;
            const safeIndexB = indexB === -1 ? 999 : indexB;
            
            return safeIndexA - safeIndexB;
          });

          // Massage data to fit legacy component structure if needed
          const formattedData = sortedData.map((v: any, index: number) => ({
              ...v,
              specs: v.specs.map((s: any) => ({ icon: s.icon, label: s.value })).slice(0,3), 
          }));
          setFleetData(formattedData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load fleet.");
        console.error("Error fetching fleet for homepage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="fleet" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">Our Elite Fleet</h2>
        <p className="text-charcoal/50 max-w-xl mx-auto italic font-light">Standard-setting vehicles tailored for every high-stakes journey.</p>
      </div>
      
      <div className="relative group max-w-[1400px] mx-auto">
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-8 px-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {loading && <p className="text-center w-full py-10">Loading...</p>}
          {error && <p className="text-red-500 text-center w-full py-10">{error}</p>}
          {!loading && !error && fleetData.map((item, index) => (
            <div key={item.id} className="min-w-[320px] md:min-w-[450px] bg-background-light rounded-xl overflow-hidden border border-charcoal/5 snap-center group/card shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                  src={item.hero_image_url} 
                  alt={item.name.split('|')[0]} 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-display font-bold">{item.name.split('|')[0]}</h3>
                  <span className="text-primary text-sm font-bold tracking-tighter">0{index + 1}</span>
                </div>
                <p className="text-charcoal/50 text-sm mb-6 leading-relaxed h-10 overflow-hidden line-clamp-2">{item.description}</p>
                
                <div className="flex gap-4 mb-8">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-accent-gold">
                      <span className="material-symbols-outlined !text-[16px]">{spec.icon}</span>
                      <span className="text-[9px] font-bold tracking-widest uppercase">{spec.label}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={onSelect}
                  className="w-full py-4 rounded-lg border border-charcoal/10 text-charcoal font-bold text-xs tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Repositioned below content */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button 
            onClick={() => scroll('left')}
            className="size-14 rounded-full border border-charcoal/10 text-charcoal flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm"
            aria-label="Previous Vehicle"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="size-14 rounded-full border border-charcoal/10 text-charcoal flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm"
             aria-label="Next Vehicle"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
