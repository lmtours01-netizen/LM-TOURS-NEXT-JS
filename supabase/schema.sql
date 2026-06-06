-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------
-- 1. CLEANUP (For development only - remove in production if needed)
-- ----------------------------------------
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.pricing_rules;
DROP TABLE IF EXISTS public.vehicles;
DROP TABLE IF EXISTS public.public_holidays;
DROP TABLE IF EXISTS public.enquiries;

-- ----------------------------------------
-- 2. VEHICLES TABLE
-- ----------------------------------------
CREATE TABLE public.vehicles (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    label text NOT NULL,
    tagline text,
    description text,
    hero_image_url text,
    silhouette_image_url text,
    specs jsonb,
    details jsonb,
    capacity_seats integer DEFAULT 4 NOT NULL,
    capacity_bags integer DEFAULT 2 NOT NULL,
    price_per_km_cents integer NOT NULL -- Stored in cents (e.g., R20.00 = 2000)
);

-- ----------------------------------------
-- 3. BOOKINGS TABLE
-- ----------------------------------------
CREATE TABLE public.bookings (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    vehicle_id uuid REFERENCES public.vehicles(id),
    pickup_address text NOT NULL,
    dropoff_address text NOT NULL,
    pickup_timestamp timestamp with time zone NOT NULL,
    is_return_trip boolean DEFAULT false,
    return_timestamp timestamp with time zone,
    
    -- Request Details
    num_passengers integer DEFAULT 1,
    add_baby_seat boolean DEFAULT false,
    add_trailer boolean DEFAULT false,
    
    -- Financials
    total_price_cents integer NOT NULL,
    price_breakdown jsonb NOT NULL, -- Stores base, distance, surcharges separately
    
    -- Customer Info
    customer_first_name text NOT NULL,
    customer_surname text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    
    status text DEFAULT 'confirmed'::text
);

-- ----------------------------------------
-- 4. PRICING RULES TABLE
-- ----------------------------------------
CREATE TABLE public.pricing_rules (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    rule_type text NOT NULL, -- BASE_FEE, WEEKEND, AFTER_HOURS, PUBLIC_HOLIDAY, WAITING_TIME
    value_cents integer NOT NULL,
    start_time time without time zone, 
    end_time time without time zone,
    days_of_week integer[], -- 0=Sun, 6=Sat
    is_active boolean DEFAULT true
);

-- ----------------------------------------
-- 5. PUBLIC HOLIDAYS TABLE
-- ----------------------------------------
CREATE TABLE public.public_holidays (
    holiday_date date NOT NULL PRIMARY KEY,
    name text NOT NULL
);

-- ----------------------------------------
-- 6. ENQUIRIES TABLE (New)
-- ----------------------------------------
CREATE TABLE public.enquiries (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text NOT NULL,
    status text DEFAULT 'new'
);

-- ----------------------------------------
-- 7. SEED DATA (The Exact Prices You Requested)
-- ----------------------------------------

