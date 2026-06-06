
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export interface SearchParams {
  pickup: { address: string; lat: number; lng: number };
  dropoff: { address: string; lat: number; lng: number };
  date: string;
  time: string;
  passengers: number;
  distanceKm: number;
  durationMinutes: number;
}

interface BookingBarProps {
  onSearch: (params: SearchParams) => void;
}

const BookingBar: React.FC<BookingBarProps> = ({ onSearch }) => {
  // Location State
  const [pickup, setPickup] = useState({ address: '', lat: 0, lng: 0 });
  const [dropoff, setDropoff] = useState({ address: '', lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);
  
  // Autocomplete State
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const pickupContainerRef = useRef<HTMLDivElement>(null);
  const dropoffContainerRef = useRef<HTMLDivElement>(null);

  const debouncedPickup = useDebounce(pickup.address, 400);
  const debouncedDropoff = useDebounce(dropoff.address, 400);

  // --- DATE & TIME STATE ---
  const minDateObj = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // 48h rule
    d.setHours(0, 0, 0, 0); // Normalize time
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(minDateObj);
  const [timeMinutes, setTimeMinutes] = useState(720); // Default 12:00
  const [passengers, setPassengers] = useState(1);

  // Google Maps Init
  useEffect(() => {
    // No longer using Google Maps, just setup if needed
  }, []);
  
  // --- NEW PROGRAMMATIC AUTOCOMPLETE LOGIC ---
  const fetchSuggestions = async (input: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      const { fetchAddressSuggestions } = await import('../lib/geocoding');
      const suggestions = await fetchAddressSuggestions(input);
      setter(suggestions);
  };
  
  useEffect(() => {
      if (debouncedPickup && pickup.lat === 0) fetchSuggestions(debouncedPickup, setPickupSuggestions);
  }, [debouncedPickup]);

  useEffect(() => {
      if (debouncedDropoff && dropoff.lat === 0) fetchSuggestions(debouncedDropoff, setDropoffSuggestions);
  }, [debouncedDropoff]);
  
  const handleSelectSuggestion = async (suggestion: any, type: 'pickup' | 'dropoff') => {
      const placeDetails = {
          address: suggestion.description,
          lat: suggestion.lat,
          lng: suggestion.lng
      };

      if (type === 'pickup') {
          setPickup(placeDetails);
          setPickupSuggestions([]);
          setShowPickupSuggestions(false);
      } else {
          setDropoff(placeDetails);
          setDropoffSuggestions([]);
          setShowDropoffSuggestions(false);
      }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupContainerRef.current && !pickupContainerRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffContainerRef.current && !dropoffContainerRef.current.contains(event.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formatting helpers
  const formatTimeApi = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formatTimeDisplay = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m.toString().padStart(2, '0');
    return { time: `${displayH}:${displayM}`, ampm };
  };

  const formatDateApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTimeContext = (minutes: number) => {
    if (minutes >= 300 && minutes < 720) return { label: "Morning Trip", icon: "wb_sunny" };
    if (minutes >= 720 && minutes < 1020) return { label: "Afternoon Trip", icon: "light_mode" };
    if (minutes >= 1020 && minutes < 1260) return { label: "Evening Trip", icon: "wb_twilight" };
    return { label: "Night Trip", icon: "bedtime" }; // 9 PM to 5 AM
  };

  // --- CONTROLS ---

  const adjustDate = (field: 'day' | 'month' | 'year', direction: 1 | -1) => {
    const newDate = new Date(selectedDate);
    
    if (field === 'day') {
        newDate.setDate(newDate.getDate() + direction);
    } else if (field === 'month') {
        const currentDay = newDate.getDate();
        newDate.setMonth(newDate.getMonth() + direction);
        if (newDate.getDate() !== currentDay) newDate.setDate(0); 
    } else if (field === 'year') {
        newDate.setFullYear(newDate.getFullYear() + direction);
    }

    if (newDate < minDateObj) setSelectedDate(minDateObj);
    else setSelectedDate(newDate);
  };

  const handleSearchClick = () => {
    if (!pickup.lat || !dropoff.lat || !selectedDate) {
      alert("Please fill in all fields");
      return;
    }

    const now = new Date();
    const minTime = now.getTime() + (48 * 60 * 60 * 1000);
    const selectedTs = new Date(selectedDate);
    selectedTs.setHours(Math.floor(timeMinutes/60), timeMinutes%60);

    if (selectedTs.getTime() < minTime) {
        alert("Bookings must be made at least 48 hours in advance.");
        return;
    }

    setLoading(true);

    fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=false`)
    .then(res => res.json())
    .then(data => {
        setLoading(false);
        if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const distanceKm = route.distance / 1000;
            const durationMinutes = Math.ceil(route.duration / 60);

            onSearch({
              pickup,
              dropoff,
              date: formatDateApi(selectedDate),
              time: formatTimeApi(timeMinutes),
              passengers,
              distanceKm,
              durationMinutes
            });
        } else {
            alert("Could not calculate route. Please check locations.");
        }
    }).catch(err => {
        setLoading(false);
        console.error("Error calculating routing", err);
        alert("Could not calculate route due to an error.");
    });
  };

  // Helper for display
  const { time: displayTime, ampm } = formatTimeDisplay(timeMinutes);
  const { label: contextLabel, icon: contextIcon } = getTimeContext(timeMinutes);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-charcoal/5 flex flex-col gap-4 relative z-40 max-w-5xl mx-auto">
      {/* 1. LOCATIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup */}
        <div className="relative group" ref={pickupContainerRef}>
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Pickup Location</label>
          <div className="relative flex items-center bg-background-light rounded-xl px-4 h-14 border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3 group-hover:text-primary transition-colors">location_on</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-bold placeholder:text-charcoal/30 text-sm p-0 pr-8" 
              placeholder="Enter pickup location"
              type="text"
              value={pickup.address}
              onChange={(e) => {
                  setPickup({ address: e.target.value, lat: 0, lng: 0 });
                  setShowPickupSuggestions(true);
              }}
              onFocus={() => setShowPickupSuggestions(true)}
              autoComplete="off"
            />
            {pickup.address && (
              <button
                type="button"
                onClick={() => setPickup({ address: '', lat: 0, lng: 0 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal z-10"
                aria-label="Clear pickup location"
              >
                <span className="material-symbols-outlined !text-xl">close</span>
              </button>
            )}
          </div>
          {showPickupSuggestions && pickupSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                {pickupSuggestions.map((s, i) => (
                    <li key={i} onMouseDown={() => handleSelectSuggestion(s, 'pickup')} className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm">
                       {s.description}
                    </li>
                ))}
            </ul>
          )}
        </div>

        {/* Destination */}
        <div className="relative group" ref={dropoffContainerRef}>
          <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Destination</label>
          <div className="relative flex items-center bg-background-light rounded-xl px-4 h-14 border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary/60 mr-3 group-hover:text-primary transition-colors">flag</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-bold placeholder:text-charcoal/30 text-sm p-0 pr-8" 
              placeholder="Enter destination"
              type="text"
              value={dropoff.address}
              onChange={(e) => {
                  setDropoff({ address: e.target.value, lat: 0, lng: 0 });
                  setShowDropoffSuggestions(true);
              }}
              onFocus={() => setShowDropoffSuggestions(true)}
              autoComplete="off"
            />
            {dropoff.address && (
              <button
                type="button"
                onClick={() => setDropoff({ address: '', lat: 0, lng: 0 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal z-10"
                aria-label="Clear destination"
              >
                <span className="material-symbols-outlined !text-xl">close</span>
              </button>
            )}
          </div>
          {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                {dropoffSuggestions.map((s, i) => (
                    <li key={i} onMouseDown={() => handleSelectSuggestion(s, 'dropoff')} className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm">
                       {s.description}
                    </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* 2. SECOND ROW: Date, Time, Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <div className="md:col-span-4 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[160px] group" style={{ background: 'linear-gradient(135deg, #2a2a5a 0%, #5b338d 50%, #8E6E23 100%)' }}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col items-center">
                 <div className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60 mb-3">Date</div>
                 <div className="flex items-center justify-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                          <button onClick={() => adjustDate('day', 1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_up</span></button>
                          <span className="text-2xl font-display font-bold leading-none">{selectedDate.getDate()}</span>
                          <span className="text-[8px] font-bold uppercase opacity-60">{selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <button onClick={() => adjustDate('day', -1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_down</span></button>
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div className="flex flex-col items-center gap-1">
                          <button onClick={() => adjustDate('month', 1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_up</span></button>
                          <span className="text-xl font-display font-bold leading-none uppercase">{selectedDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-[8px] font-bold uppercase opacity-60">Month</span>
                          <button onClick={() => adjustDate('month', -1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_down</span></button>
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div className="flex flex-col items-center gap-1">
                          <button onClick={() => adjustDate('year', 1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_up</span></button>
                          <span className="text-xl font-display font-bold leading-none">{selectedDate.getFullYear()}</span>
                          <span className="text-[8px] font-bold uppercase opacity-60">Year</span>
                          <button onClick={() => adjustDate('year', -1)} className="p-0.5 hover:text-accent-gold transition-colors"><span className="material-symbols-outlined !text-xl">keyboard_arrow_down</span></button>
                      </div>
                 </div>
            </div>
        </div>
        <div className="md:col-span-4 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[160px] group" style={{ background: 'linear-gradient(135deg, #2a2a5a 0%, #5b338d 50%, #8E6E23 100%)' }}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-3 right-3 z-20 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 animate-in fade-in duration-300">
                <span className="material-symbols-outlined !text-[12px] text-accent-gold">{contextIcon}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">{contextLabel}</span>
            </div>
            <div className="relative z-10 flex flex-col items-center w-full px-4">
                 <div className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">Select Time</div>
                 <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-display font-bold tracking-tight">{displayTime}</span>
                    <span className="text-sm font-medium opacity-80 uppercase tracking-widest">{ampm}</span>
                </div>
                <div className="w-full relative px-2">
                    <input type="range" min="0" max="1410" step="30" value={timeMinutes} onChange={(e) => setTimeMinutes(parseInt(e.target.value))} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none"/>
                    <div className="flex justify-between w-full text-[8px] font-bold opacity-50 mt-2 px-0.5 uppercase tracking-wider">
                        <span>06:00</span><span>12:00</span><span>18:00</span><span>00:00</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-3 justify-center">
            <div className="w-full relative group">
                <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">Passengers</label>
                <div className="flex items-center bg-background-light rounded-xl px-4 h-14 border border-transparent hover:border-primary/30 transition-all w-full">
                    <span className="material-symbols-outlined text-primary/60 mr-3 group-hover:text-primary transition-colors">group</span>
                    <select className="bg-transparent border-none focus:ring-0 w-full text-charcoal font-bold text-sm p-0 cursor-pointer" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))}>
                        {[1,2,3,4,5,6,7,8,9,10,13].map(num => (<option key={num} value={num}>{num} Passengers</option>))}
                    </select>
                </div>
            </div>
            <button onClick={handleSearchClick} disabled={loading} className="w-full h-16 rounded-xl bg-charcoal text-white flex items-center justify-center gap-3 hover:bg-black transition-all group font-bold tracking-widest uppercase text-xs shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Calculating...' : 'Search Vehicles'}
                {!loading && <span className="material-symbols-outlined !text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingBar;
