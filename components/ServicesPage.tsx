
import React, { useState, useMemo } from 'react';
import ContactCTA from './ContactCTA';
import BookingForm from './BookingForm';
import EnquiryForm from './EnquiryForm';

const servicesData = [
  {
    id: 'airport',
    icon: 'flight_takeoff',
    title: 'Airport Transfers',
    description: 'LM Tours offers premium airport transfers to and from OR Tambo International Airport, Lanseria International Airport, and private aviation terminals. Our chauffeur-driven service ensures seamless pickups and drop-offs, flight monitoring, meet-and-greet assistance, and direct door-to-door transport across Johannesburg, Pretoria, and greater Gauteng.',
    type: 'book'
  },
  {
    id: 'inner-city',
    icon: 'location_city',
    title: 'Inner City Transfers',
    description: 'Our inner city transfer service provides private, point-to-point transportation throughout Johannesburg and surrounding urban areas. Ideal for business meetings, hotel transfers, shopping, and daily travel, this service delivers efficient mobility with professional chauffeurs and high-end vehicles.',
    type: 'book'
  },
  {
    id: 'corporate',
    icon: 'business_center',
    title: 'Corporate Transfers',
    description: 'LM Tours delivers executive corporate transfer solutions tailored for professionals and organisations. From airport pickups to client meetings and corporate events, our service supports punctual, discreet, and polished travel that reflects business professionalism.',
    type: 'enquire'
  },
  {
    id: 'event',
    icon: 'celebration',
    title: 'Event Transfers',
    description: 'Our event transfer service provides coordinated, luxury transport for weddings, conferences, concerts, and private functions. With precise scheduling and chauffeur-led service, LM Tours ensures smooth arrivals, seamless logistics, and a refined travel experience for every guest.',
    type: 'enquire'
  },
  {
    id: 'diplomatic',
    icon: 'gavel',
    title: 'Diplomatic Transfers',
    description: 'LM Tours provides discreet diplomatic transfer services for embassies, consulates, government officials, and international delegations. This service prioritises privacy, precision, and professional chauffeur conduct for high-level travel requirements.',
    type: 'enquire'
  },
  {
    id: 'chauffeur',
    icon: 'person_pin',
    title: 'Chauffeur Drive',
    description: 'Our chauffeur drive service offers flexible, private transport by the hour or full day. Ideal for executives, VIPs, and personalised itineraries, this service combines premium vehicles with dedicated professional drivers for complete travel control.',
    type: 'enquire'
  },
  {
    id: 'door-to-door',
    icon: 'door_front',
    title: 'Door-to-Door Transfers',
    description: 'LM Tours offers direct door-to-door transfer services between any two locations. This private transport solution eliminates shared rides and unnecessary stops, ensuring a smooth, uninterrupted journey tailored to your schedule.',
    type: 'enquire'
  },
  {
    id: 'gautrain',
    icon: 'train',
    title: 'Gautrain Point-to-Point Transfers',
    description: 'Our Gautrain point-to-point transfer service connects Gautrain stations with airports, hotels, offices, and residential areas. Designed for efficiency and convenience, it provides seamless integration between rail travel and private chauffeur transport.',
    type: 'enquire'
  }
];

interface ServicesPageProps {
  initialServiceId?: string | null;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ initialServiceId }) => {
  const [activeServiceId, setActiveServiceId] = useState(initialServiceId || servicesData[0].id);

  const activeService = useMemo(() => 
    servicesData.find(s => s.id === activeServiceId), 
    [activeServiceId]
  );

  return (
    <div className="bg-background-light min-h-screen text-charcoal pt-24 font-sans">
      
      {/* Header Section */}
      <section className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto text-center">
        <span className="text-primary font-display font-bold tracking-[0.3em] uppercase text-xs mb-6 block">World-Class Standards</span>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-charcoal mb-8 leading-tight">
          Bespoke Transport <span className="text-accent-gold font-light italic">Solutions</span>
        </h1>
        <p className="text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          From high-frequency corporate shuttles to bespoke event logistics, we engineer mobility solutions that honor your time, safety, and reputation across Gauteng.
        </p>
      </section>

      {/* Main Services Content with Sidebar */}
      <section className="py-12 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Sidebar Navigation - changes to horizontal scroll on mobile */}
          <aside className="md:w-1/3 lg:w-1/4">
            <nav className="md:sticky md:top-32">
              <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-4 md:pb-0">
                {servicesData.map(service => (
                  <li key={service.id} className="shrink-0">
                    <button 
                      onClick={() => setActiveServiceId(service.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 text-sm font-bold flex items-center gap-4 ${
                        activeServiceId === service.id 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-white hover:bg-primary/5 hover:text-primary text-charcoal/70'
                      }`}
                    >
                       <span className={`material-symbols-outlined transition-colors duration-300 ${activeServiceId === service.id ? 'text-white' : 'text-accent-gold'}`}>{service.icon}</span>
                      <span className="whitespace-nowrap">{service.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-h-[400px]">
            {activeService && (
              <div key={activeService.id} className="bg-white p-8 lg:p-12 rounded-xl border border-charcoal/5 shadow-xl fade-in">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="size-14 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined !text-3xl">{activeService.icon}</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-charcoal">
                      {activeService.title}
                    </h2>
                 </div>
                <p className="text-charcoal/70 leading-relaxed">
                  {activeService.description}
                </p>

                {/* Conditional Rendering of Form/Enquiry */}
                {activeService.type === 'book' ? <BookingForm /> : <EnquiryForm />}

              </div>
            )}
          </main>
        </div>
      </section>

      {/* CTA - Reusing existing component */}
      <ContactCTA />
      
      <style>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
