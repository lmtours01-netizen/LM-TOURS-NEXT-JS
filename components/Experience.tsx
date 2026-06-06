
import React from 'react';

const features = [
  {
    icon: 'diamond',
    title: 'Premium Quality',
    desc: 'A first-class travel experience crafted around comfort, discretion, and thoughtful attention to detail.'
  },
  {
    icon: 'verified_user',
    title: 'Professional Service',
    desc: 'Fully licensed, trained, and courteous chauffeurs committed to your safety and satisfaction.'
  },
  {
    icon: 'flight_land',
    title: 'Seamless Transfers',
    desc: 'Expertly managed logistics for arrivals at OR Tambo, Lanseria, and private aviation terminals.'
  },
  {
    icon: 'shield',
    title: 'Secure & Reliable',
    desc: 'Rigorous vehicle maintenance and safety protocols for peace of mind on every journey.'
  }
];

const Experience: React.FC = () => {
  return (
    <section id="intro" className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/3">
          <span className="text-accent-gold font-display font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Johannesburg • Gauteng</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-charcoal mb-6">
            Welcome to <br/><span className="text-primary">LM Tours</span>
          </h2>
          <p className="text-charcoal/60 text-lg leading-relaxed mb-8">
            We are a premium ground transport provider based in Johannesburg, dedicated to delivering exceptional travel experiences across Gauteng and beyond. 
          </p>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-8">
            Whether navigating the city for business, attending major events, or requiring discreet diplomatic transport, we prioritise your comfort and professionalism.
          </p>
          <div className="h-[1px] w-24 bg-primary/30"></div>
        </div>
        
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-xl bg-white border border-charcoal/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <span className="material-symbols-outlined !text-4xl text-accent-gold mb-6 block group-hover:scale-110 transition-transform">{f.icon}</span>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-charcoal/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
