
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const EnquiryForm: React.FC = () => {
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
    <div className="mt-8 pt-8 border-t border-charcoal/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form */}
        <div>
          <h3 className="text-xl font-display font-bold text-charcoal mb-6">Make an Enquiry</h3>
          
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
              <span className="material-symbols-outlined !text-4xl mb-2">check_circle</span>
              <h4 className="font-bold text-lg">Message Sent</h4>
              <p className="text-sm">Thank you! Our team will get back to you shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs font-bold underline text-green-800 hover:text-green-600"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  className="w-full bg-background-light border-none rounded-lg h-12 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email" 
                    className="w-full bg-background-light border-none rounded-lg h-12 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone" 
                    className="w-full bg-background-light border-none rounded-lg h-12 text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your requirements..." 
                  rows={4} 
                  className="w-full bg-background-light border-none rounded-lg text-sm focus:ring-1 focus:ring-primary placeholder:text-charcoal/30 font-medium p-4"
                ></textarea>
              </div>
              
              {status === 'error' && (
                <p className="text-red-500 text-xs">{errorMessage}</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full h-14 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-charcoal transition-all shadow-lg shadow-primary/20 text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
        
        {/* Contact Details */}
        <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
          <h3 className="text-xl font-display font-bold text-primary mb-6">Contact Us Directly</h3>
          <p className="text-charcoal/70 mb-6 text-sm">
            For immediate assistance or complex bookings, please feel free to contact our concierge team directly.
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">call</span>
              <div>
                <span className="font-bold text-charcoal">+27 83 576 5000</span>
                <span className="block text-charcoal/50 text-xs">Phone Support</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">mail</span>
              <div>
                <span className="font-bold text-charcoal">booking@lmtours.co.za</span>
                <span className="block text-charcoal/50 text-xs">Email Enquiries</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-1">location_on</span>
              <div>
                <span className="font-bold text-charcoal">2107, Johannesburg, South Africa</span>
                <span className="block text-charcoal/50 text-xs">Head Office</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;
