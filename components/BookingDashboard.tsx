
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline as LeafletPolyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../lib/supabaseClient';
import EnquiryForm from './EnquiryForm';

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


// --- TYPE DEFINITIONS ---
interface Vehicle {
  id: string;
  name: string;
  price_per_km_cents: number;
  capacity_seats: number;
  capacity_bags: number;
  hero_image_url: string;
  specs?: any; 
  details?: {
    features: string[];
    idealFor: string[];
  };
}

interface Quote {
  totalPrice: number;
  distanceKm: number;
  durationMinutes: number;
  breakdown: {
    base: number;
    distance: number;
    returnTripSurcharge: number;
    babySeatSurcharge: number;
    trailerSurcharge: number;
    weekendSurcharge: number;
    afterHoursSurcharge: number;
    holidaySurcharge: number;
  };
}

interface VehicleWithQuote {
    vehicle: Vehicle;
    quote: Quote;
}

interface PricingRule {
  rule_type: string;
  value_cents: number;
  days_of_week?: number[];
  start_time?: string;
  end_time?: string;
}

interface BookingDashboardProps {
  initialData?: {
    pickup?: { address: string; lat: number; lng: number };
    dropoff?: { address: string; lat: number; lng: number };
    date?: string;
    time?: string;
    passengers?: number;
    vehicleId?: string;
  } | null;
}

const JOBURG_BOUNDS = { south: -26.35, west: 27.85, north: -26.05, east: 28.25 };

