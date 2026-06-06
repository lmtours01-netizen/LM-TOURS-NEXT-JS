
import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        <div className="md:w-1/2 relative order-2 md:order-1">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
            <img 
              src="https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/05e4b3f2-e118-4fb2-91ad-c869e04cd182.jpg" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 z-0 w-2/3 h-2/3 border-2 border-accent-gold/20 rounded-2xl hidden md:block"></div>
        </div>
        
        <div className="md:w-1/2 order-1 md:order-2">
          <span className="text-accent-gold font-display font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Premium Transport</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-8 leading-tight">About LM Tours</h2>
          <p className="text-charcoal/60 text-lg leading-relaxed mb-6">
            LM Tours is a premium ground transport provider based in Johannesburg, South Africa, dedicated to delivering exceptional travel experiences across Gauteng and beyond.
          </p>
          <p className="text-charcoal/60 text-lg leading-relaxed mb-10">
             We specialise in luxury transfers, chauffeur services, corporate travel, and tailored transport solutions that prioritise comfort, professionalism, and personalised service. Whether you’re arriving at OR Tambo, navigating the city for business, or requiring discreet transport for VIP travel, we ensure a seamless journey.
          </p>
          <div className="mb-10">
            <Link to="/services" className="text-primary font-bold text-sm tracking-widest uppercase hover:underline flex items-center gap-2">
              Explore Our Services
              <span className="material-symbols-outlined !text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex items-center gap-12">
            <div>
              <span className="block text-3xl font-bold text-primary mb-1">JHB</span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Based</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-primary mb-1">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Reliable</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-primary mb-1">5★</span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
