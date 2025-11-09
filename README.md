# Simple E-commerce API

TypeScript + Express 5 REST API backed by MongoDB/Mongoose. The service exposes CRUD endpoints for users, categories, products, and orders with input validation powered by Zod and modular routers/controllers for clarity.

## 🚀 Getting Started

```bash
git clone <repository-url>
cd ecommerce-api
npm install
```

Create the environment file that supplies the MongoDB connection string (used for both dev and prod builds).

```bash
cat <<'EOF' > .env.development.local
MONGO_URI=mongodb://localhost:27017/simple-ecommerce
PORT=3000
EOF

cp .env.development.local .env.production.local
```

Start the HTTP server in watch mode:

```bash
npm run dev
```

Build and run the compiled output:

```bash
npm run start
```

## 🛠 Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start Express in watch mode with dev env vars |
| `npm run build` | Compile TypeScript into `dist/`               |
| `npm run start` | Build (via `prestart`) and run `dist/app.js`  |

## 🔌 Environment Variables

| Variable    | Description                                     |
| ----------- | ----------------------------------------------- |
| `MONGO_URI` | MongoDB connection string                       |
| `PORT`      | Port for the Express server (default: `3000`)   |

## 📁 Project Structure

```
src/
├── app.ts          # Express app bootstrap + middleware wiring
├── controllers/    # Request handlers for each resource
├── db/             # Mongo connection helpers
├── middleware/     # 404 + error handling middleware
├── models/         # Mongoose models (User, Product, Category, Order)
├── routers/        # Express routers per resource
├── schemas/        # Zod DTO definitions
└── types/          # Shared TypeScript types/responses
```

## 🧪 API Client Collection

Import `Insomnia.simple-ecommerce-api.yaml` (located at the project root) into Insomnia to get ready-to-run requests for every endpoint described below. Each request is pre-configured to hit `http://localhost:3000`.

## 📚 API Documentation

### Base URL & Conventions

- Base URL: `http://localhost:3000`
- All requests/ responses use `application/json`.
- IDs are MongoDB ObjectId strings (24 hexadecimal characters).
- Validation errors and not-found cases return `{ "message": string }` with the appropriate status code.
- Authentication is not enforced; treat the API as internal or wrap it with your own auth gateway.

---

### Users

Users capture customer identity and credentials (passwords are stored hashed by the model). Duplicate emails return `409 Conflict`.

**Endpoints**

| Method | Path         | Description           | Success |
| ------ | ------------ | --------------------- | ------- |
| GET    | `/users`     | List all users        | `200` + `UserDTO[]` |
| POST   | `/users`     | Create a user         | `201` + `UserDTO`   |
| GET    | `/users/:id` | Fetch a single user   | `200` + `UserDTO` or `404` |
| PUT    | `/users/:id` | Replace user data     | `200` + `UserDTO`   |
| DELETE | `/users/:id` | Remove a user         | `200` + `{ message }` |

**Request body (`POST`/`PUT`)**

| Field     | Type   | Rules                                   |
| --------- | ------ | --------------------------------------- |
| `name`    | string | min length 2                            |
| `email`   | string | valid email, 3-30 chars                 |
| `password`| string | 8-20 chars                              |

**Example – create a user**

```
POST /users
Content-Type: application/json

{
  "name": "Sasha",
  "email": "example@gmail.com",
  "password": "12345678"
}
```

Response (`201 Created`):

```json
{
  "id": "690ce628331fb9e53eafd8e4",
  "name": "Sasha",
  "email": "example@gmail.com"
}
```

---

### Categories

Categories are referenced by products and consist of a single name string.

**Endpoints**

| Method | Path              | Description                | Success |
| ------ | ----------------- | -------------------------- | ------- |
| GET    | `/categories`     | List categories            | `200` + `CategoryDTO[]` |
| POST   | `/categories`     | Create category            | `201` + `CategoryDTO`   |
| GET    | `/categories/:id` | Fetch one category         | `200` + `CategoryDTO` or `404` |
| PUT    | `/categories/:id` | Rename a category          | `200` + `CategoryDTO`   |
| DELETE | `/categories/:id` | Remove category            | `200` + `{ message }`   |

**Request body**

| Field | Type   | Rules           |
| ----- | ------ | --------------- |
| `name`| string | min length 3    |

**Example – create a category**

```
POST /categories
Content-Type: application/json

{
  "name": "Furniture"
}
```

Successful response:

