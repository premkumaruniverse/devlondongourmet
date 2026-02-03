import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeDetails } from '@/store/shop/recipes-slice';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat, BookOpen } from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recipeDetails, isLoading } = useSelector((state) => state.shopRecipes);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeDetails(id));
    }
  }, [id, dispatch]);

  const getTypeLabel = (type) => {
    return type === 'recipe' ? 'Recipe' : 'Blog';
  };

  const getTypeColor = (type) => {
    return type === 'recipe' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100' 
      : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-muted dark:text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 dark:bg-background min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 dark:border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-muted-foreground">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="container mx-auto px-4 py-12 dark:bg-background min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600 dark:text-muted-foreground mb-4">Recipe not found</h1>
          <Button onClick={() => navigate('/shop/recipes')} variant="outline" className="dark:text-primary dark:border-primary dark:hover:bg-primary/10">
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-background dark:text-foreground py-8">
      <div className="container mx-auto px-4">
        <Button 
          onClick={() => navigate('/shop/recipes')} 
          variant="outline" 
          className="mb-6 dark:text-primary dark:border-primary dark:hover:bg-primary/10"
        >
          ← Back to Recipes
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-card rounded-lg shadow-lg overflow-hidden mb-8 border dark:border-border">
            <img
              src={recipeDetails.image || 'https://via.placeholder.com/800x400?text=Recipe'}
              alt={recipeDetails.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={getTypeColor(recipeDetails.type)}>
                  {getTypeLabel(recipeDetails.type)}
                </Badge>
                <Badge variant="outline" className="dark:border-border dark:text-muted-foreground">
                  {recipeDetails.category}
                </Badge>
                <Badge className={getDifficultyColor(recipeDetails.difficulty)}>
                  {recipeDetails.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-primary mb-4">
                {recipeDetails.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-muted-foreground mb-6 leading-relaxed">
                {recipeDetails.description}
              </p>
              
              {/* Recipe Info */}
              {recipeDetails.type === 'recipe' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-muted/50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-muted-foreground">Total Time</p>
                      <p className="font-semibold dark:text-foreground">{recipeDetails.totalTime || recipeDetails.prepTime || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-muted/50 p-4 rounded-lg">
                    <Users className="w-5 h-5 text-amber-600 dark:text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-muted-foreground">Servings</p>
                      <p className="font-semibold dark:text-foreground">{recipeDetails.servings || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-muted/50 p-4 rounded-lg">
                    <ChefHat className="w-5 h-5 text-amber-600 dark:text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-muted-foreground">Difficulty</p>
                      <p className="font-semibold dark:text-foreground">{recipeDetails.difficulty || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Info */}
              {recipeDetails.type === 'blog' && (
                <div className="mb-8">
                  {recipeDetails.tags && recipeDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground mr-2">Tags:</span>
                      {recipeDetails.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-colors duration-200 dark:from-primary/20 dark:to-primary/10 dark:text-primary dark:border-primary/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-muted-foreground mb-8">
                <ChefHat className="w-4 h-4" />
                <span>By {recipeDetails.author}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients - Only for Recipes */}
            {recipeDetails.type === 'recipe' && recipeDetails.ingredients && recipeDetails.ingredients.length > 0 && (
              <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 border dark:border-border">
                <h2 className="text-2xl font-bold mb-4 flex items-center dark:text-primary">
                  <BookOpen className="w-6 h-6 mr-2 text-amber-600 dark:text-primary" />
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipeDetails.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 dark:text-primary mr-2">•</span>
                      <span className="text-gray-700 dark:text-foreground">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content */}
            <div className={`bg-white dark:bg-card rounded-lg shadow-lg p-6 border dark:border-border ${recipeDetails.type === 'recipe' ? '' : 'md:col-span-2'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center dark:text-primary">
                <BookOpen className="w-6 h-6 mr-2 text-amber-600 dark:text-primary" />
                {recipeDetails.type === 'recipe' ? 'Instructions' : 'Content'}
              </h2>
              {recipeDetails.type === 'recipe' ? (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div 
                    className="text-gray-700 dark:text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: recipeDetails.instructions && recipeDetails.instructions.length > 0 
                        ? recipeDetails.instructions[0] 
                        : 'No instructions available' 
                    }}
                  />
                </div>
              ) : (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div 
                    className="text-gray-700 dark:text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: recipeDetails.content || recipeDetails.description 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
