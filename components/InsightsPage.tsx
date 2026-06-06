import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import Footer from './Footer';
import RevealSection from './RevealSection';
import ContactCTA from './ContactCTA';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Luxury Travel in Johannesburg',
    slug: 'luxury-travel-johannesburg-guide',
    excerpt: 'Discover the hidden gems, luxury hotels, and premium transport options for the discerning traveler in Johannesburg. Our guide covers everything from Sandton boutiques to historic Westcliff.',
    content: 'Johannesburg, the vibrant heart of South Africa, is a city of contrasts and hidden luxuries. For the discerning traveler, navigating this sprawling metropolis requires more than just a map; it requires a curated approach to travel. From the high-end boutiques of Sandton to the historic charm of Westcliff, Johannesburg offers a wealth of experiences for those who seek the finer things in life.\n\nAt LM Tours, we believe that your journey should be as exceptional as your destination. Our premium chauffeur services are designed to provide the ultimate in comfort, safety, and style, ensuring that you can experience the best of Johannesburg without compromise. When planning your luxury stay, consider the iconic Saxon Hotel, Villas and Spa, or the Four Seasons Hotel The Westcliff, both of which offer unparalleled service and breathtaking views.\n\nFor shopping, the Diamond Walk in Sandton City is a must-visit, featuring global brands like Louis Vuitton, Prada, and Gucci. However, the true luxury of Johannesburg lies in its stories and its people. A private guided tour of the Apartheid Museum or a visit to the contemporary art galleries in Rosebank can provide a deep and meaningful connection to the city\'s heritage. Whatever your itinerary, LM Tours is here to ensure that every transition is seamless, allowing you to focus on the moments that matter.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp',
    date: 'March 20, 2026',
    author: 'LM Tours Editorial',
    category: 'Travel Guide'
  },
  {
    id: '2',
    title: 'Corporate Travel Safety: A Guide for Executives',
    slug: 'corporate-travel-safety-guide',
    excerpt: 'Ensuring the safety and security of your executive team is paramount. Learn the best practices for secure corporate travel, from airport transfers to situational awareness.',
    content: 'In today\'s global business environment, corporate travel is essential, but it also comes with unique risks. For executives and high-profile professionals, safety and security are not just luxuries—they are necessities. At LM Tours, we prioritize the security of our clients above all else. Our chauffeurs are trained in defensive driving and situational awareness, and our fleet is meticulously maintained to ensure the highest standards of safety.\n\nIn this guide, we explore the key considerations for secure corporate travel, from choosing the right transport partner to implementing comprehensive travel policies. One of the most critical aspects of executive safety is the "last mile" of the journey. While international flights are generally secure, the transition from the airport to the hotel or office is often where travelers are most vulnerable. A professional chauffeur service provides a secure, vetted environment from the moment you land.\n\nFurthermore, real-time tracking and communication are essential. At LM Tours, we use advanced dispatch and tracking systems to monitor every journey, providing peace of mind for both the traveler and their corporate security team. By investing in professional ground transport, companies can significantly reduce the risks associated with business travel and ensure their most valuable assets—their people—are protected.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/57rtghjT689.webp',
    date: 'March 25, 2026',
    author: 'LM Tours Security Team',
    category: 'Corporate'
  },
  {
    id: '3',
    title: 'Top 5 Private Aviation Terminals in South Africa',
    slug: 'private-aviation-terminals-south-africa',
    excerpt: 'Explore the most exclusive private aviation terminals in South Africa and how to ensure a seamless transition from your private aircraft to a luxury chauffeur-driven vehicle.',
    content: 'For those who travel by private jet, the experience begins long before the flight and continues long after landing. South Africa is home to several world-class private aviation terminals, offering the ultimate in privacy, efficiency, and comfort. At LM Tours, we specialize in tarmac-to-vehicle transfers, ensuring a seamless transition from your private aircraft to our luxury fleet.\n\nLanseria International Airport remains a top choice for private aviation in the Johannesburg area, with dedicated FBOs (Fixed Base Operators) that provide discreet and efficient service. In Cape Town, the ExecuJet terminal offers stunning views and world-class facilities. Other notable terminals include Fireblade Aviation at OR Tambo, which sets a new standard for luxury and convenience in the region.\n\nWhen choosing a private aviation terminal, consider the proximity to your final destination and the quality of the ground transport integration. LM Tours works closely with FBO staff to ensure that your chauffeur is positioned and ready the moment you disembark. This level of coordination is what defines a truly integrated luxury travel experience, where every detail is managed with precision and care.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/pexels-pavel-danilyuk-8425057.webp',
    date: 'April 2, 2026',
    author: 'LM Tours Aviation Services',
    category: 'Aviation'
  },
  {
    id: '4',
    title: 'How to Choose the Right Chauffeur Service for Business',
    slug: 'choosing-right-chauffeur-service-business',
    excerpt: 'Not all chauffeur services are created equal. Discover the essential criteria for selecting a partner that meets your corporate standards for reliability, safety, and professionalism.',
    content: 'When it comes to corporate travel, the quality of your ground transport partner can have a significant impact on your productivity and professional image. Choosing the right chauffeur service requires a careful evaluation of several key factors. First and foremost is reliability. A service that is consistently on time and professional is non-negotiable for busy executives.\n\nSecondly, consider the quality and variety of the fleet. A premium service should offer a range of modern, well-maintained vehicles to suit different needs, from executive sedans for individual travel to spacious vans for team transfers. At LM Tours, our fleet includes the latest Mercedes-Benz V-Class and C-Class models, ensuring that you always travel in comfort and style.\n\nThirdly, evaluate the professionalism and training of the chauffeurs. A great chauffeur is more than just a driver; they are a professional who understands the importance of discretion, safety, and local knowledge. Finally, look for a service that offers transparent pricing and easy booking processes. In the fast-paced world of business, you need a partner that is responsive and easy to work with. By prioritizing these criteria, you can ensure that your corporate travel is always handled with the excellence it deserves.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/asdfg%20(1).webp',
    date: 'April 4, 2026',
    author: 'LM Tours Operations',
    category: 'Business'
  },
  {
    id: '5',
    title: 'Navigating Gauteng: A VIP\'s Guide to Sandton and Pretoria',
    slug: 'vip-guide-sandton-pretoria',
    excerpt: 'A comprehensive guide for high-profile travelers navigating the economic and administrative hearts of South Africa. Learn how to travel between Sandton and Pretoria with ease.',
    content: 'Gauteng is the economic engine of South Africa, and its two primary hubs—Sandton and Pretoria—are essential destinations for many VIP travelers. Navigating these areas requires an understanding of their unique characteristics and the best ways to move between them. Sandton, known as "Africa\'s richest square mile," is a dense, high-energy district where luxury and business intersect.\n\nPretoria, the administrative capital, offers a more stately pace but is no less important for diplomatic and government travel. The corridor between these two hubs is one of the busiest in the country, and professional ground transport is the most efficient way to manage the commute. At LM Tours, we provide specialized services that cater to the needs of VIPs in both cities.\n\nIn Sandton, we focus on agility and prestige, ensuring you can move between meetings and hotels with ease. In Pretoria, we emphasize discretion and protocol awareness, reflecting the city\'s diplomatic character. By choosing a partner that understands the nuances of both hubs, you can ensure that your travels in Gauteng are always productive, secure, and comfortable. Whether you are attending a summit in Pretoria or a board meeting in Sandton, LM Tours is your trusted partner on the road.',
    image: 'https://btjzzxfhdwutdievqbur.supabase.co/storage/v1/object/public/assets/57rtghjT689.webp',
    date: 'April 6, 2026',
    author: 'LM Tours Editorial',
    category: 'Travel Guide'
  }
];