// --- MAIN COMPONENT ---
const BookingDashboard: React.FC<BookingDashboardProps> = ({ initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);
  const [vehicleQuotes, setVehicleQuotes] = useState<VehicleWithQuote[]>([]);
  const [pickup, setPickup] = useState<{ address: string; lat?: number; lng?: number }>(initialData?.pickup || { address: '' });
  const [dropoff, setDropoff] = useState<{ address: string; lat?: number; lng?: number }>(initialData?.dropoff || { address: '' });
  const [pickupDate, setPickupDate] = useState(initialData?.date || '');
  const [pickupTime, setPickupTime] = useState(initialData?.time || '');
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [numPassengers, setNumPassengers] = useState(initialData?.passengers || 1);
  const [addBabySeat, setAddBabySeat] = useState(false);
  const [addTrailer, setAddTrailer] = useState(false);
  const [meetAndGreet, setMeetAndGreet] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(initialData?.vehicleId || null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+27');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);
  const [numericRouteStats, setNumericRouteStats] = useState<{ distanceMeters: number; durationSeconds: number } | null>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<[number, number][]>([]);

  // Autocomplete state
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const pickupContainerRef = useRef<HTMLDivElement>(null);
  const dropoffContainerRef = useRef<HTMLDivElement>(null);

  const debouncedPickup = useDebounce(pickup.address, 400);
  const debouncedDropoff = useDebounce(dropoff.address, 400);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const minDate = getMinDate();

  useEffect(() => {
    if (initialData) {
      if (initialData.pickup) setPickup(initialData.pickup);
      if (initialData.dropoff) setDropoff(initialData.dropoff);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, rulesRes, holidaysRes] = await Promise.all([
          supabase.from('vehicles').select('*'),
          supabase.from('pricing_rules').select('*').eq('is_active', true),
          supabase.from('public_holidays').select('holiday_date')
        ]);
        if (vehiclesRes.error) throw vehiclesRes.error;
        setVehicles(vehiclesRes.data || []);
        setPricingRules(rulesRes.data || []);
        setPublicHolidays((holidaysRes.data || []).map((h: any) => h.holiday_date));
      } catch (err: any) {
        setError('Failed to load system data. Please refresh the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- AUTOCOMPLETE LOGIC ---
  const fetchSuggestions = async (input: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      const { fetchAddressSuggestions } = await import('../lib/geocoding');
      const suggestions = await fetchAddressSuggestions(input);
      setter(suggestions);
  };

  useEffect(() => {
    if (debouncedPickup && !pickup.lat) fetchSuggestions(debouncedPickup, setPickupSuggestions);
  }, [debouncedPickup]);

  useEffect(() => {
    if (debouncedDropoff && !dropoff.lat) fetchSuggestions(debouncedDropoff, setDropoffSuggestions);
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

  // Update Route OpenStreetMap OSRM
  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
        setRouteGeoJSON([]); // clear previous
        fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
                setRouteGeoJSON(coordinates);
                
                const distanceKm = route.distance / 1000;
                const durationMinutes = Math.ceil(route.duration / 60);

                setRouteStats({ 
                    distance: `${distanceKm.toFixed(1)} km`, 
                    duration: `${durationMinutes} mins` 
                });
                setNumericRouteStats({ 
                    distanceMeters: route.distance, 
                    durationSeconds: route.duration 
                });
            }
        }).catch(err => {
            console.error("Error computing route:", err);
            setError("Unable to compute route with OpenStreetMap.");
        });
    } else {
        setRouteGeoJSON([]);
        setRouteStats(null);
        setNumericRouteStats(null);
    }
  }, [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]);

  const MapUpdater = ({ routeGeoJSON, pickup, dropoff }: { routeGeoJSON: [number, number][], pickup: any, dropoff: any }) => {
    const leafletMap = useMap();
    useEffect(() => {
        setTimeout(() => {
            leafletMap.invalidateSize();
        }, 200);

        if (routeGeoJSON && routeGeoJSON.length > 0) {
            const bounds = L.latLngBounds(routeGeoJSON);
            if (bounds.isValid()) {
                leafletMap.fitBounds(bounds, { padding: [50, 50] });
            }
        } else if (pickup.lat && pickup.lng) {
            leafletMap.setView([pickup.lat, pickup.lng], 13);
        } else if (dropoff.lat && dropoff.lng) {
            leafletMap.setView([dropoff.lat, dropoff.lng], 13);
        } else {
            leafletMap.setView([-26.2041, 28.0473], 11);
        }
    }, [routeGeoJSON, pickup, dropoff, leafletMap]);
    return null;
  };

  // --- LOGIC ---
  const handleGetQuotes = async () => {
    setError(null);
    setShowEnquiry(false);
    if (!pickup.lat || !dropoff.lat || !pickupDate || !pickupTime) {
      setError('Please fill in all required trip details. Make sure you select locations from the dropdowns.');
      return;
    }
    setIsLoading(true);
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    const diffHours = (pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 48) {
        setError('Bookings must be made at least 48 hours (2 days) in advance.');
        setIsLoading(false);
        return;
    }
    if (!numericRouteStats) {
        setError('Unable to calculate route.');
        setIsLoading(false);
        return;
    }
    const distanceMeters = numericRouteStats.distanceMeters;
    if (distanceMeters < 5000) {
        setError('The minimum travel distance is 5km. Please select locations further apart.');
        setIsLoading(false);
        return;
    }
    if (distanceMeters > 150000) {
        setShowEnquiry(true);
        setCurrentStep(6);
        setIsLoading(false);
        return;
    }
    const isInsideJoburg = (lat?: number, lng?: number) => {
        if (!lat || !lng) return false;
        return (lat >= JOBURG_BOUNDS.south && lat <= JOBURG_BOUNDS.north && lng >= JOBURG_BOUNDS.west && lng <= JOBURG_BOUNDS.east);
    };
    if (!isInsideJoburg(pickup.lat, pickup.lng) || !isInsideJoburg(dropoff.lat, dropoff.lng)) {
        setShowEnquiry(true);
        setCurrentStep(6);
        setIsLoading(false);
        return;
    }
    const eligibleVehicles = vehicles.filter(v => v.capacity_seats >= numPassengers);
    if (eligibleVehicles.length === 0) {
        setError('No vehicles available for selected passengers.');
        setIsLoading(false);
        return;
    }
    try {
        const distanceKm = numericRouteStats.distanceMeters / 1000;
        const durationMinutes = Math.ceil(numericRouteStats.durationSeconds / 60);
        const getRuleValue = (type: string) => pricingRules.find(r => r.rule_type === type)?.value_cents || 0;
        const basePrice = getRuleValue('BASE_FEE');
        let weekendSurcharge = 0;
        if (pricingRules.find(r => r.rule_type === 'WEEKEND')?.days_of_week?.includes(pickupDateTime.getDay())) {
            weekendSurcharge = pricingRules.find(r => r.rule_type === 'WEEKEND')?.value_cents || 0;
        }
        let afterHoursSurcharge = 0;
        const timeStr = `${pickupTime}:00`;
        const afterHoursRule = pricingRules.find(r => r.rule_type === 'AFTER_HOURS');
        if (afterHoursRule && afterHoursRule.start_time && afterHoursRule.end_time) {
            const isOvernight = afterHoursRule.start_time > afterHoursRule.end_time;
            if (isOvernight ? (timeStr >= afterHoursRule.start_time || timeStr < afterHoursRule.end_time) : (timeStr >= afterHoursRule.start_time && timeStr < afterHoursRule.end_time)) {
                afterHoursSurcharge = afterHoursRule.value_cents;
            }
        }
        let holidaySurcharge = publicHolidays.includes(pickupDate) ? getRuleValue('PUBLIC_HOLIDAY') : 0;
        const babySeatCost = addBabySeat ? getRuleValue('ADDON_BABY_SEAT') : 0;
        const trailerCost = addTrailer ? getRuleValue('ADDON_TRAILER') : 0;
        const calculatedQuotes = eligibleVehicles.map(v => {
            const distanceCost = (v.price_per_km_cents * distanceKm);
            const returnCost = isReturnTrip ? distanceCost : 0;
            const totalCents = basePrice + distanceCost + returnCost + weekendSurcharge + afterHoursSurcharge + holidaySurcharge + babySeatCost + trailerCost;
            return {
                vehicle: v,
                quote: { totalPrice: totalCents / 100, distanceKm, durationMinutes, breakdown: { base: basePrice/100, distance: distanceCost/100, returnTripSurcharge: returnCost/100, babySeatSurcharge: babySeatCost/100, trailerSurcharge: trailerCost/100, weekendSurcharge: weekendSurcharge/100, afterHoursSurcharge: afterHoursSurcharge/100, holidaySurcharge: holidaySurcharge/100 } }
            };
        });
        setVehicleQuotes(calculatedQuotes);
        setCurrentStep(2);
        window.scrollTo(0, 0);
    } catch (err: any) {
      console.error(err);
      setError('Could not calculate quotes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
      setError(null);
      setIsLoading(true);
      const selectedBooking = vehicleQuotes.find(vq => vq.vehicle.id === selectedVehicleId);
      if (!selectedBooking) return;
      try {
          const { data, error } = await supabase.functions.invoke('confirm-booking', {
            body: {
                vehicleId: selectedVehicleId,
                pickupAddress: pickup.address,
                dropoffAddress: dropoff.address,
                pickupTimestamp: `${pickupDate}T${pickupTime}`,
                isReturnTrip: isReturnTrip,
                returnTimestamp: isReturnTrip ? `${returnDate}T${returnTime}` : null,
                numPassengers: numPassengers,
                addBabySeat: addBabySeat,
                addTrailer: addTrailer,
                quote: selectedBooking.quote,
                customerFirstName: firstName,
                customerSurname: surname,
                customerEmail: email,
                customerPhone: `${countryCode} ${phone}`
            }
          });
          if (error) throw error;
          if (data && data.bookingId) { setBookingId(data.bookingId); setCurrentStep(5); }
          else if (data && data.error) throw new Error(data.error);
          else throw new Error("An unknown error occurred during booking.");
      } catch (err: any) {
          setError(err.message || 'Booking failed.');
      } finally {
          setIsLoading(false);
      }
  };

  const nextStep = () => {
      if (currentStep === 2 && !selectedVehicleId) return;
      if (currentStep === 3) {
          if (!firstName || !surname || !email || !phone) {
              setError('Please fill in all details');
              return;
          }
      }
      setError(null);
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
      setError(null);
      if (currentStep === 6) {
          setShowEnquiry(false);
          setCurrentStep(1);
      } else {
          setCurrentStep(prev => prev - 1);
      }
  };

  const startNewBooking = () => {
    setCurrentStep(1); setShowEnquiry(false); setBookingId(null); setPickup({ address: '' }); setDropoff({ address: '' }); setPickupDate(''); setPickupTime(''); setSelectedVehicleId(null); setRouteStats(null); setNumericRouteStats(null);
  };

  const renderProgressBar = () => (
    <div className="flex justify-center items-center w-full mb-12">
        <div className="flex items-center w-full max-w-4xl px-4">
            {[{ step: 1, label: 'Ride Details' }, { step: 2, label: 'Vehicle' }, { step: 3, label: 'Details' }, { step: 4, label: 'Payment' }].map((item, index) => {
                const isCompleted = currentStep > item.step; const isActive = currentStep === item.step;
                return (<React.Fragment key={item.step}>
                        <div onClick={() => { if (isCompleted) { setCurrentStep(item.step); window.scrollTo(0, 0); } }} className={`flex flex-col items-center relative z-10 transition-transform ${isCompleted ? 'cursor-pointer hover:scale-105' : ''}`}>
                            <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${isActive ? 'bg-accent-gold text-white shadow-lg ring-4 ring-accent-gold/20' : isCompleted ? 'bg-accent-gold text-white' : 'bg-gray-200 text-gray-400'}`}>{isCompleted ? <span className="material-symbols-outlined !text-xl">check</span> : item.step}</div>
                            <span className={`absolute top-12 text-[10px] font-bold whitespace-nowrap uppercase tracking-widest ${currentStep >= item.step ? 'text-charcoal' : 'text-gray-300'}`}>{item.label}</span>
                        </div>
                        {index < 3 && (<div className={`flex-1 h-[2px] mx-4 transition-colors duration-300 ${currentStep > item.step ? 'bg-accent-gold' : 'bg-gray-200'}`}></div>)}
                    </React.Fragment>);
            })}
        </div>
    </div>
  );

  const renderRideDetails = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Enter Ride Details</h1>
        <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 relative">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center pt-3 relative">
                        <div className="size-6 rounded-full border border-accent-gold/30 bg-white flex items-center justify-center z-10 shadow-sm"><span className="material-symbols-outlined !text-sm text-accent-gold">arrow_upward</span></div>
                        <div className="w-[1px] bg-gray-300 border-l border-dashed h-full absolute top-6 bottom-6 -z-0"></div>
                        <div className="mt-auto size-6 rounded-full border border-emerald-500/30 bg-white flex items-center justify-center z-10 shadow-sm"><span className="material-symbols-outlined !text-sm text-emerald-600">arrow_downward</span></div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <div ref={pickupContainerRef} className="relative">
                            <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">Pick-up Location</label>
                            <div className="relative">
                                <input type="text" value={pickup.address} onChange={(e) => { setPickup({ address: e.target.value }); setShowPickupSuggestions(true); }} onFocus={() => setShowPickupSuggestions(true)} placeholder="Start typing address..." className="w-full bg-white border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold shadow-sm placeholder:text-gray-300 font-medium pr-10" autoComplete="off" />
                                {pickup.address && (
                                    <button type="button" onClick={() => setPickup({ address: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10" aria-label="Clear pickup location"><span className="material-symbols-outlined !text-xl">close</span></button>
                                )}
                            </div>
                            {showPickupSuggestions && pickupSuggestions.length > 0 && (
                                <ul className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                                    {pickupSuggestions.map((s, i) => (
                                        <li key={i} onMouseDown={() => handleSelectSuggestion(s, 'pickup')} className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm">{s.description}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div ref={dropoffContainerRef} className="relative">
                            <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">Drop-off Location</label>
                            <div className="relative">
                                <input type="text" value={dropoff.address} onChange={(e) => { setDropoff({ address: e.target.value }); setShowDropoffSuggestions(true); }} onFocus={() => setShowDropoffSuggestions(true)} placeholder="Start typing address..." className="w-full bg-white border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold shadow-sm placeholder:text-gray-300 font-medium pr-10" autoComplete="off" />
                                {dropoff.address && (
                                    <button type="button" onClick={() => setDropoff({ address: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10" aria-label="Clear dropoff location"><span className="material-symbols-outlined !text-xl">close</span></button>
                                )}
                            </div>
                            {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                                <ul className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                                    {dropoffSuggestions.map((s, i) => (
                                        <li key={i} onMouseDown={() => handleSelectSuggestion(s, 'dropoff')} className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm">{s.description}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative group"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-gold transition-colors">calendar_today</span><input type="date" min={minDate} value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-14 pl-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium text-charcoal"/></div>
                <div className="relative group"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-gold transition-colors">schedule</span><input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-14 pl-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium text-charcoal"/></div>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-charcoal/60">cached</span><span className="font-bold text-sm text-charcoal">Add return trip</span></div>
                <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={isReturnTrip} onChange={e => setIsReturnTrip(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div></label>
            </div>
            {isReturnTrip && (<div className="grid grid-cols-2 gap-4">
                <div className="relative group"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-gold">calendar_today</span><input type="date" min={pickupDate || minDate} value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-14 pl-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div>
                <div className="relative group"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-gold">schedule</span><input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-14 pl-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div>
            </div>)}
            <div>
                <h2 className="text-lg font-bold text-charcoal mb-2">No. of Passengers</h2>
                <div className="relative"><select value={numPassengers} onChange={e => setNumPassengers(parseInt(e.target.value))} className="w-full bg-gray-50 border-none rounded-xl h-14 px-4 text-sm focus:ring-1 focus:ring-accent-gold font-medium text-charcoal appearance-none">{[...Array(13).keys()].map(i => <option key={i+1} value={i+1}>{i+1} Passenger{i > 0 ? 's' : ''}</option>)}</select><span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none">expand_more</span></div>
            </div>
            <div className="flex gap-4 items-center">
                 <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-accent-gold transition-colors flex-1"><input type="checkbox" checked={addBabySeat} onChange={e => setAddBabySeat(e.target.checked)} className="text-accent-gold focus:ring-accent-gold rounded" /><span className="text-xs font-bold text-charcoal">Baby Seat</span></label>
                 <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-accent-gold transition-colors flex-1"><input type="checkbox" checked={meetAndGreet} onChange={e => setMeetAndGreet(e.target.checked)} className="text-accent-gold focus:ring-accent-gold rounded" /><span className="text-xs font-bold text-charcoal">Meet & Greet</span></label>
            </div>
            <button onClick={handleGetQuotes} disabled={isLoading} className="w-full h-14 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg text-sm tracking-widest uppercase disabled:opacity-50">{isLoading ? 'Processing...' : 'Next: Choose Vehicle'}</button>
        </div>
    </div>
  );
  
  const renderVehicleDetailsPopup = () => {
    if (!viewingVehicle) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingVehicle(null)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setViewingVehicle(null)} className="absolute top-4 right-4 z-10 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"><span className="material-symbols-outlined text-charcoal">close</span></button>
                <div className="h-64 w-full relative bg-gray-100"><img src={viewingVehicle.hero_image_url} alt={viewingVehicle.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div><div className="absolute bottom-6 left-6 text-white"><h2 className="text-3xl font-display font-bold">{viewingVehicle.name.split('|')[0]}</h2><p className="opacity-90 text-sm">{viewingVehicle.name.split('|')[1] || 'Luxury Vehicle'}</p></div></div>
                <div className="p-8"><div className="flex gap-4 mb-8 border-b border-gray-100 pb-8"><div className="flex flex-col items-center justify-center bg-gray-50 w-24 py-3 rounded-xl border border-gray-100"><span className="material-symbols-outlined text-charcoal/60 mb-1">person</span><span className="text-xs font-bold text-charcoal">{viewingVehicle.capacity_seats} Seats</span></div><div className="flex flex-col items-center justify-center bg-gray-50 w-24 py-3 rounded-xl border border-gray-100"><span className="material-symbols-outlined text-charcoal/60 mb-1">luggage</span><span className="text-xs font-bold text-charcoal">{viewingVehicle.capacity_bags} Bags</span></div></div>
                <div className="space-y-6">{viewingVehicle.details?.features && (<div><h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-accent-gold">verified</span> Vehicle Features</h3><ul className="grid grid-cols-1 md:grid-cols-2 gap-3">{(viewingVehicle.details).features.map((feature, i) => (<li key={i} className="text-sm text-charcoal/70 flex items-start gap-3 bg-gray-50 p-3 rounded-lg"><span className="material-symbols-outlined !text-base text-green-600 mt-0.5">check_circle</span>{feature}</li>))}</ul></div>)}{viewingVehicle.details?.idealFor && (<div><h3 className="font-bold text-charcoal mb-4 mt-6 flex items-center gap-2"><span className="material-symbols-outlined text-accent-gold">star</span> Perfect For</h3><div className="flex flex-wrap gap-2">{(viewingVehicle.details).idealFor.map((item, i) => (<span key={i} className="text-xs font-bold bg-white text-charcoal px-4 py-2 rounded-full border border-gray-200 shadow-sm uppercase tracking-wide">{item}</span>))}</div></div>)}</div>
                <div className="mt-8 pt-6 border-t border-gray-100"><button onClick={() => { setSelectedVehicleId(viewingVehicle.id); setViewingVehicle(null); }} className="w-full bg-charcoal text-white h-14 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">Select This Vehicle</button></div></div>
            </div>
        </div>
    );
  };
  const renderChooseRide = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-charcoal">Select Your Vehicle</h1>
            <div className="space-y-6">{vehicleQuotes.map(({vehicle, quote}, index) => { const isSelected = selectedVehicleId === vehicle.id; const nameParts = vehicle.name.split('|'); const mainName = nameParts[0]?.trim() || vehicle.name; const subName = nameParts[1] ? nameParts[1].trim() : "Luxury Vehicle"; const isPopular = index === 0; return (<div key={vehicle.id} onClick={() => setSelectedVehicleId(vehicle.id)} className={`flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl ${isSelected ? 'border-accent-gold ring-1 ring-accent-gold' : 'border-transparent'}`}><div className="w-full md:w-1/3 bg-booking-dark relative min-h-[200px] md:min-h-0"><img src={vehicle.hero_image_url} alt={mainName} className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-black/20"></div></div><div className="w-full md:w-2/3 p-6 flex flex-col justify-between"><div className="flex justify-between items-start"><div><div className="flex items-center gap-2 mb-1"><h2 className="text-xl font-bold text-charcoal">{mainName}</h2>{isPopular && <span className="bg-gray-100 text-charcoal/60 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Popular</span>}</div><p className="text-charcoal/50 text-sm">{subName}</p></div><div className="text-right"><div className="text-2xl font-bold text-charcoal">R{quote.totalPrice.toFixed(0)}</div><div className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider">Total Price</div></div></div><div className="flex gap-4 mt-6 mb-6"><div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-charcoal/70"><span className="material-symbols-outlined !text-lg">person</span><span className="text-xs font-bold">{vehicle.capacity_seats}</span></div><div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-charcoal/70"><span className="material-symbols-outlined !text-lg">luggage</span><span className="text-xs font-bold">{vehicle.capacity_bags}</span></div></div><div className="flex items-center justify-between mt-auto"><button onClick={(e) => { e.stopPropagation(); setViewingVehicle(vehicle); }} className="text-accent-gold text-xs font-bold hover:underline">Vehicle details</button><button className={`px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${isSelected ? 'bg-accent-gold text-white shadow-lg' : 'bg-charcoal text-white hover:bg-black'}`}>{isSelected ? <span className="flex items-center gap-2"><span className="material-symbols-outlined !text-lg">check</span> Selected</span> : 'Select'}</button></div></div></div>);})}</div>
        </div>
    );
  };
  const renderPassengerDetails = () => {
    return (
     <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"><h1 className="text-2xl font-display font-bold text-charcoal mb-6">Passenger Details</h1><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">First Name</label><input type="text" placeholder="e.g. John" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div><div><label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">Surname</label><input type="text" placeholder="e.g. Doe" value={surname} onChange={e => setSurname(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div></div><div><label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">Email Address</label><input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div><div><label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label><div className="flex gap-3"><select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-gray-50 border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium w-24"><option value="+27">ZA +27</option><option value="+1">US +1</option><option value="+44">UK +44</option></select><input type="tel" placeholder="83 123 4567" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl h-12 text-sm focus:ring-1 focus:ring-accent-gold font-medium"/></div></div><div><label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5 ml-1">Comments / Flight Number</label><textarea rows={3} placeholder="Flight details or special requests..." value={comments} onChange={e => setComments(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-accent-gold font-medium p-4"/></div></div></div>);
  };
  const renderPayment = () => {
    return (<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"><h1 className="text-2xl font-display font-bold text-charcoal mb-6">Review & Pay</h1><div className="space-y-6"><div className="bg-gray-50 p-6 rounded-xl border border-gray-100"><h3 className="font-bold text-charcoal mb-4">Payment Method</h3><div className="space-y-3"><label className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-accent-gold transition-colors"><input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-accent-gold focus:ring-accent-gold" /><span className="material-symbols-outlined text-charcoal/70">credit_card</span><span className="font-bold text-sm text-charcoal">Credit / Debit Card</span></label><label className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-accent-gold transition-colors"><input type="radio" name="payment" value="eft" checked={paymentMethod === 'eft'} onChange={() => setPaymentMethod('eft')} className="text-accent-gold focus:ring-accent-gold" /><span className="material-symbols-outlined text-charcoal/70">account_balance</span><span className="font-bold text-sm text-charcoal">EFT / Bank Transfer</span></label></div></div><p className="text-xs text-charcoal/60 leading-relaxed">By clicking "Confirm & Book", you agree to our Terms of Service and Cancellation Policy.</p></div></div>);
  };
  const renderSuccess = () => {
    return (<div className="text-center py-12 bg-white rounded-2xl shadow-xl"><div className="size-24 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6"><span className="material-symbols-outlined !text-5xl">check_circle</span></div><h1 className="text-3xl font-display font-bold text-charcoal mb-4">Booking Confirmed!</h1><p className="text-charcoal/60 mb-8 max-w-xs mx-auto">Your booking reference is <span className="font-bold text-charcoal">{bookingId?.substring(0,8).toUpperCase()}</span>. We've sent a confirmation email to {email}.</p><button onClick={startNewBooking} className="bg-charcoal text-white px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors shadow-lg">Book Another Trip</button></div>);
  };
  const renderEnquiry = () => {
    return (<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"><button onClick={prevStep} className="text-sm font-semibold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">arrow_back</span> Back</button><div className="mb-4 bg-primary/5 p-6 rounded-2xl border border-primary/10"><div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-primary">info</span><h3 className="text-primary font-bold">Long Distance Travel</h3></div><p className="text-sm text-charcoal/70 leading-relaxed">Your requested route is outside our standard automated pricing zone. Please fill out the form below, and our concierge team will provide a custom quote within 30 minutes.</p></div><EnquiryForm /></div>);
  };
  const renderTripSummary = () => {
    const selectedQuote = vehicleQuotes.find(vq => vq.vehicle.id === selectedVehicleId); 
    let btnText = "Next"; 
    let btnAction: () => void = nextStep; 
    let btnDisabled = false; 
    if (currentStep === 2) { 
      btnText = "Next: Details"; 
      btnDisabled = !selectedVehicleId; 
    } else if (currentStep === 3) { 
      btnText = "Next: Payment"; 
      btnDisabled = !firstName || !surname || !email || !phone; 
    } else if (currentStep === 4) { 
      btnText = isLoading ? "Processing..." : "Confirm & Book"; 
      btnAction = handleConfirmBooking; 
      btnDisabled = isLoading; 
    }
    
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
        <div className="p-4 bg-white border-b border-gray-100 z-20 relative flex justify-between items-center">
          <h3 className="font-bold text-lg text-charcoal">Booking Summary</h3>
        </div>
        <div className="relative h-48 w-full bg-gray-100">
          <MapContainer 
            center={[-26.2041, 28.0473]} 
            zoom={11} 
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={currentStep === 1}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {routeGeoJSON.length > 0 && <LeafletPolyline positions={routeGeoJSON} color="#5b338d" weight={5} />}
            {pickup.lat && pickup.lng && <CircleMarker center={[pickup.lat, pickup.lng]} radius={6} color="#cda434" fillColor="#cda434" fillOpacity={1} />}
            {dropoff.lat && dropoff.lng && <CircleMarker center={[dropoff.lat, dropoff.lng]} radius={6} color="#2b2d42" fillColor="#2b2d42" fillOpacity={1} />}
            <MapUpdater routeGeoJSON={routeGeoJSON} pickup={pickup} dropoff={dropoff} />
          </MapContainer>
          {routeStats && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-charcoal z-10 flex items-center gap-2">
              <span>{routeStats.distance}</span>
              <span className="text-gray-300">•</span>
              <span>{routeStats.duration}</span>
            </div>
          )}
        </div>
        <div className="p-6 space-y-6">
          {selectedQuote ? (
            <div className="flex items-center gap-4">
              <div className="size-14 bg-white rounded-xl p-1 border border-gray-100 flex items-center justify-center shadow-sm">
                <img src={selectedQuote.vehicle.hero_image_url} alt="Vehicle" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-charcoal">{selectedQuote.vehicle.name.split('|')[0]}</h4>
                <p className="text-[10px] text-charcoal/50">{selectedQuote.vehicle.name.split('|')[1] || 'Luxury Class'} • {numPassengers} Passengers</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-accent-gold">R{selectedQuote.quote.totalPrice.toFixed(0)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 opacity-50">
              <div className="size-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-charcoal/30">directions_car</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal">No Vehicle Selected</h4>
                <p className="text-[10px] text-charcoal/50">Please select a vehicle</p>
              </div>
            </div>
          )}
          <hr className="border-gray-100" />
          <div className="relative pl-4">
            <div className="absolute top-2 left-0 bottom-4 w-0.5 bg-gray-200 border-l border-dashed border-gray-300"></div>
            <div className="mb-6 relative">
              <div className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-accent-gold ring-2 ring-white"></div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Pick-up</p>
              <p className="text-sm font-bold text-charcoal leading-tight mb-1">{pickup.address}</p>
              <p className="text-xs text-charcoal/50">{pickupDate} • {pickupTime}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-charcoal ring-2 ring-white"></div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Drop-off</p>
              <p className="text-sm font-bold text-charcoal leading-tight">{dropoff.address}</p>
            </div>
          </div>
          {(addBabySeat || meetAndGreet) && (
            <div className="pt-2">
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2">ADD-ONS</p>
              <div className="flex flex-wrap gap-2">
                {addBabySeat && <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-charcoal/70">Baby Seat</span>}
                {meetAndGreet && <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-charcoal/70">Meet & Greet</span>}
              </div>
            </div>
          )}
          <div className="space-y-3 pt-2">
            <button onClick={btnAction} disabled={btnDisabled} className="w-full h-12 bg-charcoal text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group">
              {btnText}{!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform !text-base">arrow_forward</span>}
            </button>
            {currentStep > 1 && (
              <button onClick={prevStep} className="w-full h-12 bg-white border border-gray-200 text-charcoal rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-xs tracking-widest uppercase">Back</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-40 pb-12 font-sans px-4">
       <div className="w-full max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Book Your <span className="italic font-light text-accent-gold">Luxury Transfer</span></h1>
            <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">Experience seamless mobility with our professional chauffeur service. Secure your booking in just a few steps.</p>
          </header>
          {currentStep <= 4 && renderProgressBar()}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className={`${currentStep === 1 ? 'lg:col-span-1' : currentStep === 6 || currentStep === 5 ? 'lg:col-span-3 max-w-3xl mx-auto' : 'lg:col-span-2'}`}>
                 {currentStep === 1 && renderRideDetails()}
                 {currentStep === 2 && renderChooseRide()}
                 {currentStep === 3 && renderPassengerDetails()}
                 {currentStep === 4 && renderPayment()}
                 {currentStep === 5 && renderSuccess()}
                 {currentStep === 6 && renderEnquiry()}
                 {error && (
                   <div className="bg-red-50 border border-red-100 p-4 rounded-xl mt-4 flex gap-3 items-start">
                     <span className="material-symbols-outlined text-red-500 !text-lg mt-0.5">error</span>
                     <p className="text-red-600 text-xs leading-relaxed">{error}</p>
                   </div>
                 )}
             </div>
             {currentStep !== 5 && currentStep !== 6 && (
                 <div className={`${currentStep === 1 ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                     {currentStep === 1 ? (
                         <div className="h-[600px] bg-gray-200 rounded-2xl overflow-hidden relative shadow-lg border border-gray-200">
                             <MapContainer 
                                center={[-26.2041, 28.0473]} 
                                zoom={11} 
                                zoomControl={false}
                                scrollWheelZoom={false}
                                dragging={currentStep === 1}
                                style={{ height: '100%', width: '100%', zIndex: 0 }}
                              >
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                />
                                {routeGeoJSON.length > 0 && <LeafletPolyline positions={routeGeoJSON} color="#5b338d" weight={5} />}
                                {pickup.lat && pickup.lng && <CircleMarker center={[pickup.lat, pickup.lng]} radius={6} color="#cda434" fillColor="#cda434" fillOpacity={1} />}
                                {dropoff.lat && dropoff.lng && <CircleMarker center={[dropoff.lat, dropoff.lng]} radius={6} color="#2b2d42" fillColor="#2b2d42" fillOpacity={1} />}
                                <MapUpdater routeGeoJSON={routeGeoJSON} pickup={pickup} dropoff={dropoff} />
                              </MapContainer>
                              {routeStats && (
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-gray-200 z-10">
                                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Estimated Travel Time</p>
                                  <span className="text-2xl font-bold text-charcoal">{routeStats.duration}</span>
                                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mt-2 mb-1">Distance</p>
                                  <span className="text-lg font-bold text-charcoal">{routeStats.distance}</span>
                                </div>
                              )}
                         </div>
                     ) : ( renderTripSummary() )}
                 </div>
             )}
          </div>
       </div>
       {renderVehicleDetailsPopup()}
    </div>
  );
};

export default BookingDashboard;
