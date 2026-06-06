
// Fix for errors where Deno global is not recognized by TypeScript
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

/* 
  DATABASE SETUP:
  
  To set up the required tables ('vehicles', 'bookings', 'enquiries') and populate
  the fleet, please run the SQL script located at:
  
  /supabase/schema.sql
  
  You can run this script in your Supabase project's SQL Editor.
*/


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      vehicleId,
      pickupAddress,
      dropoffAddress,
      pickupTimestamp,
      isReturnTrip,
      returnTimestamp,
      numPassengers,
      addBabySeat,
      addTrailer,
      quote,
      customerFirstName,
      customerSurname,
      customerEmail,
      customerPhone,
    } = await req.json();

    // Basic validation
    if (!vehicleId || !pickupAddress || !dropoffAddress || !pickupTimestamp || !quote || !customerFirstName || !customerSurname || !customerEmail) {
      throw new Error("Missing required booking information.");
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const bookingRecord = {
      vehicle_id: vehicleId,
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      pickup_timestamp: pickupTimestamp,
      is_return_trip: isReturnTrip,
      return_timestamp: isReturnTrip ? returnTimestamp : null,
      num_passengers: numPassengers,
      add_baby_seat: addBabySeat,
      add_trailer: addTrailer,
      total_price_cents: Math.round(quote.totalPrice * 100),
      price_breakdown: quote.breakdown,
      customer_first_name: customerFirstName,
      customer_surname: customerSurname,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      status: 'confirmed'
    };

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([bookingRecord])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
        throw new Error("Booking was created but no ID was returned.");
    }

    // --- EMAIL SIMULATION ---
    // In a production environment, you would use a service like Resend, SendGrid, or AWS SES here.
    console.log(`[EMAIL SIMULATION] Sending confirmation to ${customerEmail} for Booking ID: ${data.id}`);
    console.log(`[EMAIL SIMULATION] Content: Dear ${customerFirstName}, your trip from ${pickupAddress} to ${dropoffAddress} is confirmed.`);

    return new Response(JSON.stringify({ success: true, bookingId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in confirm-booking function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
