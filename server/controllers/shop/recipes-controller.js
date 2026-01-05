const Recipe = require("../../models/Recipe");

// Get all recipes and blogs
const getAllRecipes = async (req, res) => {
  try {
    const { category, difficulty, type, search } = req.query;
    
    let filters = { isPublished: true };
    
    if (type && type !== 'all') {
      filters.type = type;
    }
    
    if (category && category !== 'All') {
      filters.category = category;
    }
    
    if (difficulty && difficulty !== 'All') {
      filters.difficulty = difficulty;
    }
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(filters).sort({ createdAt: -1 });
    
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

// Get recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipe",
    });
  }
};

module.exports = { getAllRecipes, getRecipeById };
