// Fix for errors where Deno global is not recognized by TypeScript
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Expanded bounds to cover greater Gauteng area (Johannesburg, Pretoria, Airports, etc)
const GAUTENG_BOUNDS = { south: -26.9, west: 27.2, north: -25.1, east: 29.1 };

// --- TYPE DEFINITIONS ---
interface PricingRule {
  rule_type: string;
  value_cents: number;
  days_of_week?: number[];
  start_time?: string;
  end_time?: string;
}

// --- HELPER FUNCTIONS ---
function isWithinServiceArea(coords: { lat: number; lng: number }): boolean {
    return (
        coords.lat >= GAUTENG_BOUNDS.south &&
        coords.lat <= GAUTENG_BOUNDS.north &&
        coords.lng >= GAUTENG_BOUNDS.west &&
        coords.lng <= GAUTENG_BOUNDS.east
    );
}

// --- MAIN FUNCTION ---
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      vehicleId, 
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      pickupTimestamp, 
      isReturnTrip = false,
      addBabySeat = false,
      addTrailer = false
    } = await req.json();

    if (!vehicleId || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng || !pickupTimestamp) {
      throw new Error("Missing required parameters.");
    }
    
    // --- 1. ENFORCE 48 HOUR BOOKING RULE ---
    const pickupDate = new Date(pickupTimestamp);
    const now = new Date();
    const diffInMs = pickupDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 48) {
       throw new Error("Bookings must be made at least 2 days (48 hours) in advance.");
    }
    // ----------------------------------------

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // --- FETCH ALL PRICING LOGIC FROM DATABASE ---
    const [rulesRes, holidaysRes, vehicleRes] = await Promise.all([
      supabaseAdmin.from('pricing_rules').select('*').eq('is_active', true),
      supabaseAdmin.from('public_holidays').select('holiday_date'),
      supabaseAdmin.from('vehicles').select('price_per_km_cents').eq('id', vehicleId).single()
    ]);

    if (rulesRes.error) throw new Error(`Failed to fetch pricing rules: ${rulesRes.error.message}`);
    if (holidaysRes.error) throw new Error(`Failed to fetch public holidays: ${holidaysRes.error.message}`);
    if (vehicleRes.error) throw new Error(`Vehicle not found: ${vehicleRes.error.message}`);

    const rules: PricingRule[] = rulesRes.data || [];
    const publicHolidayDates = (holidaysRes.data || []).map(h => h.holiday_date);
    const vehicle = vehicleRes.data;

    const rulesMap = new Map<string, PricingRule>(rules.map(rule => [rule.rule_type, rule]));
    // --- END OF DATABASE LOGIC FETCH ---

    const pickupCoords = { lat: pickupLat, lng: pickupLng };
    const dropoffCoords = { lat: dropoffLat, lng: dropoffLng };

    // --- 2. CHECK GEOFENCING (TURN INTO ENQUIRY IF OUTSIDE GAUTENG) ---
    if (!isWithinServiceArea(pickupCoords) || !isWithinServiceArea(dropoffCoords)) {
      return new Response(JSON.stringify({ 
          requiresEnquiry: true,
          reason: 'One or more locations are outside our standard Gauteng service area. Redirecting to enquiry.' 
      }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
      });
    }

    const MAPBOX_KEY = Deno.env.get('MAPBOX_API_KEY') || Deno.env.get('VITE_MAPBOX_API_KEY');
    
    let distanceMeters, durationSeconds;

    if (MAPBOX_KEY) {
        try {
            const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?access_token=${MAPBOX_KEY}`;
            const mapboxRes = await fetch(mapboxUrl);
            const mapboxData = await mapboxRes.json();
            
            if (mapboxData.code === 'Ok' && mapboxData.routes?.[0]) {
                distanceMeters = mapboxData.routes[0].distance;
                durationSeconds = mapboxData.routes[0].duration;
            } else {
                console.error("Mapbox error:", mapboxData);
            }
        } catch (error) {
            console.error("Mapbox fetch failed, falling back to OSRM:", error);
        }
    }

    // Fallback to OSRM if Mapbox wasn't used or failed
    if (distanceMeters === undefined) {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=false`;
        const osrmResponse = await fetch(osrmUrl);
        if (!osrmResponse.ok) throw new Error("Failed to fetch distance data from OSRM.");
        const osrmData = await osrmResponse.json();

        if (osrmData.code !== 'Ok' || !osrmData.routes[0]) {
          throw new Error("Could not calculate distance between locations.");
        }
        
        distanceMeters = osrmData.routes[0].distance;
        durationSeconds = osrmData.routes[0].duration;
    }

    const distanceKm = distanceMeters / 1000;
    const durationMinutes = Math.ceil(durationSeconds / 60);

    // --- APPLY DATABASE RULES ---
    const dayOfWeek = pickupDate.getDay();
    const timeOfDay = pickupDate.toTimeString().split(' ')[0]; // HH:MM:SS format
    const pickupDateString = pickupTimestamp.split('T')[0];

    const basePrice = rulesMap.get('BASE_FEE')?.value_cents || 0;
    let distancePrice = (vehicle.price_per_km_cents || 0) * distanceKm;

    let weekendSurchargeCents = 0;
    const weekendRule = rulesMap.get('WEEKEND');
    if (weekendRule && weekendRule.days_of_week?.includes(dayOfWeek)) {
        weekendSurchargeCents = weekendRule.value_cents;
    }

    let afterHoursSurchargeCents = 0;
    const afterHoursRule = rulesMap.get('AFTER_HOURS');
    if (afterHoursRule && afterHoursRule.start_time && afterHoursRule.end_time) {
        if (afterHoursRule.start_time > afterHoursRule.end_time) { // Overnight case
            if (timeOfDay >= afterHoursRule.start_time || timeOfDay < afterHoursRule.end_time) {
                afterHoursSurchargeCents = afterHoursRule.value_cents;
            }
        } else { // Same day case
             if (timeOfDay >= afterHoursRule.start_time && timeOfDay < afterHoursRule.end_time) {
                afterHoursSurchargeCents = afterHoursRule.value_cents;
            }
        }
    }
    
    let holidaySurchargeCents = 0;
    if (publicHolidayDates.includes(pickupDateString)) {
        holidaySurchargeCents = rulesMap.get('PUBLIC_HOLIDAY')?.value_cents || 0;
    }
    
    const babySeatSurcharge = addBabySeat ? (rulesMap.get('ADDON_BABY_SEAT')?.value_cents || 0) : 0;
    const trailerSurcharge = addTrailer ? (rulesMap.get('ADDON_TRAILER')?.value_cents || 0) : 0;
    
    let returnTripSurcharge = isReturnTrip ? distancePrice : 0;
    
    const totalSurcharges = weekendSurchargeCents + afterHoursSurchargeCents + holidaySurchargeCents + babySeatSurcharge + trailerSurcharge;
    const totalPriceCents = basePrice + distancePrice + returnTripSurcharge + totalSurcharges;

    const quote = {
      totalPrice: totalPriceCents / 100,
      distanceKm,
      durationMinutes,
      breakdown: {
        base: basePrice / 100,
        distance: distancePrice / 100,
        returnTripSurcharge: returnTripSurcharge / 100,
        babySeatSurcharge: babySeatSurcharge / 100,
        trailerSurcharge: trailerSurcharge / 100,
        weekendSurcharge: weekendSurchargeCents / 100,
        afterHoursSurcharge: afterHoursSurchargeCents / 100,
        holidaySurcharge: holidaySurchargeCents / 100,
      }
    };
    
    return new Response(JSON.stringify(quote), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});