# Entity Relationship Diagram (ERD)

## Database Schema

### Tables

#### Users
- **id** (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- **username** (VARCHAR, UNIQUE, NOT NULL)
- **email** (VARCHAR, UNIQUE, NOT NULL)
- **password** (VARCHAR, NOT NULL)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

#### Products
- **id** (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- **name** (VARCHAR, NOT NULL)
- **description** (TEXT)
- **price** (DECIMAL(10,2), NOT NULL)
- **stock** (INTEGER, NOT NULL, DEFAULT 0)
- **category** (VARCHAR)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

#### Carts
- **id** (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- **user_id** (INTEGER, FOREIGN KEY → Users.id, NOT NULL)
- **product_id** (INTEGER, FOREIGN KEY → Products.id, NOT NULL)
- **quantity** (INTEGER, NOT NULL, DEFAULT 1)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

#### Transactions
- **id** (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- **user_id** (INTEGER, FOREIGN KEY → Users.id, NOT NULL)
- **total_amount** (DECIMAL(10,2), NOT NULL)
- **status** (ENUM: 'pending', 'completed', 'cancelled', DEFAULT 'pending')
- **items** (JSON, NOT NULL)
- **created_at** (TIMESTAMP)
- **updated_at** (TIMESTAMP)

## Relationships

### One-to-Many Relationships
- **Users** 1:N **Carts** (One user can have many cart items)
- **Products** 1:N **Carts** (One product can be in many carts)
- **Users** 1:N **Transactions** (One user can have many transactions)

### Constraints
- Each user can only see/manage their own cart items and transactions
- Products in cart must exist and have sufficient stock
- Transaction checkout validates stock availability and updates product stock
- Cart items are automatically removed after successful checkout

## Business Logic Flow
1. **Authentication**: User login creates JWT token
2. **Product Browsing**: Get all products or specific product details
3. **Cart Management**: Add, update, remove items from cart (user-specific)
4. **Checkout**: Process transaction, update stock, clear cart
5. **Transaction History**: View user's own transactions

## Data Integrity
- Unique constraints on username and email
- Foreign key constraints ensure data consistency
- Stock validation prevents overselling
- User isolation ensures data privacy