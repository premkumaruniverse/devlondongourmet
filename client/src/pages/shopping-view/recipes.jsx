import React from 'react';
import { Button } from '@/components/ui/button';

const Recipes = () => {
  const recipes = [
    {
      id: 1,
      title: 'Spicy Tandoori Chicken',
      category: 'Non-Veg',
      prepTime: '30 mins',
      difficulty: 'Medium',
      image: 'https://via.placeholder.com/300x200?text=Spicy+Tandoori+Chicken'
    },
    {
      id: 2,
      title: 'Vegetable Biryani',
      category: 'Veg',
      prepTime: '45 mins',
      difficulty: 'Medium',
      image: 'https://via.placeholder.com/300x200?text=Vegetable+Biryani'
    },
    {
      id: 3,
      title: 'Chocolate Lava Cake',
      category: 'Dessert',
      prepTime: '25 mins',
      difficulty: 'Easy',
      image: 'https://via.placeholder.com/300x200?text=Chocolate+Lava+Cake'
    },
    {
      id: 4,
      title: 'Paneer Tikka Masala',
      category: 'Veg',
      prepTime: '40 mins',
      difficulty: 'Medium',
      image: 'https://via.placeholder.com/300x200?text=Paneer+Tikka+Masala'
    },
    {
      id: 5,
      title: 'Butter Chicken',
      category: 'Non-Veg',
      prepTime: '50 mins',
      difficulty: 'Hard',
      image: 'https://via.placeholder.com/300x200?text=Butter+Chicken'
    },
    {
      id: 6,
      title: 'Mango Lassi',
      category: 'Beverage',
      prepTime: '10 mins',
      difficulty: 'Easy',
      image: 'https://via.placeholder.com/300x200?text=Mango+Lassi'
    },
  ];

  const categories = ['All', 'Veg', 'Non-Veg', 'Dessert', 'Beverage', 'Appetizer'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Recipes & Blog</h1>
        <p className="text-xl text-gray-600">Discover Delicious Recipes & Culinary Inspiration</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {categories.map((category) => (
            <Button key={category} variant="outline">
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {difficulties.map((difficulty) => (
            <Button key={difficulty} variant="ghost">
              {difficulty}
            </Button>
          ))}
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {recipe.category}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recipe.prepTime}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {recipe.difficulty}
                </span>
              </div>
              <Button className="w-full">View Recipe</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" className="px-8">
          Load More Recipes
        </Button>
      </div>

      <div className="mt-16 bg-amber-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get the latest recipes, cooking tips, and special offers delivered to your inbox.</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
