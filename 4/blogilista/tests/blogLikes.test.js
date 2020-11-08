const Blog = require("../models/blog");

describe("Blog likes default value", () => {
  test("Set blog likes to 0 if likes is not defined", async () => {
    const blogLikesUndefined = new Blog({ title: "8-bit gaming and you", author: "The Ancient One", url: "http://urlnotfound404.com" });
    expect(blogLikesUndefined.likes).toBeDefined();
    expect(blogLikesUndefined.likes).toBe(0);
  });
});
