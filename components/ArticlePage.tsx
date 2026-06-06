import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from './SEO';
import Footer from './Footer';
import RevealSection from './RevealSection';
import ContactCTA from './ContactCTA';
import { articles } from './InsightsPage';

const ArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = articleSlug ? articles.find(a => a.slug === articleSlug) : null;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light pt-32 px-6 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
        <p className="text-charcoal/60 mb-8">We couldn't find the article you're looking for.</p>
        <Link to="/insights" className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs">Return to Insights</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen pt-24 font-sans">
      <SEO 
        title={article.title} 
        description={article.excerpt}
        ogType="article"
        ogImage={article.image}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "image": article.image,
          "datePublished": article.date,
          "author": {
            "@type": "Organization",
            "name": "LM Tours"
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 opacity-40">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-[1000px] mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-accent-gold text-white text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/10">
              {article.category}
            </span>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{article.date}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-8">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">LM</div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">{article.author}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">LM Tours Editorial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-24 px-6 max-w-[800px] mx-auto">
        <RevealSection variant="fade-up">
          <div className="prose prose-lg prose-charcoal max-w-none">
            <p className="text-xl text-charcoal/80 leading-relaxed mb-10 font-medium">
              {article.excerpt}
            </p>
            <div className="text-charcoal/70 text-lg leading-relaxed space-y-8">
              {article.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </RevealSection>

        <div className="mt-16 pt-16 border-t border-charcoal/10">
          <div className="flex items-center justify-between">
            <Link to="/insights" className="text-primary font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:underline">
              <span className="material-symbols-outlined !text-sm">arrow_back</span> Back to Insights
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-charcoal/40 text-[10px] font-bold uppercase tracking-widest">Share</span>
              <div className="flex gap-2">
                <button className="size-8 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined !text-sm">share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-24 px-6 bg-white border-t border-charcoal/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Related Insights</h2>
            <p className="text-charcoal/50 text-sm font-bold uppercase tracking-widest">Continue your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(a => a.id !== article.id).map((a) => (
              <Link key={a.id} to={`/insights/${a.slug}`} className="group block bg-background-light p-8 rounded-xl border border-charcoal/5 hover:border-primary transition-all">
                <h4 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{a.title}</h4>
                <p className="text-charcoal/60 text-sm mb-6 line-clamp-2">{a.excerpt}</p>
                <span className="text-primary font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                  Read More <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
      <Footer onGoToBooking={() => {}} onGoToFleet={() => {}} onGoToContact={() => {}} />
    </div>
  );
};

export default ArticlePage;
