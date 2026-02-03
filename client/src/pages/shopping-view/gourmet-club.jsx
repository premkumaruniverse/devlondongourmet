import React from 'react';
import { Button } from '@/components/ui/button';

const GourmetClub = () => {
  return (
    <div className="container mx-auto px-4 py-12 dark:text-primary">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Gourmet Club</h1>
        <p className="text-xl text-gray-600 dark:text-muted-foreground">Exclusive Culinary Experiences for Discerning Palates</p>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-lg mb-8 dark:text-muted-foreground">
          Join our exclusive Gourmet Club for monthly culinary adventures, chef's table experiences, 
          and members-only events that celebrate the art of fine dining.
        </p>
        <Button className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">Become a Member</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: "Monthly Supper Clubs",
            description: "Intimate dining experiences with themed menus and wine pairings.",
            icon: "🍽️"
          },
          {
            title: "Chef's Table",
            description: "Exclusive access to private chef experiences and kitchen tours.",
            icon: "👨‍🍳"
          },
          {
            title: "Wine Tastings",
            description: "Curated wine pairing events with sommelier guidance.",
            icon: "🍷"
          },
          {
            title: "Cooking Masterclasses",
            description: "Learn from our master chefs with hands-on cooking sessions.",
            icon: "👨‍🍳"
          },
          {
            title: "Farm-to-Table Dinners",
            description: "Seasonal menus featuring locally-sourced, sustainable ingredients.",
            icon: "🥗"
          },
          {
            title: "Members' Discounts",
            description: "Exclusive offers on products, events, and catering services.",
            icon: "💎"
          }
        ].map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center dark:bg-card dark:text-primary border dark:border-border">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600 dark:text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-lg max-w-3xl mx-auto dark:bg-card border dark:border-border">
        <h2 className="text-2xl font-semibold mb-6 text-center">Join the Club</h2>
        <p className="text-center mb-6 dark:text-muted-foreground">
          Membership starts at £99/month. Cancel anytime.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className="w-full p-2 border rounded dark:bg-muted dark:border-border dark:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded dark:bg-muted dark:border-border dark:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full p-2 border rounded dark:bg-muted dark:border-border dark:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary" />
          </div>
          <div className="flex items-end">
            <Button className="w-full dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">Join Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GourmetClub;
