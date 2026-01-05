const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // Recipe-specific fields
    totalTime: {
      type: String,
    },
    prepTime: {
      type: String,
    },
    cookTime: {
      type: String,
    },
    servings: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    ingredients: [{
      type: String,
    }],
    instructions: [{
      type: String,
    }],
    // Blog-specific fields
    content: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    readingTime: {
      type: String,
    },
    // Common fields
    author: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'recipe',
      enum: ['recipe', 'blog']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
