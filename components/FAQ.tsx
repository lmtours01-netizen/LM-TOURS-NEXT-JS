
import React, { useState } from 'react';

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We require all bookings to be made at least 48 hours (2 days) in advance to ensure vehicle availability and service excellence."
  },
  {
    q: "Are the vehicles equipped for business?",
    a: "Absolutely. Every vehicle in our fleet features secure high-speed Wi-Fi, power outlets, and a climate-controlled environment optimized for productivity."
  },
  {
    q: "What is your cancellation policy?",
    a: "You cannot cancel 24 hours before the trip. Cancellations made within 24 hours of the scheduled pickup time are non-refundable."
  },
  {
    q: "Do you offer airport tarmac transfers?",
    a: "Yes, we have specialized permits for direct tarmac-to-vehicle transfers at major private aviation terminals globally."
  }
];

interface FAQProps {
  bgClass?: string;
}

const FAQ: React.FC<FAQProps> = ({ bgClass = "bg-background-light" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={`py-24 px-6 ${bgClass}`}>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-charcoal mb-4">FAQ</h2>
          <p className="text-charcoal/50 text-sm tracking-[0.2em] uppercase font-bold">Answers to your essentials</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-charcoal/10 pb-4">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className={`text-lg font-bold transition-colors ${openIndex === idx ? 'text-primary' : 'text-charcoal/80 group-hover:text-primary'}`}>
                  {faq.q}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : 'text-charcoal/30'}`}>
                  expand_more
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <p className="text-charcoal/60 leading-relaxed text-sm pb-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;