```json
{
  "id": "690cee1c15e850b6400b985b",
  "name": "Furniture"
}
```

---

### Products

Products belong to categories, store price/description metadata, and support case-insensitive filtering.

**Endpoints**

| Method | Path              | Description                              | Success |
| ------ | ----------------- | ---------------------------------------- | ------- |
| GET    | `/products`       | List products (with optional filters)    | `200` + `ProductDTO[]` |
| POST   | `/products`       | Create a product                         | `201` + `ProductDTO`   |
| GET    | `/products/:id`   | Fetch one product                        | `200` + `ProductDTO` or `404` |
| PUT    | `/products/:id`   | Replace product data                     | `200` + `ProductDTO`   |
| DELETE | `/products/:id`   | Remove a product                         | `200` + `{ message }`  |

**Request body**

| Field         | Type   | Rules/Notes                                                   |
| ------------- | ------ | ------------------------------------------------------------- |
| `name`        | string | min length 3                                                  |
| `description` | string | max length 100                                                |
| `price`       | number | required                                                      |
| `categoryId`  | string | 24-char ObjectId referencing an existing category             |

**Query parameters (`GET /products`)**

| Param        | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `name`       | Case-insensitive partial match on the product name         |
| `description`| Case-insensitive partial match on description              |
| `categoryId` | Filters by category (must be a valid ObjectId)             |

If the referenced category does not exist, the API responds with `404`.

**Example – create a product**

```
POST /products
Content-Type: application/json

{
  "name": "Desk",
  "description": "Suitable for home office",
  "price": 399,
  "categoryId": "690b648cbc8d7ba8b03e9c09"
}
```

Response:

```json
{
  "id": "690ceb5015e850b6400b9844",
  "name": "Desk",
  "description": "Suitable for home office",
  "price": 399,
  "categoryId": "690b648cbc8d7ba8b03e9c09"
}
```

---

### Orders

Orders tie a user to one or more product line items. Product prices are looked up at request time and the `total` field is calculated for you.

**Endpoints**

| Method | Path            | Description                                  | Success |
| ------ | --------------- | -------------------------------------------- | ------- |
| GET    | `/orders`       | List orders (optionally filter by userId)    | `200` + `OrderDTO[]` |
| POST   | `/orders`       | Create an order                              | `201` + `OrderDTO`   |
| GET    | `/orders/:id`   | Fetch one order                              | `200` + `OrderDTO` or `404` |
| PUT    | `/orders/:id`   | Replace user/items on an order               | `200` + `OrderDTO`   |
| DELETE | `/orders/:id`   | Remove an order                              | `200` + `{ message }` |

**Request body**

| Field      | Type     | Rules/Notes                                                                          |
| ---------- | -------- | ------------------------------------------------------------------------------------ |
| `userId`   | string   | Must reference an existing user                                                      |
| `products` | array    | At least one item; each item has `productId` (existing product) and positive `quantity` |

**Query parameters (`GET /orders`)**

| Param    | Description                               |
| -------- | ----------------------------------------- |
| `userId` | Filters by user (must be a valid ObjectId)|

**Example – create an order**

```
POST /orders
Content-Type: application/json

{
  "userId": "690ce94415e850b6400b983c",
  "products": [
    { "productId": "690cecf815e850b6400b9856", "quantity": 1 },
    { "productId": "690b654ebc8d7ba8b03e9c11", "quantity": 2 }
  ]
}
```

Response:

```json
{
  "id": "690cf01f15e850b6400b986e",
  "userId": "690ce94415e850b6400b983c",
  "products": [
    { "productId": "690cecf815e850b6400b9856", "quantity": 1 },
    { "productId": "690b654ebc8d7ba8b03e9c11", "quantity": 2 }
  ],
  "total": 1197,
  "createdAt": "2024-11-09T10:00:00.000Z",
  "updatedAt": "2024-11-09T10:00:00.000Z"
}
```

Totals are recomputed on every create/update request, ensuring order data remains consistent with current product prices.

---

### Error Handling

- `400 Bad Request` — validation failures (invalid ObjectId, missing fields, etc.).
- `404 Not Found` — unknown resource IDs or relationships (user/product/category/order).
- `409 Conflict` — attempting to create a user with an email that already exists.
- `500 Internal Server Error` — unhandled errors; details are logged in non-production environments.

Unknown routes fall through to the 404 middleware with `{ "message": "Route not implemented" }`.

---

Happy hacking! Contributions and suggestions are welcome.
