
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FAQ from './FAQ';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!formData.full_name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([formData]);

      if (error) throw error;

      setStatus('success');
      setFormData({ full_name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit enquiry.');
    }
  };

  return (
    <div className="bg-background-light min-h-screen text-charcoal pt-24 font-sans">
      {/* Header Section */}
      <section className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto text-center">
        <span className="text-primary font-display font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Get in Touch</span>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-charcoal mb-8 leading-tight">
          Contact Our <span className="text-accent-gold font-light italic">Concierge</span>
        </h1>
        <p className="text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Our dedicated concierge team is available 24/7 to assist with bespoke travel requirements, complex itineraries, or immediate support across Johannesburg.
        </p>
      </section>

      {/* Main Content */}
      <section className="px-6 max-w-[1200px] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8">
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-charcoal/5">
                <h3 className="text-2xl font-display font-bold text-charcoal mb-8">Headquarters</h3>
                <div className="space-y-8">
                    <div className="flex items-start gap-5">
                        <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                            <span className="material-symbols-outlined">location_on</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-charcoal text-lg">Johannesburg</h4>
                            <p className="text-charcoal/60 leading-relaxed text-sm mt-1">
                                2107, Johannesburg<br/>
                                Gauteng, South Africa
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                            <span className="material-symbols-outlined">call</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-charcoal text-lg">Phone</h4>
                            <p className="text-charcoal/60 leading-relaxed text-sm mt-1">
                                <a href="tel:+27835765000" className="hover:text-primary transition-colors font-medium">+27 83 576 5000</a>
                                <span className="block text-xs text-charcoal/40 mt-1 uppercase tracking-wider font-bold">Available 24/7</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-charcoal text-lg">Email</h4>
                            <p className="text-charcoal/60 leading-relaxed text-sm mt-1">
                                <a href="mailto:booking@lmtours.co.za" className="hover:text-primary transition-colors font-medium">booking@lmtours.co.za</a>
                            </p>
                        </div>
                    </div>
                </div>
             </div>

             {/* Map */}
             <div className="h-80 w-full bg-gray-200 rounded-2xl overflow-hidden border border-charcoal/5 grayscale hover:grayscale-0 transition-all duration-700 shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114584.73898687394!2d27.99446700778641!3d-26.171504569502753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sJohannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
             </div>
          </div>

          {/* Right Column: Form */}
          <div>
             <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-2xl border border-charcoal/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <h3 className="text-3xl font-display font-bold text-charcoal mb-2">Send a Message</h3>
                <p className="text-charcoal/50 text-sm mb-8">Direct line to our concierge desk.</p>
                
                {status === 'success' ? (
                    <div className="bg-booking-primary-light border border-booking-primary text-booking-primary rounded-xl p-8 text-center animate-in fade-in zoom-in">
                      <span className="material-symbols-outlined !text-5xl mb-4">check_circle</span>
                      <h4 className="font-bold text-xl mb-2">Message Sent Successfully</h4>
                      <p className="text-sm opacity-80 mb-6">Thank you for contacting us. A member of our concierge team will respond to your enquiry shortly.</p>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="text-xs font-bold uppercase tracking-widest underline hover:no-underline"
                      >
                        Send another message
                      </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input 
                              type="text" 
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleChange}
                              placeholder="e.g. Jonathan Reed" 
                              className="w-full bg-background-light border-none rounded-xl h-14 px-4 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium transition-all" 
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                              <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com" 
                                className="w-full bg-background-light border-none rounded-xl h-14 px-4 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                              <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+27 ..." 
                                className="w-full bg-background-light border-none rounded-xl h-14 px-4 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium transition-all" 
                              />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Your Message</label>
                            <textarea 
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="How can we assist you today?" 
                              rows={5} 
                              className="w-full bg-background-light border-none rounded-xl text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium p-4 transition-all resize-none"
                            ></textarea>
                        </div>
                        
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2">
                                <span className="material-symbols-outlined !text-base">error</span>
                                {errorMessage}
                            </div>
                        )}
    
                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="w-full h-16 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl text-xs tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {status === 'submitting' ? 'Sending Message...' : 'Submit Enquiry'}
                            {!status.includes('submitting') && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                        </button>
                    </form>
                )}
             </div>
          </div>
        </div>
      </section>
      
      <FAQ bgClass="bg-white" />
    </div>
  );
};

export default ContactPage;