-- VEHICLES
INSERT INTO public.vehicles (name, label, tagline, description, hero_image_url, silhouette_image_url, specs, details, capacity_seats, capacity_bags, price_per_km_cents) VALUES
(
    'Mercedes-Benz V-Class | Executive Vehicle', 
    'Executive MPV', 
    'Group Luxury, Personified', 
    'The Mercedes-Benz V-Class redefines group travel with conference-style seating and premium finishes.', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/mercedes-v-class.webp', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/mercedes-v-class-sil.webp', 
    '[{"icon": "group", "title": "Seats", "value": "7 Passengers"}, {"icon": "work", "title": "Bags", "value": "5 Large"}, {"icon": "chair", "title": "Layout", "value": "Conference"}]', 
    '{"features": ["Conference Seating", "Panoramic Sunroof", "On-board Refreshments", "Multiple Charging Points"], "idealFor": ["Delegations", "Family Trips", "Team Offsites"]}', 
    7, 5, 5000
),
(
    'Mercedes-Benz C-Class | Executive Vehicle', 
    'Executive Sedan', 
    'Executive Excellence', 
    'Experience unparalleled luxury and sophistication with the Mercedes-Benz C-Class.', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/mercedes-c-class.webp', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/mercedes-c-class-sil.webp', 
    '[{"icon": "group", "title": "Seats", "value": "3 Passengers"}, {"icon": "work", "title": "Bags", "value": "2 Large"}, {"icon": "wifi", "title": "Connectivity", "value": "Wi-Fi"}]', 
    '{"features": ["Leather Interior", "Premium Sound System", "On-board Wi-Fi", "Ambient Lighting"], "idealFor": ["VIP Transport", "Corporate Roadshows", "Special Events"]}', 
    3, 2, 2700
),
(
    'Hyundai H1 Mini-Bus | Standard Group Vehicle', 
    'Group Mover', 
    'Efficient Group Travel', 
    'The Hyundai H1 is a versatile and reliable choice for group transportation.', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/hyundai-h1.webp', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/hyundai-h1-sil.webp', 
    '[{"icon": "group", "title": "Seats", "value": "7 Passengers"}, {"icon": "work", "title": "Bags", "value": "5 Large"}, {"icon": "ac_unit", "title": "Climate", "value": "Dual A/C"}]', 
    '{"features": ["Dual Air Conditioning", "Sliding Doors", "Ample Luggage Space", "Comfortable Seating"], "idealFor": ["Tour Groups", "Event Shuttles", "Large Families"]}', 
    7, 5, 3000
),
(
    'Toyota Corolla | Standard Vehicle', 
    'Standard', 
    'Reliability Redefined', 
    'The Toyota Corolla offers a perfect blend of comfort, reliability, and efficiency.', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/corolla-c-sedan.webp', 
    'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/corolla-c-sedan-sil.webp', 
    '[{"icon": "group", "title": "Seats", "value": "3 Passengers"}, {"icon": "work", "title": "Bags", "value": "2 Large"}, {"icon": "ac_unit", "title": "Climate", "value": "A/C"}]', 
    '{"features": ["Air Conditioning", "USB Charging Ports", "Spacious Legroom", "Bottled Water"], "idealFor": ["Airport Transfers", "City Tours", "Business Meetings"]}', 
    3, 2, 2000
);

-- PRICING RULES
INSERT INTO public.pricing_rules (name, rule_type, value_cents, start_time, end_time, days_of_week) VALUES
('Base Fee', 'BASE_FEE', 20000, NULL, NULL, NULL),
('Weekend Surcharge', 'WEEKEND', 20000, NULL, NULL, '{0, 6}'),
('After Hours Surcharge', 'AFTER_HOURS', 25000, '22:00:00', '06:00:00', NULL),
('Public Holiday Surcharge', 'PUBLIC_HOLIDAY', 30000, NULL, NULL, NULL),
('Waiting Time Fee', 'WAITING_TIME', 30000, NULL, NULL, NULL),
('Baby Seat', 'ADDON_BABY_SEAT', 15000, NULL, NULL, NULL),
('Trailer', 'ADDON_TRAILER', 35000, NULL, NULL, NULL);

-- HOLIDAYS (2026-2027 South Africa)
INSERT INTO public.public_holidays (holiday_date, name) VALUES
('2026-01-01', 'New Year''s Day'),
('2026-03-21', 'Human Rights Day'),
('2026-04-03', 'Good Friday'),
('2026-04-06', 'Family Day'),
('2026-04-27', 'Freedom Day'),
('2026-05-01', 'Workers'' Day'),
('2026-06-16', 'Youth Day'),
('2026-08-09', 'National Women''s Day'),
('2026-08-10', 'National Women''s Day observed'),
('2026-09-24', 'Heritage Day'),
('2026-12-16', 'Day of Reconciliation'),
('2026-12-25', 'Christmas Day'),
('2026-12-26', 'Day of Goodwill'),
('2027-01-01', 'New Year''s Day'),
('2027-03-21', 'Human Rights Day'),
('2027-03-22', 'Human Rights Day observed'),
('2027-03-26', 'Good Friday'),
('2027-03-29', 'Family Day'),
('2027-04-27', 'Freedom Day'),
('2027-05-01', 'Workers'' Day'),
('2027-06-16', 'Youth Day'),
('2027-08-09', 'National Women''s Day'),
('2027-09-24', 'Heritage Day'),
('2027-12-16', 'Day of Reconciliation'),
('2027-12-25', 'Christmas Day'),
('2027-12-26', 'Day of Goodwill'),
('2027-12-27', 'Day of Goodwill observed');

-- ----------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) - IMPORTANT!
-- ----------------------------------------
-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can READ vehicles and pricing rules
CREATE POLICY "Enable read access for all users" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.pricing_rules FOR SELECT USING (true);

-- Policy: Anyone can INSERT a booking or enquiry (Public form)
CREATE POLICY "Enable insert for all users" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users (admins) can VIEW bookings and enquiries
CREATE POLICY "Enable read for service role only" ON public.bookings FOR SELECT TO service_role USING (true);
CREATE POLICY "Enable read for service role only" ON public.enquiries FOR SELECT TO service_role USING (true);
