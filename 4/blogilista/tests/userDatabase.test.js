const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./userDatabaseTestHelper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("User database tests", () => {
  describe("Get users tests", () => {
    test("Get users request", async () => {
      await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("Get users length", async () => {
      const res = await helper.getUsersInDatabase();
      expect(res).toHaveLength(helper.initialUsers.length);
    });

    test("Get users data", async () => {
      const res = await helper.getUsersInDatabase();
      const expectedResult = helper.initialUsers.map((user) => new User(user).toJSON());
      expect(res).toEqual(expectedResult);
    });
  });

  describe("Add user tests", () => {
    test("Add a user blog", async () => {
      const user = { username: "hacker2020", password: "qwerty123456", name: "Golden hat" };
      const addUserRes = await api.post("/api/users").send(user);
      expect(addUserRes.status).toBe(201);
      expect(addUserRes.type).toBe("application/json");
      const addedUser = addUserRes.body;
      const formatedUser = { ...addedUser };
      delete formatedUser.id;
      expect(formatedUser).toEqual({ username: user.username, name: user.name, blogs: [] });

      const res = await helper.getUsersInDatabase();
      expect(res).toHaveLength(helper.initialUsers.length + 1);
      expect(res).toContainEqual(addedUser);
    });

    test("Add a user with invalid password", async () => {
      const users = await helper.getUsersInDatabase();
      const user = { username: "User", password: "0", name: "Invalid User" };
      const addUserRes = await api.post("/api/users").send(user);
      expect(addUserRes.status).toBe(400);
      expect(addUserRes.body).toEqual({ error: "Password must contain at least 3 characters" });
      const usersAfterAdd = await helper.getUsersInDatabase();
      expect(users).toEqual(usersAfterAdd);
    });

    test("Add a user with invalid username", async () => {
      const users = await helper.getUsersInDatabase();
      const user = { username: "Me", password: "!3252dfgQ", name: "Invalid User" };
      const addUserRes = await api.post("/api/users").send(user);
      expect(addUserRes.status).toBe(400);
      expect(addUserRes.body.error).toContain("`username`");
      expect(addUserRes.body.error).toContain("is shorter than the minimum allowed length (3)");
      const usersAfterAdd = await helper.getUsersInDatabase();
      expect(users).toEqual(usersAfterAdd);
    });

    test("Add a user with missing data", async () => {
      const users = await helper.getUsersInDatabase();
      const user = {};
      const addUserRes = await api.post("/api/users").send(user);
      expect(addUserRes.status).toBe(400);
      expect(addUserRes.body).toEqual({ error: "Username and password is required" });
      const usersAfterAdd = await helper.getUsersInDatabase();
      expect(users).toEqual(usersAfterAdd);
    });

    test("Add a user with existing username", async () => {
      const users = await helper.getUsersInDatabase();
      const user = { username: "admin", password: "qwerty123456", name: "Golden hat" };
      const addUserRes = await api.post("/api/users").send(user);
      expect(addUserRes.status).toBe(400);
      expect(addUserRes.body.error).toContain("`username` to be unique");
      const usersAfterAdd = await helper.getUsersInDatabase();
      expect(users).toEqual(usersAfterAdd);
    });
  });

  /*
  describe("Get specific blog tests", () => {
    test("Get blog with specific id", async () => {
      const res = await helper.getBlogsInDatabase();
      const firstBlog = res[0];
      const blog = await api.get(`/api/blogs/${firstBlog.id}`);
      expect(blog.body).toEqual(firstBlog);
    });

    test("Get blog with non-exsisting id", async () => {
      const invalidId = await helper.getNonExsistingId();
      const res = await api.get(`/api/blogs/${invalidId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Delete blog tests", () => {
    test("Delete blog with specific id", async () => {
      const res = await helper.getBlogsInDatabase();
      const firstBlog = res[0];
      const deleteRes = await api.delete(`/api/blogs/${firstBlog.id}`);
      expect(deleteRes.status).toBe(204);
      const blogs = await helper.getBlogsInDatabase();
      expect(blogs).not.toContainEqual(firstBlog);
    });

    test("Delete blog with non-existing id", async () => {
      const invalidId = await helper.getNonExsistingId();
      const deleteRes = await api.delete(`/api/blogs/${invalidId}`);
      expect(deleteRes.status).toBe(404);
    });
  });

  describe("Update blog tests", () => {
    test("Update blog with likes", async () => {
      const res = await helper.getBlogsInDatabase();
      const firstBlog = { ...res[0], likes: 9001 };
      const blog = await api.put(`/api/blogs/${firstBlog.id}`).send({ likes: 9001 });
      expect(blog.body).toEqual(firstBlog);
    });

    test("Update blog with invalid data", async () => {
      const res = await helper.getBlogsInDatabase();
      const blog = await api.put(`/api/blogs/${res[0].id}`).send({ likes: "9001" });
      expect(blog.status).toBe(400);
    });

    test("Update blog with non-exsisting id", async () => {
      const invalidId = await helper.getNonExsistingId();
      const res = await api.put(`/api/blogs/${invalidId}`).send({ likes: 9001 });
      expect(res.status).toBe(404);
    });
  });
  */
});

afterAll(() => {
  mongoose.connection.close();
});
