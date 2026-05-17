# The Global Kitchen API

**Student:** NAI FAITH NJANG
**Matricule** LMUI2646929 
**Course:** Node.js and MongoDB  
**Level** 400
## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Configuration:** dotenv

## Features

- Full CRUD operations for recipes
- Category-based filtering
- Schema-level data validation
- Layered 3-Tier Architecture (Routes → Controllers → Services → Models)
- Global error handling (no server crashes on bad requests)
- Non-blocking async/await database operations
- MongoDB indexing for fast queries

## Project Structure

```
global-kitchen-api/
├── src/
│   ├── app.js                    # Entry point, Express setup, global error handler
│   ├── config/
│   │   └── db.js                 # Single MongoDB connection module (DRY)
│   ├── models/
│   │   └── Recipe.js             # Mongoose schema with BSON types & validation
│   ├── services/
│   │   └── recipeService.js      # Business logic layer
│   ├── controllers/
│   │   └── recipeController.js   # Request/response cycle
│   └── routes/
│       └── recipeRoutes.js       # API endpoint definitions
├── .env.example                  # Environment variable template
├── .gitignore
└── package.json
```

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd global-kitchen-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/global-kitchen
   ```

4. **Start the server:**
   ```bash
   # Production
   npm start

   # Development (with auto-restart)
   npm run dev
   ```

## API Endpoints

| Method   | Endpoint        | Description                            |
|----------|-----------------|----------------------------------------|
| `GET`    | `/recipes`      | Get all recipes (supports `?category=` filter) |
| `POST`   | `/recipes`      | Create a new recipe                    |
| `GET`    | `/recipes/:id`  | Get a single recipe by ID              |
| `PATCH`  | `/recipes/:id`  | Update specific fields of a recipe     |
| `DELETE` | `/recipes/:id`  | Delete a recipe                        |

## Example Requests

### Create a Recipe

```http
POST /recipes
Content-Type: application/json

{
  "title": "Jollof Rice",
  "ingredients": ["rice", "tomatoes", "onions", "pepper", "chicken stock"],
  "instructions": "Blend tomatoes and pepper, fry with onions, add rice and stock, cook until done.",
  "cookingTime": 45,
  "difficulty": "Medium",
  "category": "Dinner"
}
```

### Get All Dinner Recipes

```http
GET /recipes?category=Dinner
```

### Update Cooking Time Only

```http
PATCH /recipes/64abc123def456789
Content-Type: application/json

{
  "cookingTime": 50
}
```

### Delete a Recipe

```http
DELETE /recipes/64abc123def456789
```

## Recipe Schema

| Field          | Type     | Required | Validation                                      |
|----------------|----------|----------|-------------------------------------------------|
| `title`        | String   | Yes      | Max 100 chars, trimmed                          |
| `ingredients`  | [String] | Yes      | Must not be empty array                         |
| `instructions` | String   | Yes      | Trimmed                                         |
| `cookingTime`  | Number   | Yes      | Must be ≥ 1 (positive number, not a string)    |
| `difficulty`   | String   | Yes      | Enum: `Easy`, `Medium`, `Hard`                  |
| `category`     | String   | Yes      | Enum: `Breakfast`, `Lunch`, `Dinner`, etc.      |
| `createdAt`    | Date     | Auto     | Set automatically by Mongoose timestamps        |
| `updatedAt`    | Date     | Auto     | Updated automatically on every save             |
