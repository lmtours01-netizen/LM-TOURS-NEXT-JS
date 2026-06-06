
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

interface FleetPageProps {
  onBook: (vehicleId: string) => void;
}

// Define the type for a single vehicle, matching your database structure
interface Vehicle {
  id: string;
  name: string;
  label: string;
  tagline: string;
  hero_image_url: string;
  silhouette_image_url: string;
  specs: { icon: string; title: string; value: string }[];
  details: {
    features: string[];
    idealFor: string[];
  };
}

const FleetPage: React.FC<FleetPageProps> = ({ onBook }) => {
  const [fleetData, setFleetData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const silhouetteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          // Sort vehicles: V-Class, C-Class, H1, Corolla
          const sortOrder = ['V-Class', 'C-Class', 'H1', 'Corolla'];
          const sortedData = data.sort((a, b) => {
            const indexA = sortOrder.findIndex(key => a.name.includes(key));
            const indexB = sortOrder.findIndex(key => b.name.includes(key));
            
            // If item is not in the list, push it to the end
            const safeIndexA = indexA === -1 ? 999 : indexA;
            const safeIndexB = indexB === -1 ? 999 : indexB;
            
            return safeIndexA - safeIndexB;
          });

          setFleetData(sortedData);
          if (sortedData.length > 0) {
            setActiveVehicleId(sortedData[0].id);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch fleet data.");
        console.error("Error fetching fleet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFleet();
  }, []);

  const activeIndex = useMemo(() => 
    fleetData.findIndex(v => v.id === activeVehicleId),
    [activeVehicleId, fleetData]
  );

  const activeVehicle = useMemo(() => 
    fleetData[activeIndex],
    [activeIndex, fleetData]
  );

  // Function to scroll silhouette into view
  const scrollActiveIntoView = (index: number) => {
    if (silhouetteScrollRef.current) {
      const container = silhouetteScrollRef.current;
      const items = container.querySelectorAll('.silhouette-item');
      const activeItem = items[index] as HTMLElement;
      if (activeItem) {
        const scrollPos = activeItem.offsetLeft - (container.offsetWidth / 2) + (activeItem.offsetWidth / 2);
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  };

  // Sync scroll on manual selection change (if triggered by other means)
  useEffect(() => {
    if (activeIndex !== -1) {
      scrollActiveIntoView(activeIndex);
    }
  }, [activeIndex]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Fleet...</div>;
  }
  
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-background-light text-charcoal min-h-screen font-sans pt-32">
      <header className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Our Luxury <span className="italic font-light text-accent-gold">Fleet</span></h1>
        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">Explore our collection of meticulously maintained executive sedans, luxury SUVs, and premium vans designed for ultimate comfort and style.</p>
      </header>
      <main>
        {/* Silhouette Selection Section */}
        <section className="py-12 border-b border-charcoal/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-[10px] tracking-[0.4em] uppercase text-primary font-bold mb-10">Curated Selection</h2>
            
            <div className="relative">
              <style>{`
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #8cc640 transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                  height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #8cc640;
                  border-radius: 20px;
                }
              `}</style>
              {/* Silhouette Scroll Container */}
              <div 
                ref={silhouetteScrollRef}
                className="flex overflow-x-auto custom-scrollbar gap-8 md:gap-12 pb-6 items-end px-4 md:justify-center"
              >
                {fleetData.map((cat, idx) => (
                  <div 
                    key={cat.id} 
                    onClick={() => setActiveVehicleId(cat.id)}
                    className={`silhouette-item flex flex-col items-center gap-6 cursor-pointer min-w-40 transition-all duration-500 group flex-shrink-0 ${activeVehicleId === cat.id ? 'opacity-100 border-b-2 border-primary pb-4' : 'opacity-30 grayscale hover:opacity-80 hover:grayscale-0'}`}
                  >
                    <div className="h-16 md:h-20 w-32 md:w-36 bg-center bg-contain bg-no-repeat transition-transform group-hover:scale-110" style={{ backgroundImage: `url('${cat.silhouette_image_url}')` }}></div>
                    <span className={`text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-bold whitespace-nowrap ${activeVehicleId === cat.id ? 'text-primary' : 'text-charcoal/40'}`}>
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Vehicle Display */}
        {activeVehicle && (
          <section className="max-w-7xl mx-auto py-20 px-6">
            <div className="flex flex-col items-center">
              <div className="text-center mb-16">
                <h3 className="text-4xl md:text-7xl font-display font-light tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">{activeVehicle.name}</h3>
                <p className="text-accent-gold text-[10px] md:text-xs tracking-[0.3em] font-bold uppercase">{activeVehicle.tagline}</p>
              </div>
              
              <div className="w-full relative group max-w-6xl">
                <div className="aspect-[16/9] md:aspect-[21/9] w-full bg-white overflow-hidden rounded-xl border border-charcoal/5 shadow-2xl flex items-center justify-center">
                  <div 
                    key={activeVehicle.id}
                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-all duration-1000 group-hover:scale-105 animate-in fade-in zoom-in-95" 
                    style={{ backgroundImage: `url('${activeVehicle.hero_image_url}')` }}
                  />
                </div>
                
                <button className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-charcoal/10 backdrop-blur-2xl border border-white/20 px-6 md:px-10 py-3 md:py-5 text-white hover:bg-primary transition-all shadow-2xl active:scale-95 group/btn">
                  <span className="material-symbols-outlined !text-2xl md:text-3xl group-hover/btn:rotate-180 transition-transform duration-700">360</span>
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase">View Interior</span>
                </button>
              </div>

              {/* Tech Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-4xl mt-16 md:mt-24">
                {activeVehicle.specs.map(spec => (
                   <div key={spec.title} className="flex flex-col items-center text-center gap-4 md:gap-6 md:border-r border-charcoal/5 last:border-0 px-8">
                      <div className="size-12 md:size-14 bg-background-light rounded-full border border-charcoal/5 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined !text-2xl md:text-3xl">{spec.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-1 md:mb-2">{spec.title}</h4>
                        <p className="text-base md:text-lg font-display font-medium">{spec.value}</p>
                      </div>
                    </div>
                ))}
              </div>

              <button 
                onClick={() => onBook(activeVehicle.id)} 
                className="mt-16 md:mt-20 border-2 border-primary text-primary px-12 md:px-16 py-4 md:py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10"
              >
                Select This Vehicle
              </button>
              
              {/* Vehicle Details Section */}
              {activeVehicle.details && (
                <div className="w-full max-w-5xl mt-24 pt-16 border-t border-charcoal/10 px-4">
                  <div className="text-center mb-12">
                    <h4 className="text-2xl md:text-3xl font-display font-bold text-charcoal">Vehicle Details</h4>
                    <p className="text-charcoal/50 text-sm mt-2">A closer look at what the {activeVehicle.label} offers.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white p-8 md:p-12 rounded-2xl border border-charcoal/5 shadow-xl">
                    <div>
                      <h5 className="text-lg font-bold text-primary mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined">checklist</span> Key Features
                      </h5>
                      <ul className="space-y-4">
                        {activeVehicle.details.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-charcoal/80">
                            <span className="material-symbols-outlined text-accent-gold !text-lg">check</span>
                            <span className="text-sm md:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-primary mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined">rocket_launch</span> Ideal For
                      </h5>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {activeVehicle.details.idealFor.map((useCase, i) => (
                          <span key={i} className="bg-primary/5 text-primary text-[9px] md:text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-primary/10">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}
      </main>

      {/* Floating Action Bar */}
      {activeVehicle && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-white/90 backdrop-blur-xl border border-primary/20 p-2 md:p-3 shadow-2xl flex items-center justify-between gap-4 md:gap-6 rounded-2xl transition-all hover:border-primary">
          <div className="flex items-center gap-3 md:gap-5 pl-2 md:pl-4">
            <div className="size-8 md:size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined !text-lg md:text-xl">verified</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-primary uppercase whitespace-nowrap">Current Choice</span>
              <span className="text-xs md:text-sm font-bold truncate">{activeVehicle.name.split('|')[0]}</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-charcoal/5 hidden sm:block"></div>
          <div className="hidden sm:flex flex-1"></div>
          <button onClick={() => onBook(activeVehicle.id)} className="bg-primary text-white text-[9px] md:text-[10px] font-bold h-12 md:h-14 px-6 md:px-10 tracking-widest uppercase hover:bg-charcoal transition-all rounded-xl shadow-lg shadow-primary/20 shrink-0">
            BOOK NOW
          </button>
        </div>
      )}
    </div>
  );
};

export default FleetPage;
