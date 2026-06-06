
import React from 'react';

interface AboutPageProps {
  onBook: () => void;
}

const coreValues = [
  {
    icon: 'verified',
    title: 'Excellence',
    desc: 'We deliver quality in every interaction, from the moment you book to your final destination.'
  },
  {
    icon: 'handshake',
    title: 'Integrity',
    desc: 'Transparency and honesty guide our service delivery. You can trust us to be professional and fair.'
  },
  {
    icon: 'diversity_3',
    title: 'Respect',
    desc: 'We treat every client with dignity and professionalism, valuing your time and comfort.'
  },
  {
    icon: 'bolt',
    title: 'Responsiveness',
    desc: 'Prompt, attentive support from booking to completion. We are always just a call away.'
  }
];

const AboutPage: React.FC<AboutPageProps> = ({ onBook }) => {
  return (
    <div className="bg-background-light min-h-screen text-charcoal pt-24 font-sans">
      
      {/* Header Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-[1000px] mx-auto text-center">
          <span className="text-accent-gold font-display font-bold tracking-[0.4em] uppercase text-xs mb-6 block">About LM Tours</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
            Premium Chauffeur <span className="italic font-light">Excellence</span>
          </h1>
          <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            LM Tours is a leading ground transport provider in Johannesburg, dedicated to delivering exceptional travel experiences across Gauteng. We redefine the journey through precision, privacy, and unparalleled comfort.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-white border-y border-charcoal/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 bg-background-light rounded-2xl border border-charcoal/5">
            <span className="material-symbols-outlined text-primary !text-4xl mb-6">flag</span>
            <h3 className="text-2xl font-display font-bold mb-4">Our Mission</h3>
            <p className="text-charcoal/70 leading-relaxed">
              To provide seamless, professional, and personalised transport services that exceed the expectations of business professionals, leisure travellers, diplomats, and discerning clients across Johannesburg, Gauteng, and South Africa.
            </p>
          </div>
          <div className="p-10 bg-charcoal text-white rounded-2xl shadow-xl">
            <span className="material-symbols-outlined text-accent-gold !text-4xl mb-6">visibility</span>
            <h3 className="text-2xl font-display font-bold mb-4">Our Vision</h3>
            <p className="text-white/70 leading-relaxed">
              To be recognised as the leading provider of high-quality, client-centred ground transport — where every journey reflects comfort, reliability, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story / Company Profile */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
               <img 
                 src="https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/lm%20tours%20pic.jpeg" 
                 alt="Luxury Travel" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-3 rounded-lg">
                 <p className="text-xs font-bold uppercase tracking-widest text-charcoal">Johannesburg • South Africa</p>
               </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-display font-bold mb-8">Who We Are</h2>
            <div className="space-y-6 text-charcoal/70 text-lg leading-relaxed">
              <p>
                LM Tours was founded with a singular focus: to create seamless journeys for travellers. Whether you are arriving at OR Tambo or Lanseria Airports, navigating the city for business meetings, attending major events, or requiring secure transport for diplomatic travel, we are your trusted partner.
              </p>
              <p>
                We differentiate ourselves through a client-centred approach. Every aspect of our service, from our modern, impeccably maintained fleet to our professional chauffeurs, is designed around your schedule, preferences, and safety.
              </p>
              <p>
                At LM Tours, every transfer is more than just a ride — it is a tailored travel experience driven by professionalism, comfort, and a commitment to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 bg-charcoal text-white">
        <div className="max-w-[1200px] mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold mb-4">Our Core Values</h2>
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Guiding Principles</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {coreValues.map((val, idx) => (
               <div key={idx} className="p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                 <span className="material-symbols-outlined text-accent-gold !text-4xl mb-4 group-hover:scale-110 transition-transform">{val.icon}</span>
                 <h4 className="font-bold text-lg mb-2">{val.title}</h4>
                 <p className="text-white/50 text-sm leading-relaxed">{val.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Social Proof / Testimonial */}
      <section className="py-20 px-6 bg-background-light">
        <div className="max-w-[1000px] mx-auto text-center">
          <p className="text-charcoal/40 text-xs font-bold uppercase tracking-[0.3em] mb-12">Trusted across Gauteng</p>
          
          <div className="mt-8 relative p-10 bg-white rounded-2xl shadow-xl border border-charcoal/5">
            <span className="material-symbols-outlined !text-6xl text-accent-gold/20 absolute top-6 left-8">format_quote</span>
            <blockquote className="text-xl md:text-2xl font-display italic text-charcoal/80 relative z-10">
              "LM Tours has completely transformed how our executive team navigates the city. It's not just a shuttle; it's an extension of our boardroom."
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-charcoal rounded-full"></div>
              <div className="text-left">
                <p className="text-xs font-bold text-charcoal">Julian Thorne</p>
                <p className="text-[10px] text-charcoal/50 uppercase tracking-widest">Global Director, Aeris Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to experience the difference?</h2>
          <p className="text-charcoal/60 text-lg mb-10">
            Book your journey with LM Tours today and travel with peace of mind.
          </p>
          <button 
            onClick={onBook}
            className="h-16 px-12 rounded-xl bg-primary text-white font-bold tracking-widest uppercase text-sm hover:bg-charcoal hover:shadow-xl transition-all active:scale-95"
          >
            Book Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
