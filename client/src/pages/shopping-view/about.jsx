import React from 'react';
import { ChefHat, Leaf, Utensils, Heart, History, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function ShoppingAbout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="London Gourmet Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 uppercase tracking-tighter">
            Our Story
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed font-light italic">
            "A journey from traditional kitchens to the pinnacle of modern gastronomy."
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-50 dark:bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 dark:text-primary uppercase">
            The London Gourmet Philosophy
          </h2>
          <p className="text-xl text-gray-700 dark:text-foreground leading-relaxed mb-12 max-w-3xl mx-auto font-light">
            We believe that food is more than just sustenance; it is a universal language of love, culture, and artistry. 
            London Gourmet was born out of a passion to bridge the gap between ancient culinary traditions and the 
            dynamic, fast-paced world of modern dining.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-6">
                <ChefHat className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-primary uppercase tracking-wider">Chef-Driven</h3>
              <p className="text-gray-600 dark:text-muted-foreground font-light leading-relaxed">
                Our master chefs are the heart of everything we do, bringing decades of expertise to every recipe and event.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-primary uppercase tracking-wider">Farm-to-Fork</h3>
              <p className="text-gray-600 dark:text-muted-foreground font-light leading-relaxed">
                We source the finest locally-grown, organic ingredients to ensure every bite is fresh, sustainable, and full of flavor.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-6">
                <History className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-primary uppercase tracking-wider">Heritage</h3>
              <p className="text-gray-600 dark:text-muted-foreground font-light leading-relaxed">
                Respecting traditional techniques while innovating with modern tools to create a unique culinary narrative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 bg-white dark:bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-sm italic">Our Narrative</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight dark:text-primary uppercase">
                A Visionary <br /> Journey
              </h2>
              <p className="text-lg text-gray-700 dark:text-foreground leading-relaxed font-light">
                What started as a small catering project for close friends quickly evolved into a premium culinary brand 
                recognized for its commitment to excellence. We didn't just want to serve food; we wanted to curate 
                experiences that linger in the memory long after the last course.
              </p>
              <p className="text-lg text-gray-700 dark:text-foreground leading-relaxed font-light">
                Today, London Gourmet spans gourmet retail, elite catering through Diner's Atlas, and exclusive 
                membership clubs, all while maintaining the artisanal spirit of our founders.
              </p>
              <div className="pt-6">
                <Button 
                  className="bg-gray-900 hover:bg-black text-white px-10 py-6 text-lg rounded-none transition-all dark:bg-primary dark:text-primary-foreground uppercase tracking-widest"
                  onClick={() => navigate('/shop/listing')}
                >
                  Explore Our Shop
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Founder cooking" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Quote/CTA */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <Heart className="w-12 h-12 text-amber-500 mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 italic">
            "We don't just sell products; we share a piece of our heart with every creation."
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-12" />
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-12">Join us in our culinary exploration.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-none uppercase tracking-widest"
              onClick={() => navigate('/shop/contact-us')}
            >
              Partner With Us
            </Button>
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-none uppercase tracking-widest border-none"
              onClick={() => navigate('/shop/home')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingAbout;
