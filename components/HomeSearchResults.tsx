
import React from 'react';

interface VehicleResult {
  vehicle: {
    id: string;
    name: string;
    hero_image_url: string;
    capacity_seats: number;
    capacity_bags: number;
  };
  totalPrice: number;
}

interface HomeSearchResultsProps {
  results: VehicleResult[];
  onBook: (vehicleId: string) => void;
}

const HomeSearchResults: React.FC<HomeSearchResultsProps> = ({ results, onBook }) => {
  if (!results || results.length === 0) return null;

  return (
    <section 
        id="search-results" 
        className="relative z-10 py-16 px-6 bg-background-light border-b border-charcoal/5"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
                <span className="text-accent-gold font-display font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Ready to Travel</span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-charcoal">Available Vehicles</h3>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40 bg-white px-4 py-2 rounded-full border border-charcoal/5">
                {results.length} Options Found
            </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(({ vehicle, totalPrice }) => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-charcoal/5 flex flex-col">
              {/* Image Container - Enforce Height */}
              <div className="h-56 w-full overflow-hidden relative bg-charcoal/5">
                <img 
                  src={vehicle.hero_image_url} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-bold text-lg leading-tight truncate drop-shadow-md">{vehicle.name.split('|')[0]}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-6 border-b border-charcoal/5 pb-4">
                      <div className="flex gap-4">
                          <div className="flex flex-col items-center justify-center bg-background-light size-10 rounded-lg text-charcoal/60" title="Passengers">
                              <span className="material-symbols-outlined !text-lg">person</span>
                              <span className="text-[10px] font-bold">{vehicle.capacity_seats}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-background-light size-10 rounded-lg text-charcoal/60" title="Luggage">
                              <span className="material-symbols-outlined !text-lg">luggage</span>
                              <span className="text-[10px] font-bold">{vehicle.capacity_bags}</span>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Est. Price</span>
                          <span className="block text-2xl font-bold text-primary">R{totalPrice.toFixed(0)}</span>
                      </div>
                   </div>
                </div>
                
                <button 
                  onClick={() => onBook(vehicle.id)}
                  className="w-full py-4 rounded-xl bg-charcoal text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group/btn"
                >
                  Book Now
                  <span className="material-symbols-outlined !text-base group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSearchResults;
