import supertest from "supertest";
import app from "../../server";
import client from "../../database";

const request = supertest(app);

describe("API Endpoints", () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const conn = await client.connect();
    try {
      await conn.query("DELETE FROM order_products");
      await conn.query("DELETE FROM orders");
      await conn.query("DELETE FROM products");
      await conn.query("DELETE FROM users");
    } finally {
      conn.release();
    }

    // base user
    const userRes = await request.post("/users").send({
      firstname: "Sarah",
      lastname: "Masri",
      password: "Sarah@4321",
    });

    expect(userRes.status).toBe(201);

    token = userRes.body.token;
    userId = userRes.body.user.id;

    expect(token).toBeDefined();
    expect(userId).toBeDefined();
  });

  afterAll(async () => {
    const conn = await client.connect();
    try {
      await conn.query("DELETE FROM order_products");
      await conn.query("DELETE FROM orders");
      await conn.query("DELETE FROM products");
      await conn.query("DELETE FROM users");
    } finally {
      conn.release();
    }
  });

  // users
  it("should create a user via POST /users and return a token", async () => {
    const res = await request.post("/users").send({
      firstname: "Bashar",
      lastname: "Jawad",
      password: "1234",
    });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it("should get list of users via GET /users with token", async () => {
    const res = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a user by id via GET /users/:id with token", async () => {
    const res = await request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(userId);
  });

  // products
  it("should create a product via POST /products with token", async () => {
    const res = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hair Mask",
        price: 25,
        category: "Hair",
      });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe("Hair Mask");
  });

  it("should get list of products via GET /products", async () => {
    // ensure at least one product exists
    await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hair Serum",
        price: 40,
        category: "Hair",
      });

    const res = await request.get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a product by id via GET /products/:id", async () => {
    // create product 
    const createRes = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Blow Dryer",
        price: 120,
        category: "Hair",
      });

    expect(createRes.status).toBe(201);
    const productId = createRes.body.id;

    const res = await request.get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(productId);
  });

  // orders
  it("should create an order via POST /orders/:userid with token", async () => {
    const res = await request
      .post(`/orders/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.order).toBeDefined();
    expect(res.body.order.userid).toBe(userId);
    expect(res.body.order.status).toBe("active");
  });

  it("should add a product to order via POST /orders/:orderid/products with token", async () => {
    // create product
    const prodRes = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Heat Protectant Spray",
        price: 35,
        category: "Hair",
      });

    expect(prodRes.status).toBe(201);
    const productId = prodRes.body.id;

    // create an order
    const orderRes = await request
      .post(`/orders/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.order.id;

    // add product to that order
    const res = await request
      .post(`/orders/${orderId}/products`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productid: productId,
        quantity: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.productAdded).toBeDefined();
    expect(res.body.productAdded.orderid).toBe(orderId);
    expect(res.body.productAdded.productid).toBe(productId);
    expect(res.body.productAdded.quantity).toBe(2);
  });

  it("should get current active order for user via GET /orders/current/:userid with token", async () => {
    // create product
    const prodRes = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hair Oil",
        price: 30,
        category: "Hair",
      });

    expect(prodRes.status).toBe(201);
    const productId = prodRes.body.id;

    // create order
    const orderRes = await request
      .post(`/orders/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.order.id;

    // add product to that order
    const addRes = await request
      .post(`/orders/${orderId}/products`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productid: productId,
        quantity: 1,
      });

    expect(addRes.status).toBe(201);

    // now get current active order
    const res = await request
      .get(`/orders/current/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.userid).toBe(userId);
    expect(res.body.status).toBe("active");
    expect(Array.isArray(res.body.products)).toBeTrue();
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].productid).toBe(productId);
  });

  // negative authentication test
  it("should fail to access protected route without token", async () => {
    const res = await request.get("/users");

    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThan(500);
  });
});
