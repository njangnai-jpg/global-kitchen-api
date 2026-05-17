const Recipe = require('../models/Recipe');

/**
 * Recipe Service Layer
 *
 * Contains all business logic. Controllers call these functions;
 * they do NOT interact with the database directly.
 * All operations use async/await for non-blocking I/O.
 */

/**
 * Retrieve all recipes.
 * Supports optional filtering by category via query parameter.
 * @param {Object} queryParams - e.g. { category: 'Dinner' }
 */
const getAllRecipes = async (queryParams) => {
  const filter = {};

  // Apply category filter if provided (match filter requirement)
  if (queryParams.category) {
    filter.category = queryParams.category;
  }

  const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
  return recipes;
};

/**
 * Retrieve a single recipe by its ID.
 * @param {string} id - MongoDB ObjectId string
 */
const getRecipeById = async (id) => {
  const recipe = await Recipe.findById(id);
  return recipe; // Returns null if not found — handled by controller
};

/**
 * Create a new recipe.
 * Business logic: validates that cookingTime is a positive number.
 * @param {Object} recipeData - The request body
 */
const createRecipe = async (recipeData) => {
  const { cookingTime } = recipeData;

  // Business logic validation: cooking time must be a positive number
  if (!cookingTime || typeof cookingTime !== 'number' || cookingTime <= 0) {
    const error = new Error('Cooking time must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  const recipe = await Recipe.create(recipeData);
  return recipe;
};

/**
 * Update specific fields of a recipe (partial update with PATCH).
 * @param {string} id - MongoDB ObjectId string
 * @param {Object} updateData - Fields to update
 */
const updateRecipe = async (id, updateData) => {
  // If cookingTime is being updated, validate it is a positive number
  if (updateData.cookingTime !== undefined) {
    if (typeof updateData.cookingTime !== 'number' || updateData.cookingTime <= 0) {
      const error = new Error('Cooking time must be a positive number');
      error.statusCode = 400;
      throw error;
    }
  }

  const recipe = await Recipe.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,          // Return the updated document
      runValidators: true, // Run schema validators on update
    }
  );

  return recipe; // Returns null if not found — handled by controller
};

/**
 * Delete a recipe by its ID.
 * @param {string} id - MongoDB ObjectId string
 */
const deleteRecipe = async (id) => {
  const recipe = await Recipe.findByIdAndDelete(id);
  return recipe; // Returns null if not found — handled by controller
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
