CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    orderid INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    productid INTEGER REFERENCES products(id) ON DELETE CASCADE
);yarn