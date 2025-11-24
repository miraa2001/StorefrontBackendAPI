import { ProductModel, Product } from "../../models/product";
import client from "../../database";

const productModel = new ProductModel();

describe("ProductModel", () => {
  let createdProduct: Product;

  beforeAll(async () => {
    createdProduct = await productModel.create({
      name: "Blow Dryer",
      price: 200,
      category: "Hair",
    }) as Product;
  });

  afterAll(async () => {
    const conn = await client.connect();
    try {
      await conn.query("DELETE FROM order_products");
      await conn.query("DELETE FROM products");
    } finally {
      conn.release();
    }
  });

  it("should have a create method", () => {
    expect(productModel.create).toBeDefined();
  });

  it("should have an index method", () => {
    expect(productModel.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(productModel.show).toBeDefined();
  });

  it("create should add a new product", async () => {
    expect(createdProduct).toBeDefined();
    expect(createdProduct.id).toBeDefined();
    expect(createdProduct.name).toBe("Blow Dryer");
    expect(createdProduct.price.toString()).toBe("200.00");
    expect(createdProduct.category).toBe("Hair");
  });

  it("index should return a list of products including the created one", async () => {
    const products = await productModel.index();

    expect(products.length).toBeGreaterThan(0);

    const found = products.find((p) => p.id === createdProduct.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Blow Dryer");
  });

  it("show should return the correct product by id", async () => {
    const product = await productModel.show(createdProduct.id as number);

    expect(product).toBeDefined();
    expect(product?.id).toBe(createdProduct.id);
    expect(product?.name).toBe("Blow Dryer");
  });
});
