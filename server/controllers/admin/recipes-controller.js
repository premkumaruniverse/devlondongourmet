const Recipe = require("../../models/Recipe");

// Add new recipe/blog
const addRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      customCategory,
      totalTime,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients,
      instructions,
      content,
      tags,
      author,
      type = 'recipe',
      isPublished = true
    } = req.body;

    // Handle custom category
    const finalCategory = category === "Other" && customCategory ? customCategory : category;

    // Build the recipe object based on type
    const recipeData = {
      title,
      description,
      image,
      category: finalCategory,
      author,
      type,
      isPublished
    };

    // Add recipe-specific fields
    if (type === 'recipe') {
      recipeData.totalTime = totalTime;
      recipeData.prepTime = prepTime;
      recipeData.cookTime = cookTime;
      recipeData.servings = servings;
      recipeData.difficulty = difficulty;
      recipeData.ingredients = ingredients;
      recipeData.instructions = instructions;
    }

    // Add blog-specific fields
    if (type === 'blog') {
      recipeData.content = content;
      recipeData.tags = tags;
    }

    const newRecipe = new Recipe(recipeData);

    await newRecipe.save();
    
    res.status(201).json({
      success: true,
      data: newRecipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating recipe",
      error: error.message,
    });
  }
};

// Get all recipes/blogs for admin
const fetchAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipes",
    });
  }
};

// Edit recipe/blog
const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image,
      category,
      customCategory,
      totalTime,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients,
      instructions,
      content,
      tags,
      author,
      type,
      isPublished
    } = req.body;

    let recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Handle custom category
    const finalCategory = category === "Other" && customCategory ? customCategory : category;

    // Update common fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.image = image || recipe.image;
    recipe.category = finalCategory || recipe.category;
    recipe.author = author || recipe.author;
    recipe.type = type || recipe.type;
    recipe.isPublished = isPublished !== undefined ? isPublished : recipe.isPublished;

    // Update recipe-specific fields
    if (type === 'recipe') {
      recipe.totalTime = totalTime !== undefined ? totalTime : recipe.totalTime;
      recipe.prepTime = prepTime !== undefined ? prepTime : recipe.prepTime;
      recipe.cookTime = cookTime !== undefined ? cookTime : recipe.cookTime;
      recipe.servings = servings !== undefined ? servings : recipe.servings;
      recipe.difficulty = difficulty !== undefined ? difficulty : recipe.difficulty;
      recipe.ingredients = ingredients !== undefined ? ingredients : recipe.ingredients;
      recipe.instructions = instructions !== undefined ? instructions : recipe.instructions;
    }

    // Update blog-specific fields
    if (type === 'blog') {
      recipe.content = content !== undefined ? content : recipe.content;
      recipe.tags = tags !== undefined ? tags : recipe.tags;
    }

    await recipe.save();
    
    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating recipe",
      error: error.message,
    });
  }
};

// Delete recipe/blog
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findByIdAndDelete(id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting recipe",
    });
  }
};

module.exports = {
  addRecipe,
  fetchAllRecipes,
  editRecipe,
  deleteRecipe
};
