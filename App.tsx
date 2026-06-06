
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingBar, { SearchParams } from './components/BookingBar';
import HomeSearchResults from './components/HomeSearchResults';
import Experience from './components/Experience';
import ServicesList from './components/ServicesList';
import Fleet from './components/Fleet';
import AboutUs from './components/AboutUs';
import Mission from './components/Mission';
import WhyChooseUs from './components/WhyChooseUs';
import WhoFor from './components/WhoFor';
import FAQ from './components/FAQ';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import RevealSection from './components/RevealSection';
import SEO from './components/SEO';

// Lazy load page components for better performance
const BookingDashboard = lazy(() => import('./components/BookingDashboard'));
const FleetPage = lazy(() => import('./components/FleetPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const LocationPage = lazy(() => import('./components/LocationPage'));
const InsightsPage = lazy(() => import('./components/InsightsPage'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));

interface VehicleResult {
  vehicle: any;
  totalPrice: number;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [initialBookingData, setInitialBookingData] = useState<any>(null);
  const [initialServiceId, setInitialServiceId] = useState<string | null>(null);

  // Data State for Home Search
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);
  const [homeSearchResults, setHomeSearchResults] = useState<VehicleResult[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);

  // Determine current view based on pathname for Navbar highlighting
  const currentView = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  // Loading fallback for lazy components
  const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Fetch Data on Load
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [v, r, h] = await Promise.all([
          supabase.from('vehicles').select('*'),
          supabase.from('pricing_rules').select('*').eq('is_active', true),
          supabase.from('public_holidays').select('holiday_date')
        ]);
        setVehicles(v.data || []);
        setPricingRules(r.data || []);
        setPublicHolidays((h.data || []).map((x: any) => x.holiday_date));
      } catch (err) {
        console.error("Error fetching initial data", err);
      }
    };
    fetchSystemData();
  }, []);

  const handleGoToBooking = () => {
    setInitialBookingData(null); 
    navigate('/booking');
    window.scrollTo(0, 0);
  };

  const handleBookVehicle = (vehicleId: string) => {
    // If we have search params from home search, pass them along
    if (currentSearchParams) {
      setInitialBookingData({
        pickup: currentSearchParams.pickup,
        dropoff: currentSearchParams.dropoff,
        date: currentSearchParams.date,
        time: currentSearchParams.time,
        passengers: currentSearchParams.passengers,
        vehicleId: vehicleId
      });
    } else {
      setInitialBookingData({ vehicleId });
    }
    navigate('/booking');
    window.scrollTo(0, 0);
  };

  const handleGoToHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleGoToFleet = () => {
    navigate('/fleet');
    window.scrollTo(0, 0);
  };

  const handleGoToAbout = () => {
    navigate('/about');
    window.scrollTo(0, 0);
  };

  const handleGoToServices = () => {
    setInitialServiceId(null); 
    navigate('/services');
    window.scrollTo(0, 0);
  };
  
  const handleGoToContact = () => {
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  const handleGoToInsights = () => {
    navigate('/insights');
    window.scrollTo(0, 0);
  };

  const handleSelectService = (serviceId: string) => {
    setInitialServiceId(serviceId);
    navigate('/services');
    window.scrollTo(0, 0);
  };

  const handleGoToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      setTargetSection(sectionId);
      navigate('/');
    } else {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Perform Search Logic (Client Side Calculation)
  const handleHomeSearch = (params: SearchParams) => {
    setCurrentSearchParams(params);
    
    // Filter eligible vehicles
    const eligibleVehicles = vehicles.filter(v => v.capacity_seats >= params.passengers);
    
    if (eligibleVehicles.length === 0) {
      alert("No vehicles available for this number of passengers.");
      return;
    }

    const pickupDate = new Date(`${params.date}T${params.time}`);
    const getRuleValue = (type: string) => pricingRules.find(r => r.rule_type === type)?.value_cents || 0;
    
    // Calculate Surcharges
    const basePrice = getRuleValue('BASE_FEE');
    
    let weekendSurcharge = 0;
    const weekendRule = pricingRules.find(r => r.rule_type === 'WEEKEND');
    if (weekendRule && weekendRule.days_of_week && weekendRule.days_of_week.includes(pickupDate.getDay())) {
        weekendSurcharge = weekendRule.value_cents;
    }

    let afterHoursSurcharge = 0;
    const timeStr = `${params.time}:00`;
    const afterHoursRule = pricingRules.find(r => r.rule_type === 'AFTER_HOURS');
    if (afterHoursRule && afterHoursRule.start_time && afterHoursRule.end_time) {
        const isOvernight = afterHoursRule.start_time > afterHoursRule.end_time;
        if (isOvernight ? (timeStr >= afterHoursRule.start_time || timeStr < afterHoursRule.end_time) : (timeStr >= afterHoursRule.start_time && timeStr < afterHoursRule.end_time)) {
            afterHoursSurcharge = afterHoursRule.value_cents;
        }
    }

    let holidaySurcharge = publicHolidays.includes(params.date) ? getRuleValue('PUBLIC_HOLIDAY') : 0;

    // Calculate per vehicle
    const results = eligibleVehicles.map(v => {
      const distanceCost = (v.price_per_km_cents * params.distanceKm);
      const totalCents = basePrice + distanceCost + weekendSurcharge + afterHoursSurcharge + holidaySurcharge;
      
      return {
        vehicle: v,
        totalPrice: totalCents / 100
      };
    });

    setHomeSearchResults(results);
    
    // Scroll to results
    setTimeout(() => {
      const el = document.getElementById('search-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // Effect to handle scrolling after view changes to 'home'
  useEffect(() => {
    if (location.pathname === '/' && targetSection) {
      setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setTargetSection(null);
      }, 100);
    }
  }, [location.pathname, targetSection]);

  return (
      <div className="relative min-h-screen bg-background-light">
      <Navbar 
        currentView={currentView}
        onBookNow={handleGoToBooking} 
        onGoToFleet={handleGoToFleet}
        onGoToHome={handleGoToHome}
        onGoToAbout={handleGoToAbout}
        onGoToServices={handleGoToServices}
        onGoToContact={handleGoToContact}
        onGoToInsights={handleGoToInsights}
        onGoToSection={handleGoToSection}
      />
      
      <main className="pt-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <div>
                <SEO 
                  title="Home" 
                  description="LM Tours offers premium chauffeur services, luxury airport transfers, and bespoke travel experiences in Johannesburg and beyond. Book your redefined journey today."
                  schema={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "LM Tours",
                    "url": "https://ais-pre-pepphlxzpioqhsmdem72td-251880689090.europe-west2.run.app/",
                    "logo": "https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/LM-Tours-Logo-Dark.png",
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "telephone": "+27-83-576-5000",
                      "contactType": "customer service",
                      "email": "booking@lmtours.co.za",
                      "areaServed": "ZA",
                      "availableLanguage": "English"
                    },
                    "sameAs": [
                      "https://wa.me/27835765000"
                    ]
                  }}
                />
                <Hero onExplore={handleGoToFleet} onSeeStory={handleGoToAbout} />
                
                {/* Search Bar - Reveals with slight delay */}
                <div className="relative z-30 px-6 max-w-[1100px] mx-auto -mt-16">
                  <RevealSection delay={200} variant="fade-up">
                    <BookingBar onSearch={handleHomeSearch} />
                  </RevealSection>
                </div>
                
                {/* Search Results Section */}
                <div className="mt-12">
                   {homeSearchResults.length > 0 && (
                       <RevealSection variant="fade-up">
                           <HomeSearchResults results={homeSearchResults} onBook={handleBookVehicle} />
                       </RevealSection>
                   )}
                </div>

                {/* "Meticulously Crafted Service" Section */}
                <RevealSection variant="fade-up">
                  <Experience />
                </RevealSection>
                
                {/* Services - Staggered Slide In effect could be simulated by container animation */}
                <RevealSection variant="fade-up">
                  <ServicesList onSelectService={handleSelectService} />
                </RevealSection>

                {/* Fleet - Fade In since it's wide */}
                <RevealSection variant="fade-in">
                  <Fleet onSelect={handleGoToFleet} />
                </RevealSection>

                {/* About Us - Zoom or Slide effect */}
                <RevealSection variant="zoom">
                  <AboutUs />
                </RevealSection>

                <RevealSection variant="fade-in">
                  <Mission />
                </RevealSection>

                <RevealSection variant="fade-up">
                  <WhyChooseUs />
                </RevealSection>

                {/* Who We Serve - Slide In */}
                <RevealSection variant="fade-up">
                  <WhoFor />
                </RevealSection>

                <RevealSection variant="fade-up">
                  <FAQ />
                </RevealSection>

                <RevealSection variant="zoom">
                  <ContactCTA />
                </RevealSection>
                
                <Footer onGoToBooking={handleGoToBooking} onGoToFleet={handleGoToFleet} onGoToContact={handleGoToContact} />
              </div>
            } />

            <Route path="/booking" element={
              <>
                <SEO 
                  title="Book Your Luxury Chauffeur Service" 
                  description="Secure your premium luxury transfer with LM Tours today. Our easy online booking system handles chauffeur services, airport transfers, and bespoke point-to-point travel in Johannesburg."
                />
                <BookingDashboard initialData={initialBookingData} />
              </>
            } />

            <Route path="/fleet" element={
              <div>
                <SEO 
                  title="Our Luxury Fleet | Executive Sedans, SUVs & Vans" 
                  description="Explore our meticulously maintained fleet of luxury Mercedes-Benz sedans, premium SUVs, and executive vans. Choose the perfect high-end vehicle for your next journey with LM Tours."
                />
                <FleetPage onBook={handleBookVehicle} />
                <Footer onGoToBooking={handleGoToBooking} onGoToFleet={handleGoToFleet} onGoToContact={handleGoToContact} />
              </div>
            } />

            <Route path="/about" element={
              <div>
                <SEO 
                  title="About LM Tours | Premium Chauffeur Excellence" 
                  description="Learn about LM Tours' unwavering commitment to excellence in luxury travel. Discover our mission, core values, and the story behind our premium chauffeur services in Johannesburg."
                />
                <AboutPage onBook={handleGoToBooking} />
                <Footer onGoToBooking={handleGoToBooking} onGoToFleet={handleGoToFleet} onGoToContact={handleGoToContact} />
              </div>
            } />

            <Route path="/services" element={
              <div>
                <SEO 
                  title="Our Services | Luxury Airport Transfers & Corporate Travel" 
                  description="From executive corporate travel to personalized VIP tours, discover the wide range of premium services offered by LM Tours. Bespoke travel solutions tailored for every unique need."
                />
                <ServicesPage initialServiceId={initialServiceId} />
                <Footer onGoToBooking={handleGoToBooking} onGoToFleet={handleGoToFleet} onGoToContact={handleGoToContact} />
              </div>
            } />
            
            <Route path="/contact" element={
              <div>
                <SEO 
                  title="Contact LM Tours | 24/7 Premium Concierge Support" 
                  description="Get in touch with the LM Tours concierge team for bespoke travel requirements, immediate support, or to learn more about our premium chauffeur services in Johannesburg and beyond."
                />
                <ContactPage />
                <Footer onGoToBooking={handleGoToBooking} onGoToFleet={handleGoToFleet} onGoToContact={handleGoToContact} />
              </div>
            } />

            <Route path="/chauffeur-service/:locationSlug" element={<LocationPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:articleSlug" element={<ArticlePage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
