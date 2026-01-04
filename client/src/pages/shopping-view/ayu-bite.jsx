import React from 'react';
import { Button } from '@/components/ui/button';

const AyuBite = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Ayu Bite</h1>
        <p className="text-xl text-gray-600">Nourish Your Body, Delight Your Senses</p>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Healthy, balanced meals inspired by Ayurvedic principles and modern nutrition science.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="mb-4">
            At Ayu Bite, we believe in food that's as good for your body as it is delicious. 
            Our meals are crafted with:
          </p>
          <ul className="space-y-2 mb-6">
            <li>• Organic, locally-sourced ingredients</li>
            <li>• Balanced macronutrients</li>
            <li>• Ayurvedic principles</li>
            <li>• No artificial additives</li>
            <li>• Seasonal produce</li>
          </ul>
          <Button>View Meal Plans</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Popular Meal Plans</h2>
          <div className="space-y-4">
            {[
              { name: "Balanced Wellness", price: "£12.99/meal" },
              { name: "Keto & Low-Carb", price: "£14.99/meal" },
              { name: "Plant-Based Power", price: "£11.99/meal" },
              { name: "Muscle Gain", price: "£15.99/meal" }
            ].map((plan, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{plan.name}</span>
                <span className="text-gray-600">{plan.price}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Plans</Button>
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Subscribe & Save</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Starter",
              price: "£59",
              desc: "5 meals/week",
              popular: false,
              features: ["Lunch or Dinner", "Free delivery", "Flexible scheduling"]
            },
            {
              name: "Popular",
              price: "£99",
              desc: "10 meals/week",
              popular: true,
              features: ["Lunch & Dinner", "Free delivery", "Priority scheduling", "1x Weekly dessert"]
            },
            {
              name: "Premium",
              price: "£179",
              desc: "20 meals/week",
              popular: false,
              features: ["Lunch & Dinner", "Free delivery", "Priority scheduling", "2x Weekly desserts", "Nutritional consultation"]
            }
          ].map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-lg shadow-md border-2 ${plan.popular ? 'border-amber-400 transform scale-105' : 'border-transparent'}`}
            >
              {plan.popular && (
                <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mb-4">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold mb-2">£{plan.price}<span className="text-sm font-normal text-gray-500">/week</span></p>
              <p className="text-gray-600 mb-4">{plan.desc}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? 'bg-amber-600 hover:bg-amber-700' : ''}`}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "How does the meal delivery work?",
              answer: "We deliver fresh, prepared meals to your door on your chosen days. Meals arrive ready to eat or can be quickly heated."
            },
            {
              question: "Can I customize my meal plan?",
              answer: "Yes! You can customize your meals based on dietary preferences, allergies, and portion sizes through your account."
            },
            {
              question: "How do I heat my meals?",
              answer: "Most meals can be heated in the microwave in 2-3 minutes or in a conventional oven at 350°F for 10-12 minutes."
            },
            {
              question: "Can I pause or cancel my subscription?",
              answer: "Absolutely! You can pause or cancel your subscription at any time through your account settings."
            }
          ].map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AyuBite;
