
import React from 'react';

const Testimonial: React.FC = () => {
  return (
    <section className="py-32 px-6 bg-background-light">
      <div className="max-w-[800px] mx-auto text-center">
        <span className="material-symbols-outlined !text-6xl text-accent-gold/40 mb-10">format_quote</span>
        <blockquote className="text-2xl md:text-4xl font-display italic font-light text-charcoal leading-relaxed mb-12">
          "LM Tours has completely transformed how our executive team navigates the city. It's not just a shuttle; it's an extension of our boardroom."
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div 
            className="size-14 rounded-full bg-cover shadow-lg" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_0m_7Bo9iAtdvFkPjnRsZ_DY6WUWUbSb1vOOZrJ2B2OxBkXDivKzXeyhILzRO2m9dop8CE_lEoMD6E0Squso0T70XvJ3sq7kKHG0Ki4xqi82bhDTgiTXbRobX3CuMERqzee8QtR0PN3m-mj4VnhtTHBed-cVM4_bwMQAJz-yo_LCWlUNDgTlfUs1te8XkhYTy1ZWK0gKthywGU06-IbqlInw7_T6uE3woJ1krbsOvbx4DfKREv2qvYeMswXuJRgWnVufMx9PFHjAp")' }}
          />
          <div className="text-left">
            <p className="font-bold text-charcoal text-lg tracking-tight">Julian Thorne</p>
            <p className="text-[10px] text-charcoal/40 uppercase font-bold tracking-[0.2em]">Global Director, Aeris Group</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
