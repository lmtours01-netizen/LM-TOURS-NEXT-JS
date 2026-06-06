
import React from 'react';

const Mission: React.FC = () => {
  return (
    <section className="relative py-32 bg-charcoal overflow-hidden text-center">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/2e7be49b-f44a-435e-857f-7513f20c9c19.jpg" 
          alt="Night City" 
          className="w-full h-full object-cover grayscale"
        />
      </div>
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <h2 className="text-accent-gold font-display font-bold tracking-[0.4em] uppercase text-[10px] mb-8">Our Mission</h2>
        <p className="text-white text-2xl md:text-3xl font-display font-light italic leading-relaxed mb-12">
          "To provide seamless, professional, and personalised transport services that exceed the expectations of business professionals, leisure travellers, diplomats, and discerning clients across Johannesburg, Gauteng, and South Africa."
        </p>
        <div className="w-16 h-[2px] bg-white/20 mx-auto"></div>
      </div>
    </section>
  );
};

export default Mission;
