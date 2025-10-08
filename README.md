# Sembako E-Commerce Backend API

A REST API backend for sembako (basic necessities) e-commerce application built with Express.js, Sequelize, and PostgreSQL.

## Features

- **Authentication**: JWT-based user authentication
- **Product Management**: Browse products and get product details
- **Shopping Cart**: Add, update, and remove items from cart
- **Transaction Processing**: Checkout cart and view transaction history
- **User Isolation**: Users can only access their own cart and transactions
- **API Documentation**: Interactive Swagger documentation
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **Sequelize CLI** - Database migration and seeder management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finest-backend-test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sembako_db
   DB_USER=admin
   DB_PASSWORD=password123
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   ```

4. **Set up PostgreSQL database**

   Make sure PostgreSQL is running and create the database:

   ```sql
   CREATE DATABASE sembako_db;
   ```

5. **Run database migrations and seeders**

   **Option A: Using CLI commands (Recommended for production)**

   ```bash
   npm run db:migrate    # Run all pending migrations
   npm run db:seed       # Run all seeders
   ```

   **Option B: Using auto-sync (Simpler for development)**

   ```bash
   npm start             # Will auto-sync and seed if tables don't exist
   ```

   **Reset database completely:**

   ```bash
   npm run db:reset      # Undo all migrations, re-run migrations and seeders
   ```

6. **Start the application**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to access the interactive Swagger documentation.

## API Endpoints

### Authentication

#### Login

- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com"
    }
  }
  ```

### Products

#### Get All Products

- **GET** `/api/products`
- **Description**: Get all available products
- **Response**:
  ```json
  {
    "message": "Products retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Beras",
        "description": "Beras kualitas premium 5kg",
        "price": "75000.00",
        "stock": 100,
        "category": "Bahan Pokok",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get Product by ID

- **GET** `/api/products/:id`
- **Description**: Get specific product details
- **Parameters**: `id` (path parameter)
- **Response**:
  ```json
  {
    "message": "Product retrieved successfully",
    "data": {
      "id": 1,
      "name": "Beras",
      "description": "Beras kualitas premium 5kg",
      "price": "75000.00",
      "stock": 100,
      "category": "Bahan Pokok"
    }
  }
  ```

### Cart (Requires Authentication)

All cart endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Get Cart Items

- **GET** `/api/cart`
- **Description**: Get all items in user's cart
- **Response**:
  ```json
  {
    "message": "Cart items retrieved successfully",
    "data": {
      "items": [
        {
          "id": 1,
          "quantity": 2,
          "Product": {
            "id": 1,
            "name": "Beras",
            "price": "75000.00",
            "stock": 98
          }
        }
      ],
      "totalAmount": "150000.00",
      "itemCount": 1
    }
  }
  ```

#### Add Item to Cart

- **POST** `/api/cart`
- **Request Body**:
  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Item added to cart successfully",
    "data": {
      "id": 1,
      "quantity": 2,
      "Product": {
        "id": 1,
        "name": "Beras",
        "price": "75000.00"
      }
    }
  }
  ```

#### Update Cart Item

- **PUT** `/api/cart/:id`
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```

#### Remove Item from Cart

- **DELETE** `/api/cart/:id`

### Transactions (Requires Authentication)

#### Checkout Transaction

- **POST** `/api/transactions/checkout`
- **Description**: Process checkout for all items in cart
- **Response**:
  ```json
  {
    "message": "Transaction completed successfully",
    "data": {
      "id": 1,
      "userId": 1,
      "totalAmount": "150000.00",
      "status": "completed",
      "items": [
        {
          "productId": 1,
          "name": "Beras",
          "price": 75000,
          "quantity": 2,
          "subtotal": "150000.00"
        }
      ]
    }
  }
  ```

#### Get Transaction by ID

- **GET** `/api/transactions/:id`
- **Description**: Get specific transaction (user's own transactions only)
- **Response**:
  ```json
  {
    "message": "Transaction retrieved successfully",
    "data": {
      "id": 1,
      "userId": 1,
      "totalAmount": "150000.00",
      "status": "completed",
      "items": [...],
      "createdAt": "2023-01-01T12:00:00.000Z"
    }
  }
  ```

## Database Migrations and Seeders

### Migrations

Migrations are located in `src/database/migrations/` and manage database schema changes:

- `20240101000001-create-users.js` - Users table
- `20240101000002-create-products.js` - Products table
- `20240101000003-create-carts.js` - Carts table with foreign keys
- `20240101000004-create-transactions.js` - Transactions table

### Seeders

Seeders are located in `src/database/seeders/` and populate initial data:

- `20240101000001-users.js` - Creates 2 test users
- `20240101000002-products.js` - Creates 8 sample products

### Available Scripts

- `npm run db:migrate` - Run all pending migrations
- `npm run db:seed` - Run all seeders
- `npm run db:reset` - Reset database (undo all migrations, re-migrate, and seed)

## Default Test Data

The application creates default test data via seeders:

### Test Users

- **Username**: `testuser`, **Password**: `password123`
- **Username**: `user2`, **Password**: `password123`

### Sample Products

- Beras (5kg) - Rp 75,000
- Minyak Goreng (2L) - Rp 30,000
- Gula Pasir (1kg) - Rp 15,000
- Telur (1kg) - Rp 25,000
- Tepung Terigu (1kg) - Rp 12,000
- Mie Instant (40pcs) - Rp 60,000
- Kecap Manis (600ml) - Rp 18,000
- Garam (500g) - Rp 8,000

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid or missing token)
- **403**: Forbidden (access denied)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate entry)
- **500**: Internal Server Error

Error response format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [...] // Optional for validation errors
}
```

## Database Schema

See [ERD.md](./ERD.md) for detailed database schema and relationships.

## License

ISC
