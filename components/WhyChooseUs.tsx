
import React from 'react';

const reasons = [
  {
    icon: 'verified_user',
    title: 'Professional Chauffeurs',
    desc: 'Every journey is guided by a fully licensed, trained, and courteous chauffeur committed to your safety and satisfaction.'
  },
  {
    icon: 'diamond',
    title: 'Premium Quality Service',
    desc: 'We deliver a first-class travel experience crafted around comfort, discretion, and thoughtful attention to detail.'
  },
  {
    icon: 'directions_car',
    title: 'Impeccable Fleet',
    desc: 'Our range of vehicles — from executive sedans to luxury vans — offers comfort and style for every need, regularly inspected and sanitized.'
  },
  {
    icon: 'handshake',
    title: 'Client-Centred Approach',
    desc: 'We tailor our transport solutions to your schedule, preferences, and special requirements.'
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-background-light">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">What Makes Us Different</h2>
          <p className="text-charcoal/50 text-sm tracking-[0.2em] uppercase font-bold">The LM Tours Standard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-charcoal/5 hover:border-primary/20 transition-all hover:shadow-xl group">
              <div className="size-14 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined !text-2xl">{r.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-charcoal">{r.title}</h3>
              <p className="text-charcoal/50 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
