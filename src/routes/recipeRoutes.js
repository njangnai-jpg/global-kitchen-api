const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

/**
 * Recipe Routes
 *
 * Defines the API endpoints and maps them to controller functions.
 * Uses correct HTTP verbs for each action.
 */

// GET /recipes     — Retrieve all recipes (supports ?category= filter)
// POST /recipes    — Create a new recipe
router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(recipeController.createRecipe);

// GET /recipes/:id    — Retrieve a single recipe
// PATCH /recipes/:id  — Update specific fields of a recipe
// DELETE /recipes/:id — Remove a recipe
router
  .route('/:id')
  .get(recipeController.getRecipeById)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

module.exports = router;
