const recipeService = require('../services/recipeService');

/**
 * Recipe Controller Layer
 *
 * Handles the request/response cycle ONLY.
 * All business logic is delegated to the service layer.
 * Every path ends with res.json() — no hanging clients.
 * All async operations wrapped in try/catch and passed to global error handler.
 */

/**
 * GET /recipes
 * Retrieves all recipes. Supports ?category= query parameter for filtering.
 */
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await recipeService.getAllRecipes(req.query);

    res.status(200).json({
      status: 'success',
      results: recipes.length,
      data: { recipes },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

/**
 * GET /recipes/:id
 * Retrieves a single recipe by ID.
 */
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);

    if (!recipe) {
      const error = new Error(`Recipe with ID ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: { recipe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /recipes
 * Creates a new recipe.
 */
const createRecipe = async (req, res, next) => {
  try {
    const newRecipe = await recipeService.createRecipe(req.body);

    res.status(201).json({
      status: 'success',
      data: { recipe: newRecipe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /recipes/:id
 * Partially updates a recipe (e.g., updating just the cooking time).
 */
const updateRecipe = async (req, res, next) => {
  try {
    const updatedRecipe = await recipeService.updateRecipe(req.params.id, req.body);

    if (!updatedRecipe) {
      const error = new Error(`Recipe with ID ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: { recipe: updatedRecipe },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /recipes/:id
 * Removes a recipe from the collection.
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const deletedRecipe = await recipeService.deleteRecipe(req.params.id);

    if (!deletedRecipe) {
      const error = new Error(`Recipe with ID ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error);
    }

    // 204 No Content — standard response for successful deletion
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
