import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from './SEO';
import Footer from './Footer';
import RevealSection from './RevealSection';
import ContactCTA from './ContactCTA';

interface LocationData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  highlights: string[];
  image: string;
}

const locations: Record<string, LocationData> = {
  'sandton': {
    name: 'Sandton',
    slug: 'sandton',
    description: 'Premium chauffeur services in Africa\'s richest square mile, ideal for business and luxury lifestyle.',
    longDescription: 'Sandton is the undisputed corporate heart of Johannesburg, a high-octane district where time is the most valuable currency. LM Tours provides executive transport solutions that match the prestige and pace of this financial powerhouse. Whether you are attending high-level board meetings at the Sandton Convention Centre, staying at world-renowned luxury hotels like The Saxon or The Michelangelo, or navigating the upscale boutiques of Sandton City, our professional chauffeurs ensure your journey is seamless, secure, and impeccably timed. We understand the nuances of Sandton\'s traffic patterns and the specific security requirements of high-profile executives, making us the preferred choice for discerning professionals who demand excellence in every mile.',
    highlights: [
      'Executive Airport Transfers to OR Tambo (International & Domestic)',
      'Point-to-Point Corporate Travel for Board Meetings & Conferences',
      'Luxury Shopping Excursions in Sandton City & Nelson Mandela Square',
      'Secure VIP Chauffeur Services with Professional Protection Options',
      'Bespoke Transport for High-End Events & Gala Dinners'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp'
  },
  'pretoria': {
    name: 'Pretoria',
    slug: 'pretoria',
    description: 'Luxury transport for diplomats and corporate clients in South Africa\'s administrative capital.',
    longDescription: 'As the administrative capital of South Africa and a major diplomatic hub, Pretoria requires a level of transport sophistication that LM Tours is uniquely equipped to provide. We specialize in diplomatic transfers, secure government transport, and corporate travel between Johannesburg and Pretoria. Our chauffeurs are well-versed in the protocols of embassy districts and government precincts, ensuring a discreet and professional experience for our most high-profile clients. From the historic Union Buildings to the modern corporate offices in Menlyn, we provide a reliable, climate-controlled sanctuary for your travels, allowing you to focus on your mission while we handle the complexities of the road.',
    highlights: [
      'Diplomatic & Government Transfers with Protocol Awareness',
      'Inter-City Executive Travel between Joburg and Pretoria',
      'Embassy & Consulate Transport for International Delegations',
      'Historical & Cultural Site Tours (Union Buildings, Voortrekker Monument)',
      'Secure Transport for International Summits & Conferences'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/57rtghjT689.webp'
  },
  'rosebank': {
    name: 'Rosebank',
    slug: 'rosebank',
    description: 'Bespoke chauffeur services in Rosebank, Johannesburg\'s vibrant hub for art, culture, and business.',
    longDescription: 'Rosebank is a bustling cosmopolitan hub that blends corporate efficiency with a vibrant cultural scene. Our chauffeur services are designed to help you navigate its tree-lined streets and modern developments with absolute ease. From the Rosebank Gautrain station to the many contemporary art galleries, boutique hotels, and corporate headquarters, LM Tours offers the perfect blend of luxury and urban agility. We cater to creative professionals, business travelers, and leisure seekers who appreciate the finer details of travel. Whether you need a quick transfer to a gallery opening or a full day of chauffeured travel for a series of meetings, our team ensures your experience in Rosebank is sophisticated, comfortable, and entirely stress-free.',
    highlights: [
      'Gautrain Station Transfers for Seamless Rail-to-Road Transitions',
      'Boutique Hotel Transport for Discerning Guests',
      'Art & Culture Tours (Everard Read, Circa Gallery)',
      'Professional Business Travel for Rosebank\'s Corporate Hub',
      'Luxury Dining Transfers to Rosebank\'s Top Restaurants'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-pavel-danilyuk-8425057.webp'
  },
  'waterfall': {
    name: 'Waterfall City',
    slug: 'waterfall',
    description: 'Elite transport solutions in the rapidly growing corporate and lifestyle precinct of Waterfall City.',
    longDescription: 'Waterfall City has emerged as one of South Africa\'s most prestigious and rapidly growing corporate precincts. Home to global headquarters and the iconic Mall of Africa, this area demands a transport service that reflects its modern, high-tech identity. LM Tours provides elite chauffeur services tailored to the needs of the professionals and residents of Waterfall. We offer seamless transfers to the many corporate parks, luxury residential estates, and the vibrant retail heart of the precinct. Our fleet of modern, high-specification vehicles is the perfect match for Waterfall\'s forward-thinking environment, providing a productive and luxurious space for you to prepare for your next meeting or relax after a busy day.',
    highlights: [
      'Corporate Transfers to Global Headquarters in Waterfall',
      'Luxury Shopping Transfers to the Mall of Africa',
      'Secure Residential Estate Chauffeur Services',
      'Event Transport for Waterfall\'s Modern Venues',
      'Efficient Commutes to Nearby Midrand & Sandton'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp'
  },
  'midrand': {
    name: 'Midrand',
    slug: 'midrand',
    description: 'Professional chauffeur services in the strategic business corridor connecting Joburg and Pretoria.',
    longDescription: 'Strategically located between Johannesburg and Pretoria, Midrand is a critical business corridor and a hub for the pharmaceutical, telecommunications, and logistics industries. LM Tours provides professional chauffeur services that bridge the gap between these two major cities, offering a reliable and luxurious alternative to self-driving or standard ride-hailing. We understand the importance of punctuality in this fast-paced environment and our chauffeurs are experts at navigating the N1 corridor. Whether you are visiting Grand Central Airport, attending a trade show at Gallagher Convention Centre, or meeting clients in the many business parks, we provide a consistent, high-quality service that enhances your professional image and productivity.',
    highlights: [
      'Strategic Inter-City Transfers (Joburg - Midrand - Pretoria)',
      'Gallagher Convention Centre Event Transport',
      'Grand Central Airport Private Transfers',
      'Corporate Park Commutes for Visiting Executives',
      'Reliable Transport for Midrand\'s Industrial & Tech Hubs'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/57rtghjT689.webp'
  },
  'centurion': {
    name: 'Centurion',
    slug: 'centurion',
    description: 'Premium executive transport in the thriving business and residential hub of Centurion, Gauteng.',
    longDescription: 'Centurion is a thriving hub that perfectly balances corporate growth with high-end residential living. As a key link between Pretoria and Midrand, it attracts a diverse range of business professionals and families who demand quality and reliability. LM Tours offers premium executive transport in Centurion, providing a sophisticated way to navigate its business districts, shopping centers, and sports venues. From transfers to the Centurion Gautrain station to secure transport for international cricket matches at SuperSport Park, our services are designed to meet the highest standards of comfort and safety. We pride ourselves on our local knowledge and our ability to provide a personalized service that caters to the unique needs of the Centurion community.',
    highlights: [
      'Centurion Gautrain Station Executive Transfers',
      'SuperSport Park VIP Event Transport',
      'Corporate Travel for Centurion\'s Business Districts',
      'Secure Residential Estate Chauffeur Services',
      'Seamless Commutes to Pretoria & Midrand'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-pavel-danilyuk-8425057.webp'
  },
  'lanseria': {
    name: 'Lanseria',
    slug: 'lanseria',
    description: 'Exclusive airport transfers at Lanseria International Airport, the gateway to luxury travel.',
    longDescription: 'Lanseria International Airport is the preferred choice for many private jet owners and commercial travelers seeking a more efficient and discreet airport experience. LM Tours provides exclusive airport transfers at Lanseria, specializing in tarmac-to-vehicle services for private aviation and premium meet-and-greet for commercial flights. We understand that travelers choosing Lanseria value their time and privacy above all else. Our chauffeurs are meticulously prepared for your arrival, ensuring a smooth transition from the aircraft to your final destination. Whether you are heading to a luxury lodge, a corporate meeting in Sandton, or a private residence, we provide a seamless, high-end experience that begins the moment you touch down.',
    highlights: [
      'Private Aviation Tarmac-to-Vehicle Transfers',
      'Premium Commercial Meet-and-Greet Services',
      'Discreet Transport for High-Profile Travelers',
      'Efficient Transfers to Sandton, Pretoria & Beyond',
      'Luxury Lodge & Safari Connection Transfers'
    ],
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp'
  }
};

const LocationPage: React.FC = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const location = locationSlug ? locations[locationSlug] : null;

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light pt-32 px-6 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Location Not Found</h1>
        <p className="text-charcoal/60 mb-8">We couldn't find the location you're looking for.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen pt-24 font-sans">
      <SEO 
        title={`Chauffeur Service ${location.name}`} 
        description={`${location.description} Book your luxury transfer in ${location.name} with LM Tours.`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `Chauffeur Service in ${location.name}`,
          "provider": {
            "@type": "Organization",
            "name": "LM Tours"
          },
          "areaServed": {
            "@type": "City",
            "name": location.name
          },
          "description": location.description
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 opacity-30">
          <img src={location.image} alt={location.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-[1000px] mx-auto text-center">
          <span className="text-accent-gold font-display font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Location Spotlight</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
            Chauffeur Service <span className="italic font-light">{location.name}</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            {location.description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <RevealSection variant="fade-up">
              <h2 className="text-4xl font-display font-bold mb-8">Premium Transport in {location.name}</h2>
              <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
                {location.longDescription}
              </p>
              <p className="text-charcoal/70 text-lg leading-relaxed mb-10">
                At LM Tours, we understand that every journey is unique. Our services in {location.name} are tailored to your specific requirements, providing the privacy, safety, and comfort you expect from a world-class chauffeur service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking" className="bg-primary text-white px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-charcoal transition-all">Book in {location.name}</Link>
                <Link to="/fleet" className="border border-charcoal/20 text-charcoal px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-charcoal hover:text-white transition-all">View Fleet</Link>
              </div>
            </RevealSection>
          </div>
          <div className="lg:w-1/2">
            <RevealSection variant="fade-in">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-charcoal/5">
                <h3 className="text-2xl font-display font-bold mb-8 text-primary">Service Highlights</h3>
                <ul className="space-y-6">
                  {location.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-accent-gold mt-1">verified</span>
                      <span className="text-charcoal/80 font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Other Locations */}
      <section className="py-24 px-6 bg-white border-t border-charcoal/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Other Service Areas</h2>
            <p className="text-charcoal/50 text-sm font-bold uppercase tracking-widest">Explore our reach</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(locations).filter(l => l.slug !== location.slug).map((l) => (
              <Link key={l.slug} to={`/chauffeur-service/${l.slug}`} className="group block bg-background-light p-8 rounded-xl border border-charcoal/5 hover:border-primary transition-all">
                <h4 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{l.name}</h4>
                <p className="text-charcoal/60 text-sm mb-6 line-clamp-2">{l.description}</p>
                <span className="text-primary font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                  Explore Location <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
      <Footer onGoToBooking={() => {}} onGoToFleet={() => {}} onGoToContact={() => {}} />
    </div>
  );
};

export default LocationPage;
