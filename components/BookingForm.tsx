
import React from 'react';

const BookingForm: React.FC = () => {
  return (
    <div className="mt-8 pt-8 border-t border-charcoal/10">
      <h3 className="text-xl font-display font-bold text-charcoal mb-6">Book Your Transfer</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Pickup Location</label>
          <div className="flex items-center bg-background-light rounded-lg px-4 h-14 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3">location_on</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-medium placeholder:text-charcoal/30 text-sm" 
              placeholder="e.g., OR Tambo International Airport" 
              type="text"
            />
          </div>
        </div>
        
        {/* Destination */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Destination</label>
          <div className="flex items-center bg-background-light rounded-lg px-4 h-14 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3">flag</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-medium placeholder:text-charcoal/30 text-sm" 
              placeholder="e.g., Sandton Convention Centre" 
              type="text"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Date</label>
          <div className="flex items-center bg-background-light rounded-lg px-4 h-14 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3">calendar_today</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-medium placeholder:text-charcoal/30 text-sm" 
              type="date"
            />
          </div>
        </div>
        
        {/* Time */}
        <div>
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Time</label>
          <div className="flex items-center bg-background-light rounded-lg px-4 h-14 border border-transparent focus-within:border-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3">schedule</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-medium placeholder:text-charcoal/30 text-sm" 
              type="time"
            />
          </div>
        </div>
      </div>
      <button className="w-full mt-6 h-14 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-charcoal transition-all shadow-lg shadow-primary/20 text-xs tracking-widest uppercase">
        Check Availability
      </button>
    </div>
  );
};

export default BookingForm;
