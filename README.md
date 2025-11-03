# Simple E-commerce API

TypeScript + Express 5 API that exposes product and product-review resources backed by MongoDB (via Mongoose). The code is organised into controllers, services, models, and reusable middleware for clear separation of concerns.

## 🚀 Getting Started

```bash
git clone https://github.com/SashaSohrabi/simple-web-server.git
cd simple-web-server
npm install
```

Create an environment file with your MongoDB connection string. The same file is used for local development and production builds.

```bash
cat <<'EOF' > .env.development.local
MONGO_URI=mongodb://localhost:27017/simple-ecommerce
PORT=3000
EOF

# copy to production config if needed
cp .env.development.local .env.production.local
```

Start the HTTP server in watch mode:

```bash
npm run dev
```

or run the compiled build:

```bash
npm run start
```

## 📁 Project Structure

```
src/
├── app.ts                 # Express app bootstrap
├── controllers/           # Route handlers (request/response shaping)
├── middleware/            # Shared middleware (404 + error handler)
├── models/                # Mongoose schemas/models
├── routes/                # Express routers
├── services/              # Business logic (product + review services)
└── types/                 # Shared TypeScript DTOs
```

## 🛠 Scripts

| Script        | Description                                      |
| ------------- | ------------------------------------------------ |
| `npm run dev` | Start Express in watch mode with dev env vars    |
| `npm run build` | Compile TypeScript into `dist/`                |
| `npm run start` | Build (via `prestart`) and run `dist/app.js`   |

## 🔌 Environment Variables

| Variable  | Description                                     |
| --------- | ----------------------------------------------- |
| `MONGO_URI` | MongoDB connection string                     |
| `PORT`      | Port for the Express server (default: `3000`) |

## 📚 API Reference

All responses are JSON. Errors return `{ "message": string }` with the corresponding HTTP status. Unknown routes respond with HTTP `404`.

### Products

| Method & Path        | Description                            |
| -------------------- | -------------------------------------- |
| `POST /products`     | Create a product                       |
| `GET /products`      | List products (optionally filter by tag) |
| `GET /products/:id`  | Retrieve a product by ID               |
| `PUT /products/:id`  | Update a product                       |
| `DELETE /products/:id` | Delete a product                     |

#### Create a product

```
POST /products
Content-Type: application/json

{
  "name": "Desk Lamp",
  "price": 39.99,
  "stock": 25,
  "tags": ["lighting", "office"]
}
```

Successful response: `201 Created`

```json
{
  "_id": "68ff...",
  "name": "Desk Lamp",
  "price": 39.99,
  "stock": 25,
  "tags": ["lighting", "office"],
  "createdAt": "2025-01-04T10:03:21.930Z"
}
```

Validation rules:

- `name` (string), `price` (number), and `stock` (number) are required.
- `tags` is optional; if supplied it must be an array of strings.

#### List products

```
GET /products
GET /products?tag=lighting
```

Returns an array of products. Passing `tag` filters to products containing the tag.

#### Update a product

```
PUT /products/68ff...
Content-Type: application/json

{
  "price": 42.5,
  "stock": 20,
  "tags": ["lighting"]
}
```

Only provided fields are updated; each is validated using the same rules as creation.

### Product Reviews

| Method & Path        | Description                                     |
| -------------------- | ----------------------------------------------- |
| `POST /reviews`      | Create a review for a product                   |
| `GET /reviews`       | List reviews (product details are populated)    |
| `GET /reviews/:id`   | Retrieve a single review                        |
| `PUT /reviews/:id`   | Update rating/comment                           |
| `DELETE /reviews/:id`| Delete a review                                 |

#### Review response shape

```json
{
  "_id": "6902...",
  "product": {
    "_id": "68ff...",
    "name": "Desk Lamp",
    "price": 39.99,
    "stock": 25,
    "tags": ["lighting", "office"]
  },
  "rating": 9,
  "comment": "Great lamp!",
  "createdAt": "2025-01-04T11:12:33.401Z"
}
```

#### Create a review

```
POST /reviews
Content-Type: application/json

{
  "productId": "68ff40c33d185ed573197d1",
  "rating": 8,
  "comment": "Solid build quality."
}
```

Rules:

- `productId` must be a valid MongoDB ObjectId referencing an existing product.
- `comment` (string) is required.
- `rating` is optional; if provided it must be numeric.

#### Update a review

```
PUT /reviews/6902...
Content-Type: application/json

{
  "rating": 10,
  "comment": "Updated after 1 month — still great!"
}
```

### Error Handling

- Unmatched routes → `404 { "message": "Route not implemented" }`
- Validation failures → `400 { "message": "..." }`
- Unexpected errors → `500 { "message": "Internal server error" }` (with stack traces logged in non-production environments)

## 🔧 Development Notes

- Uses Express 5 with `path-to-regexp@6`.
- Path aliases (`#services`, `#routes`, `#middleware`, etc.) are configured via the `imports` map in `package.json` and TypeScript `paths`.
- Services encapsulate business logic, keeping controllers thin.
- Review responses populate product details while create/update requests still accept `productId`.

---

Happy hacking! Contributions and suggestions are welcome.
