import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const ContactUs = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-amber-600 dark:text-primary" />,
      title: 'Our Location',
      description: '123 Gourmet Street, London, UK',
      link: 'https://maps.google.com',
      linkText: 'View on Map'
    },
    {
      icon: <Mail className="w-6 h-6 text-amber-600 dark:text-primary" />,
      title: 'Email Us',
      description: 'hello@londongourmet.com',
      link: 'mailto:hello@londongourmet.com',
      linkText: 'Send Email'
    },
    {
      icon: <Phone className="w-6 h-6 text-amber-600 dark:text-primary" />,
      title: 'Call Us',
      description: '+44 20 1234 5678',
      link: 'tel:+442012345678',
      linkText: 'Call Now'
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600 dark:text-primary" />,
      title: 'Opening Hours',
      description: 'Mon - Fri: 9:00 - 18:00',
      details: 'Sat: 10:00 - 16:00',
      link: '',
      linkText: ''
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-primary">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-muted-foreground">We'd love to hear from you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-card dark:border dark:border-border">
          <h2 className="text-2xl font-semibold mb-6 dark:text-primary">Send us a Message</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-muted-foreground" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary focus:border-transparent dark:bg-muted dark:border-border dark:text-foreground dark:placeholder-muted-foreground"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-muted-foreground" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary focus:border-transparent dark:bg-muted dark:border-border dark:text-foreground dark:placeholder-muted-foreground"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-muted-foreground" htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary focus:border-transparent dark:bg-muted dark:border-border dark:text-foreground dark:placeholder-muted-foreground"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-muted-foreground" htmlFor="message">Message</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-primary focus:border-transparent dark:bg-muted dark:border-border dark:text-foreground dark:placeholder-muted-foreground"
                placeholder="Your message"
              ></textarea>
            </div>
            <Button type="submit" className="w-full dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">Send Message</Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-card dark:border dark:border-border">
            <h2 className="text-2xl font-semibold mb-6 dark:text-primary">Visit Us</h2>
            <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5404230564476!2d-0.12775868423035726!3d51.50735097933272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3b9b9e1e7b%3A0x3b4fa4f7cbc4b7d1!2sLondon!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="London Gourmet Location"
                className="rounded-lg"
              ></iframe>
            </div>
            
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-primary">{item.title}</h3>
                    <p className="text-gray-600 dark:text-muted-foreground">{item.description}</p>
                    {item.details && <p className="text-gray-600 dark:text-muted-foreground">{item.details}</p>}
                    {item.link && (
                      <a 
                        href={item.link} 
                        className="text-amber-600 hover:text-amber-700 dark:text-primary dark:hover:text-primary/90 text-sm font-medium mt-1 inline-block"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {item.linkText} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg dark:bg-muted">
            <h3 className="text-lg font-semibold mb-3 dark:text-primary">Customer Support</h3>
            <p className="text-gray-600 mb-4 dark:text-muted-foreground">
              Our customer service team is available to assist you with any questions or concerns you may have.
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://wa.me/442012345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.174.196-.347.223-.644.075-.297-.15-1.264-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.297-.018-.458.13-.606.136-.133.296-.345.445-.52.146-.181.194-.297.297-.495.1-.21.049-.372-.025-.521-.075-.148-.67-1.598-.922-2.19-.24-.584-.487-.51-.67-.52-.173-.008-.371-.01-.57-.01-.2 0-.523.074-.797.36-.273.3-1.045 1.004-1.045 2.445 0 1.433 1.076 2.835 1.23 3.03.153.198 2.1 3.18 5.04 4.5.715.3 1.27.48 1.71.63.713.227 1.36.2 1.87.12.57-.09 1.76-.71 2.01-1.4.248-.69.248-1.28.17-1.4-.07-.12-.27-.192-.57-.3m-5.446 7.443h-.016c-1.77 0-3.525-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.68 9.68 0 01-1.51-5.26c.001-5.45 4.564-9.885 10.164-9.885 2.7 0 5.23 1.04 7.14 2.93 1.91 1.89 2.96 4.39 2.96 7.06 0 5.44-4.365 9.885-9.816 9.885M20.52 3.45C18.24 1.245 15.24 0 12.045 0 5.465 0 .105 5.34.1 11.89c0 2.13.55 4.14 1.52 5.905L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.58 0 11.94-5.346 11.94-11.896 0-3.18-1.24-6.165-3.495-8.415"/>
                </svg>
                WhatsApp Us
              </a>
              <a 
                href="tel:+442012345678" 
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-card dark:border dark:border-border">
        <h2 className="text-2xl font-semibold mb-6 dark:text-primary">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "What are your delivery hours?",
              answer: "We deliver from 10:00 AM to 10:00 PM, seven days a week. Orders placed after 9:00 PM will be delivered the next day."
            },
            {
              question: "Do you cater for dietary restrictions?",
              answer: "Yes, we offer vegetarian, vegan, gluten-free, and other dietary options. Please specify your requirements when placing your order."
            },
            {
              question: "How can I track my order?",
              answer: "Once your order is confirmed, you'll receive a tracking link via email or SMS to monitor your delivery in real-time."
            },
            {
              question: "What is your cancellation policy?",
              answer: "You can cancel your order up to 30 minutes before the scheduled delivery time for a full refund."
            }
          ].map((faq, index) => (
            <div key={index} className="border-b pb-4 dark:border-border">
              <h3 className="font-medium text-gray-900 dark:text-primary">{faq.question}</h3>
              <p className="text-gray-600 mt-1 dark:text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
