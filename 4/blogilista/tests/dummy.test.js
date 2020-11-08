const bloglistHelper = require("../utils/bloglist_helper");

test("dummy returns 1", () => {
  const blogs = [];

  const result = bloglistHelper.dummy(blogs);
  expect(result).toBe(1);
});
