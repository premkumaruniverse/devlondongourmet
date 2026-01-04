import React from 'react';
import { Button } from '@/components/ui/button';

const DinersAtlas = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Diner's Atlas</h1>
        <p className="text-xl text-gray-600">Luxury Catering & Fine Dining Experiences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
          <ul className="space-y-4">
            <li>• Multi-cuisine fine dining catering</li>
            <li>• Weddings & Corporate Events</li>
            <li>• Private Chef Experiences</li>
            <li>• Venue Selection & Management</li>
            <li>• Custom Menu Design</li>
          </ul>
          <Button className="mt-6">Book an Event</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Summer Garden Soirée</h3>
              <p className="text-sm text-gray-500">June 15, 2024 • London</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Wine & Dine Evening</h3>
              <p className="text-sm text-gray-500">July 2, 2024 • Private Venue</p>
            </div>
          </div>
          <Button variant="outline" className="mt-6">View All Events</Button>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Request a Quote</h2>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select className="w-full p-2 border rounded">
                <option>Wedding</option>
                <option>Corporate Event</option>
                <option>Private Party</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows="4" className="w-full p-2 border rounded"></textarea>
            </div>
            <Button type="submit" className="w-full">Send Request</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DinersAtlas;
