# API Requirements

The company stakeholders want to create an online storefront to showcase their product ideas.  
Users need to be able to:

- Browse an index of all products
- See the details of a single product
- Create orders and add products to them
- View their current active order

I have been tasked with building the API that will support this application.

These are the agreed endpoints and data shapes, plus the database schema that backs them.

---

## API Endpoints

> Base URL: `http://localhost:3000`

### Products

- **Index**  
  - **Route:** `/products`  
  - **Method:** `GET`  
  - **Auth:** Not required  
  - **Description:** Returns a list of all products.

- **Show**  
  - **Route:** `/products/:id`  
  - **Method:** `GET`  
  - **Auth:** Not required  
  - **Description:** Returns a single product by id.

- **Create**  
  - **Route:** `/products`  
  - **Method:** `POST`  
  - **Auth:** **Token required**  
  - **Description:** Creates a new product.  
  - **Request body:**
    ```json
    {
      "name": "Hair Mask",
      "price": 15,
      "category": "Hair"
    }
    ```

---

### Users

- **Index**  
  - **Route:** `/users`  
  - **Method:** `GET`  
  - **Auth:** **Token required**  
  - **Description:** Returns a list of all users (without passwords).

- **Show**  
  - **Route:** `/users/:id`  
  - **Method:** `GET`  
  - **Auth:** **Token required**  
  - **Description:** Returns a single user by id.

- **Create**  
  - **Route:** `/users`  
  - **Method:** `POST`  
  - **Auth:** Not required  
  - **Description:** Creates a new user and returns a token.

- **Authenticate**  
  - **Route:** `/users/auth`  
  - **Method:** `POST`  
  - **Auth:** Not required  
  - **Description:** Authenticates a user and returns a token.

---

### Orders

- **Create order**  
  - **Route:** `/orders/:userid`  
  - **Method:** `POST`  
  - **Auth:** Token required  

- **Add product to order**  
  - **Route:** `/orders/:orderid/products`  
  - **Method:** `POST`  
  - **Auth:** Token required  

- **Current order by user**  
  - **Route:** `/orders/current/:userid`  
  - **Method:** `GET`  
  - **Auth:** Token required  

---

## Data Shapes

### Product
```
type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};
```

### User
```
type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
};
```

### Order
```
type Order = {
  id?: number;
  userid: number;
  status: string;
};
```

### OrderProduct
```
type OrderProduct = {
  id?: number;
  quantity: number;
  productid: number;
  orderid: number;
};
```

---

## Database Schema

### users
```
id SERIAL PRIMARY KEY
firstname VARCHAR NOT NULL
lastname VARCHAR NOT NULL
password VARCHAR NOT NULL
```

### products
```
id SERIAL PRIMARY KEY
name VARCHAR NOT NULL
price NUMERIC NOT NULL
category VARCHAR
```

### orders
```
id SERIAL PRIMARY KEY
userid INTEGER REFERENCES users(id)
status VARCHAR NOT NULL
```

### order_products
```
id SERIAL PRIMARY KEY
quantity INTEGER NOT NULL
orderid INTEGER REFERENCES orders(id)
productid INTEGER REFERENCES products(id)
```
