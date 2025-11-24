import { OrderModel, Order, OrderProduct, OrderShape } from "../../models/order";
import client from "../../database";

const orderModel = new OrderModel();

describe("OrderModel", () => {
  let testUserId: number;
  let testProductId: number;
  let createdOrder: Order;
  let createdOrderProduct: OrderProduct;

  beforeAll(async () => {
    const conn = await client.connect();
    try {
      const userResult = await conn.query(
        "INSERT INTO users(firstname, lastname, password) VALUES($1, $2, $3) RETURNING id",
        ["Mira", "Jamous", "fingerscrossed@123"]
      );
      testUserId = userResult.rows[0].id;
      const productResult = await conn.query(
        "INSERT INTO products(name, price, category) VALUES($1, $2, $3) RETURNING id",
        ["Order Test Product", 25, "order-test-category"]
      );
      testProductId = productResult.rows[0].id;
      createdOrder = await orderModel.create(testUserId);
      createdOrderProduct = await orderModel.addProduct(2, createdOrder.id as number, testProductId);
    } finally {
      conn.release();
    }
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

  it("should have a create method", () => {
    expect(orderModel.create).toBeDefined();
  });

  it("should have an addProduct method", () => {
    expect(orderModel.addProduct).toBeDefined();
  });

  it("should have a currentByUser method", () => {
    expect(orderModel.currentByUser).toBeDefined();
  });

  it("create should create an active order for a user", async () => {
    expect(createdOrder).toBeDefined();
    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.userid).toBe(testUserId);
    expect(createdOrder.status).toBe("active");
  });

  it("addProduct should add a product to an order", async () => {
    expect(createdOrderProduct).toBeDefined();
    expect(createdOrderProduct.id).toBeDefined();
    expect(createdOrderProduct.orderid).toBe(createdOrder.id!);
    expect(createdOrderProduct.productid).toBe(testProductId);
    expect(createdOrderProduct.quantity).toBe(2);
  });

  it("currentByUser should return the current active order with its products", async () => {
    const currentOrder = await orderModel.currentByUser(testUserId) as OrderShape;

    expect(currentOrder).toBeDefined();
    expect(currentOrder.id).toBe(createdOrder.id);
    expect(currentOrder.userid).toBe(testUserId);
    expect(currentOrder.status).toBe("active");
    expect(currentOrder.products).toBeDefined();
    expect((currentOrder.products as any[]).length).toBeGreaterThan(0);

    const firstProduct = currentOrder.products![0];

    expect(firstProduct.productid).toBe(testProductId);
    expect(firstProduct.quantity).toBe(2);
    expect(typeof firstProduct.name).toBe("string");
  });
});
