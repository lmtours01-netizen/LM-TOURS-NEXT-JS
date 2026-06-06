
import React from 'react';

interface ServicesListProps {
  onSelectService: (serviceId: string) => void;
}

const services = [
  {
    id: 'airport',
    title: 'Airport Transfers',
    description: 'LM Tours offers premium airport transfers to and from OR Tambo International Airport, Lanseria International Airport, and private aviation terminals.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp'
  },
  {
    id: 'inner-city',
    title: 'Inner City Transfers',
    description: 'Our inner city transfer service provides private, point-to-point transportation throughout Johannesburg and surrounding urban areas.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/57rtghjT689.webp'
  },
  {
    id: 'corporate',
    title: 'Corporate Transfers',
    description: 'LM Tours delivers executive corporate transfer solutions tailored for professionals and organisations.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-pavel-danilyuk-8425057.webp'
  }
];

const ServicesList: React.FC<ServicesListProps> = ({ onSelectService }) => {
  return (
    <section className="py-24 px-6 bg-white border-t border-charcoal/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Our Services</h2>
          <p className="text-charcoal/50 text-sm tracking-[0.2em] uppercase font-bold">Tailored solutions for every journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => onSelectService(service.id)}>
              <div className="overflow-hidden rounded-xl mb-6 shadow-md aspect-[4/3]">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-charcoal/60 leading-relaxed text-sm pr-4">
                {service.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <span>Learn More</span>
                <span className="material-symbols-outlined !text-sm">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