const InsightsPage: React.FC = () => {
  return (
    <div className="bg-background-light min-h-screen pt-24 font-sans">
      <SEO 
        title="Travel Insights & Guides" 
        description="Explore luxury travel guides, corporate safety tips, and aviation insights from the experts at LM Tours. Redefining your journey through knowledge."
      />

      {/* Header Section */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-[1000px] mx-auto text-center">
          <span className="text-accent-gold font-display font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Expertise & Insights</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
            Luxury Travel <span className="italic font-light">Insights</span>
          </h1>
          <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Discover the latest trends in luxury travel, corporate security, and bespoke transport solutions from the LM Tours editorial team in Johannesburg.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((article) => (
            <RevealSection key={article.id} variant="fade-up">
              <Link to={`/insights/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-lg border border-charcoal/5 hover:shadow-2xl transition-all duration-500">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-primary/5 text-primary text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-primary/10">
                      {article.category}
                    </span>
                    <span className="text-charcoal/40 text-[10px] font-bold uppercase tracking-widest">{article.date}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                  <p className="text-charcoal/60 text-sm mb-8 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  <span className="text-primary font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                    Read Article <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>

      <ContactCTA />
      <Footer onGoToBooking={() => {}} onGoToFleet={() => {}} onGoToContact={() => {}} />
    </div>
  );
};

export default InsightsPage;
