require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

// Connect to MongoDB (single connection module — DRY)
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/recipes', recipeRoutes);

// Root health-check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🍳 Welcome to The Global Kitchen API',
  });
});

// Handle unknown routes
app.all('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
/**
 * Centralized error handling middleware.
 * Catches all errors passed via next(error).
 * Returns a proper status code instead of crashing the server.
 */
app.use((error, req, res, next) => {
  // Handle Mongoose invalid ObjectId format
  if (error.name === 'CastError') {
    error.statusCode = 400;
    error.message = `Invalid ID format: ${error.value}`;
  }

  // Handle Mongoose validation errors (schema constraints)
  if (error.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(error.errors)
      .map((err) => err.message)
      .join('. ');
  }

  // Handle duplicate key errors (MongoDB error code 11000)
  if (error.code === 11000) {
    error.statusCode = 409;
    error.message = `Duplicate value for field: ${Object.keys(error.keyValue).join(', ')}`;
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
