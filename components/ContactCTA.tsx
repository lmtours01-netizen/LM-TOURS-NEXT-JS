
import React from 'react';

const ContactCTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-primary text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Still have questions?</h2>
        <p className="text-white/70 text-lg max-w-2xl mb-12 leading-relaxed">
          Our dedicated team is available to assist with complex itineraries, group logistics, or bespoke travel requirements across Gauteng.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <a href="tel:+27835765000" className="flex items-center justify-center h-16 px-12 rounded-xl bg-white text-primary font-bold tracking-widest uppercase text-xs hover:bg-accent-gold hover:text-white transition-all shadow-xl active:scale-95">
            Call Now
          </a>
          <a href="mailto:booking@lmtours.co.za" className="flex items-center justify-center h-16 px-12 rounded-xl border border-white/30 text-white font-bold tracking-widest uppercase text-xs hover:bg-white/10 transition-all active:scale-95">
            Email Us
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-white/60">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined !text-3xl">call</span>
            <span className="text-sm font-bold">+27 83 576 5000</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined !text-3xl">mail</span>
            <span className="text-sm font-bold">booking@lmtours.co.za</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined !text-3xl">location_on</span>
            <span className="text-sm font-bold">2107, Johannesburg, ZA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
