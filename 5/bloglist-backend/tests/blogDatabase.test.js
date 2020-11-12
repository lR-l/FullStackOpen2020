const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./blogDatabaseTestHelper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

const testUser = {
  _id: "5fa7ce4f2243ab2b5012a8dd",
  username: "hw!",
  passwordHash: "$2a$10$7MRNanT6Zz3WzbtBfobixe3Q6vwQ5Vd3ATRsehgjTBsDeQ2Sm5TeG",
  name: "Hello World",
  blogs: [
    "5a422a851b54a676234d17f7",
    "5a422aa71b54a676234d17f8",
    "5a422b3a1b54a676234d17f9",
    "5a422b891b54a676234d17fa",
    "5a422ba71b54a676234d17fb",
    "5a422bc61b54a676234d17fc",
  ],
};

beforeEach(async () => {
  await User.deleteMany({});
  await User.create(testUser);
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("Blog database tests", () => {
  describe("Get blogs tests", () => {
    test("Get blogs request", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("Get blogs length", async () => {
      const res = await helper.getBlogsInDatabase();
      expect(res).toHaveLength(helper.initialBlogs.length);
    });

    test("Get blogs data", async () => {
      const res = await helper.getBlogsInDatabase();
      const expectedResult = helper.initialBlogs.map((blog) => {
        const testBlog = new Blog(blog).toJSON();
        return { ...testBlog, user: { id: testUser._id, username: testUser.username, name: testUser.name } };
      });
      expect(res).toEqual(expectedResult);
    });

    test("Get blogs id field", async () => {
      const res = await helper.getBlogsInDatabase();
      expect(res[0].id).toBeDefined();
    });
  });

  describe("Add blog tests", () => {
    test("Add a new blog", async () => {
      const blog = { title: "8-bit gaming and you", author: "The Ancient One", url: "http://urlnotfound404.com", likes: 0 };
      const addBlogRes = await api.post("/api/blogs").send(blog).set({
        Authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh3ISIsImlkIjoiNWZhN2NlNGYyMjQzYWIyYjUwMTJhOGRkIiwiaWF0IjoxNjA0ODM4ODQzfQ.MgUlQ8xqxWVA64StMtc3bV-fDM-13KsC5nP9mz95bEk",
      });
      expect(addBlogRes.status).toBe(201);
      expect(addBlogRes.type).toBe("application/json");
      const addedBlog = addBlogRes.body;
      const formatedBlog = { ...addedBlog };
      delete formatedBlog.id;
      expect(formatedBlog).toEqual({
        ...blog,
        user: { id: testUser._id, username: testUser.username, name: testUser.name, blogs: [...testUser.blogs, addedBlog.id] },
      });
      const formatedAddedBlog = { ...addedBlog };
      delete formatedAddedBlog.user.blogs;
      const res = await helper.getBlogsInDatabase();
      expect(res).toHaveLength(helper.initialBlogs.length + 1);
      expect(res).toContainEqual(formatedAddedBlog);
    });

    test("Add a new blog with no authorization token", async () => {
      const blog = { title: "8-bit gaming and you", author: "The Ancient One", url: "http://urlnotfound404.com", likes: 0 };
      const addBlogRes = await api.post("/api/blogs").send(blog);
      expect(addBlogRes.status).toBe(401);
    });

    test("Add a new blog with invalid authorization token", async () => {
      const blog = { title: "8-bit gaming and you", author: "The Ancient One", url: "http://urlnotfound404.com", likes: 0 };
      const addBlogRes = await api.post("/api/blogs").send(blog).set({
        Authorization: "bearer yJhbGciOiJIUzI1NiIQ8xqxWVA64StMtc3bV-fDM-13KsC5nP9mz95bEk",
      });
      expect(addBlogRes.status).toBe(401);
    });

    test("Add a new blog without title and url", async () => {
      const blog = { author: "The Ancient One", likes: 0 };
      const addBlogRes = await api.post("/api/blogs").send(blog);
      expect(addBlogRes.status).toBe(400);
    });
  });

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
      const deleteRes = await api.delete(`/api/blogs/${firstBlog.id}`).set({
        Authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh3ISIsImlkIjoiNWZhN2NlNGYyMjQzYWIyYjUwMTJhOGRkIiwiaWF0IjoxNjA0ODM4ODQzfQ.MgUlQ8xqxWVA64StMtc3bV-fDM-13KsC5nP9mz95bEk",
      });
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
});

afterAll(() => {
  mongoose.connection.close();
});
