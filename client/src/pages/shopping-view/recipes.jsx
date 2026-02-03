import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllRecipes } from '@/store/shop/recipes-slice';

const Recipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeList, isLoading } = useSelector((state) => state.shopRecipes);
  
  console.log('Current recipeList:', recipeList);
  console.log('Is loading:', isLoading);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // 'recipe', 'blog', or 'all'

  const categories = ['All', 'Veg', 'Non-Veg', 'Dessert', 'Beverage', 'Appetizer', 'Main Course'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const types = ['All', 'Recipes', 'Blogs'];

  useEffect(() => {
    const queryParams = {};
    
    if (selectedCategory !== 'All') queryParams.category = selectedCategory;
    if (selectedDifficulty !== 'All') queryParams.difficulty = selectedDifficulty;
    if (searchTerm.trim()) queryParams.search = searchTerm.trim();
    if (selectedType === 'Recipes') queryParams.type = 'recipe';
    else if (selectedType === 'Blogs') queryParams.type = 'blog';

    console.log('Fetching recipes with params:', queryParams);
    dispatch(fetchAllRecipes(queryParams));
  }, [dispatch, selectedCategory, selectedDifficulty, searchTerm, selectedType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTypeLabel = (type) => {
    return type === 'recipe' ? 'Recipe' : 'Blog';
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/shop/recipes/${recipeId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-gray-950 dark:text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Recipes & Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Discover Delicious Recipes & Culinary Inspiration</p>
      </div>

      <div className="mb-8">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {types.map((type) => (
            <Button 
              key={type} 
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {categories.map((category) => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {difficulties.map((difficulty) => (
            <Button 
              key={difficulty} 
              variant={selectedDifficulty === difficulty ? "default" : "ghost"}
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search recipes and blogs..."
            value={searchTerm}
            onChange={handleSearch}
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

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
        </div>
      ) : (
        <>
          {/* Results */}
          {!recipeList.length ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">No recipes found</h2>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipeList.map((recipe) => (
                <div key={recipe._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={recipe.image || 'https://via.placeholder.com/300x200?text=Recipe'}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">{recipe.title}</h2>
                      <div className="flex gap-2">
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {recipe.category}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {getTypeLabel(recipe.type)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
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
                    <Button className="w-full" onClick={() => handleViewRecipe(recipe._id)}>
                      View {getTypeLabel(recipe.type)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

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
            <Input
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
