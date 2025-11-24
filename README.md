# **Storefront Backend API**

A RESTful **Node.js + Express + PostgreSQL** backend for an e-commerce store.

---

## **Environment Variables**

Create a `.env` file in the project root and include the following:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=my_store_dev
POSTGRES_TEST_DB=my_store_test
POSTGRES_USER=my_store_user
POSTGRES_PASSWORD=1234
ENV=dev
PORT=3000

# Secrets — replace with your own values
BCRYPT_PASSWORD=your_pepper_here
SALT_ROUNDS=10
TOKEN_SECRET=your_jwt_secret_here
```

---

## **Database Setup**

Open **psql** and create the databases & user:

```sql
CREATE USER my_store_user WITH PASSWORD '1234';

CREATE DATABASE my_store_dev OWNER my_store_user;
CREATE DATABASE my_store_test OWNER my_store_user;

GRANT ALL PRIVILEGES ON DATABASE my_store_dev TO my_store_user;
GRANT ALL PRIVILEGES ON DATABASE my_store_test TO my_store_user;
```

Run migrations:

```bash
npm run migrate
npm run migrate-test
```
Run down migrations:

```bash
npm run migrate-down
npm run migrate-test-down
```
---

## **Run the project**

Start in development mode:

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

Start the built server:

```bash
npm start
```

Run tests:
```bash
npm test
```

---

## **Authentication**

You receive a JWT token **after creating a user** or using the `/users/auth` login route.

Include it in protected requests:

```
Authorization: Bearer <token>
```

---

## **API Documentation**

### **Base URL**
```
http://localhost:3000
```

---

## **Users**

### **POST /users**
Create a new user.

Body:
```json
{
  "firstname": "Mira",
  "lastname": "Jamous",
  "password": "1234"
}
```

---

### **POST /users/auth**
Authenticate a user and return a token.

Body:
```json
{
  "firstname": "Mira",
  "password": "1234"
}
```

---

### **GET /users**
Requires JWT.  
Returns all users.

### **GET /users/:id**
Requires JWT.  
Returns one specific user.

---

## **Products**

### **GET /products**
Returns product list.

### **GET /products/:id**
Returns a single product.

### **POST /products**
Requires JWT.  
Create a new product.

Body:
```json
{
  "name": "Hair Mask",
  "price": 15,
  "category": "Hair"
}
```

---

## **Orders**

### **POST /orders/:userid**
Requires JWT.  
Creates a new active order for a user.

---

### **POST /orders/:orderid/products**
Requires JWT.  
Adds a product to the order.

Body:
```json
{
  "productid": 5,
  "quantity": 3
}
```

---

### **GET /orders/current/:userid**
Requires JWT.  
Returns the user's active order with products.

---

## **Postman Collection**

[You can import and test all routes using this shared Postman collection](https://mirajamous-6578422.postman.co/workspace/Mira-Jamous's-Workspace~639ccec8-d285-4efa-8ebc-fad4f67150b8/collection/46846193-09f71b0b-77c1-4ff7-9c55-2d4582a5b038?action=share&source=copy-link&creator=46846193)