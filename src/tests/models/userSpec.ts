import { UserModel, User } from "../../models/user";
import client from "../../database";

const userModel = new UserModel();

describe("UserModel", () => {
  let createdUser: User;

  beforeAll(async () => {
    createdUser = await userModel.create({
      firstname: "Ahmad",
      lastname: "Ali",
      password: "ahmad@123Ali",
    }) as User;
  });

  afterAll(async () => {
    const conn = await client.connect();
    try {
      await conn.query("DELETE FROM users");
    } finally {
      conn.release();
    }
  });

  it("should have an index method", () => {
    expect(userModel.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(userModel.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(userModel.create).toBeDefined();
  });

  it("should have an authenticate method", () => {
    expect(userModel.authenticate).toBeDefined();
  });

  it("create should add a new user with a hashed password", async () => {
    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.firstname).toBe("Ahmad");
    expect(createdUser.lastname).toBe("Ali");
    // password in DB shouldn't be the plain text
    expect(createdUser.password).not.toBe("ahmad@123Ali");
  });

  it("index should return a list of users including the created one", async () => {
    const users = await userModel.index();

    expect(users.length).toBeGreaterThan(0);

    const found = users.find((u) => u.id === createdUser.id);
    expect(found).toBeDefined();
    expect(found?.firstname).toBe("Ahmad");
  });

  it("show should return the correct user by id", async () => {
    const user = await userModel.show(createdUser.id as number);

    expect(user).toBeDefined();
    expect(user?.id).toBe(createdUser.id);
    expect(user?.firstname).toBe("Ahmad");
  });

  it("authenticate should return the user with correct credentials", async () => {
    const authedUser = await userModel.authenticate(
      "Ahmad",
      "ahmad@123Ali"
    );

    expect(authedUser).toBeDefined();
    expect(authedUser?.id).toBe(createdUser.id);
  });

  it("authenticate should return null/undefined with wrong password", async () => {
    const authedUser = await userModel.authenticate(
      "Ahmad",
      "wrongpassword"
    );

    expect(authedUser).toBeFalsy();
  });
});
