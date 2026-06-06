
import React from 'react';

const Destinations: React.FC = () => {
  return (
    <section id="destinations" className="bg-charcoal py-24 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-accent-gold font-display font-medium tracking-widest uppercase mb-4 block text-xs">Premium Journeys</span>
            <h2 className="text-white text-4xl md:text-5xl font-display font-bold">Featured Destinations</h2>
          </div>
          <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <span className="text-xs font-bold tracking-widest">VIEW ALL</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Large Card */}
          <div className="col-span-12 lg:col-span-7 group cursor-pointer relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAg8xPJvUeCSBFMdwHH2QcMfu1oPXDqzkTdX7RU5aSenPcEE7rP2C4Xwi2u7X3FiJasCWgekxvmrhWBcQdn6Szw1vYcERrHeyQg_5iXjIQik5hRIb--xdFWRkuzXJAqlB8xCr5IT_F4pR-WOI6F_zV6BP4EE4X3PcbbpLXLmokBjIfNKfe045Bta69tSiC2mRGUpNs9RzYp6MwMs8QwjfAOo3JRyaCALGnDFrDUpGDly8uu9bewlcyPuMR0hgrnZspgFERYzNTQRflp")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal 0% to-transparent 60%"></div>
            <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10">
              <span className="bg-accent-gold text-charcoal text-[9px] font-bold px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest">Exclusive</span>
              <h3 className="text-white text-2xl md:text-3xl font-display font-bold">Sandton Central</h3>
              <p className="text-white/70 mt-2 font-light text-sm md:text-base">Seamless transfers to Africa's financial heart.</p>
            </div>
          </div>

          {/* Side Stack */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div className="relative h-[230px] rounded-xl overflow-hidden group cursor-pointer shadow-xl">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3mCWQssDbJlK5VjNqP-psI4j7o1-8093ydbwh622K24xKn4FvbGcSS8ywgr34x92BuKJTjCUP-zwNZANlPyLkOftlUDbAT00dCuWq9A64RD065kRIv3jMfTyl1fXIqxTHSB6PPU4d6Mmr72K-ldh2mLmdvM65upSgD06N29fwajESIqZNdBTvNsFbhNRfmrqICLWgYkKAckiXcgQvO7HqSV36uzUP9gec5RAtuvZBzHH60SLU-5XT3s-3yTbtsDXbok-YR4Tnmbb")' }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-display font-bold">Private Aviation</h3>
                <p className="text-white/70 text-xs font-light tracking-wide">Tarmac-to-Hotel direct integration.</p>
              </div>
            </div>
            
            <div className="relative h-[230px] rounded-xl overflow-hidden group cursor-pointer shadow-xl">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9CGkaBQb7dHysUOEr245mMLb-WvmKNXtmNkvLp4TOrz3jUQUWHDazw0-YHQ7xPfPOBakJMZGR5vDBcgxQTagL4Xz11rwgquUDi5Ms_9sZlO1mFs-c3ICLTNxXQh_Z1mEL7SbRnaAY4Vx01Z329lkF6nfv3Mosxi-AQT3ew_M9th-XOwhNhfKc6X8zvsZJ5UDmsF8kostVzZBt6DeYuWXgr5k-y6j6XKHszRDmCqk1QzsLCyHAnUUFlxp_EFnS3rp8PFKH4XtAAVqG")' }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-display font-bold">Luxury Resorts</h3>
                <p className="text-white/70 text-xs font-light tracking-wide">Premium arrivals at finest destinations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
