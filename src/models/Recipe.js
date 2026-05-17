const mongoose = require('mongoose');

/**
 * Recipe Schema
 *
 * BSON-optimized with:
 *  - Explicit Number type for cookingTime (not a string)
 *  - Real Date types for timestamps (createdAt, updatedAt)
 *  - Schema-level validation (required, min, enum, trim)
 *  - Index on 'category' for heavy lookup performance
 */
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A recipe must have a title'],
      trim: true,
      maxlength: [100, 'Title must not exceed 100 characters'],
    },

    ingredients: {
      type: [String],
      required: [true, 'A recipe must have at least one ingredient'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Ingredients array must not be empty',
      },
    },

    instructions: {
      type: String,
      required: [true, 'A recipe must have instructions'],
      trim: true,
    },

    // Explicit Number type — not a string — for BSON correctness
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be a positive number (at least 1 minute)'],
    },

    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium, or Hard',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Breakfast',
          'Lunch',
          'Dinner',
          'Dessert',
          'Snack',
          'Beverage',
          'Soup',
          'Salad',
          'Other',
        ],
        message:
          'Category must be one of: Breakfast, Lunch, Dinner, Dessert, Snack, Beverage, Soup, Salad, Other',
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt as real Date types
    timestamps: true,
  }
);

// Index on 'category' for fast lookup / filtering queries
recipeSchema.index({ category: 1 });

// Index on 'difficulty' for filtering by difficulty level
recipeSchema.index({ difficulty: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
