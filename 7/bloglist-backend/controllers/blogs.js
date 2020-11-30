const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }).populate("comments", { text: 1, date: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  if (!req.body.title && !req.body.url && !req.body.uId) {
    return res.status(400).end();
  }

  const decodedToken = req.token ? jwt.verify(req.token, process.env.TOKEN_SECRET) : null;

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({ title: req.body.title, author: req.body.author, url: req.body.url, likes: req.body.likes, user });

  const result = await blog.save();
  if (result) {
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    res.status(201).json(result);
  } else {
    res.status(500).json({ error: "Unable to create blog" });
  }
});

blogsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id).populate("user", { username: 1, name: 1 }).populate("comments", { text: 1, date: 1 });
  blog ? res.json(blog) : res.status(404).end();
});

blogsRouter.put("/:id", async (req, res) => {
  if (!Number.isInteger(req.body.likes)) {
    return res.status(400).end();
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { likes: req.body.likes }, { new: true })
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { text: 1, date: 1 });
  updatedBlog ? res.json(updatedBlog) : res.status(404).end();
});

blogsRouter.post("/:id/comments", async (req, res, next) => {
  if (!req.body.text) {
    return next({ name: "ValidationError", message: "Comment is empty" });
  }

  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).end();
  }

  const comment = new Comment({
    text: req.body.text,
    date: new Date(),
    blog,
  });

  const result = await comment.save();

  if (result) {
    blog.comments = blog.comments.concat(result._id);
    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog);
  } else {
    res.status(500).json({ error: "Unable to add comment" });
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).end();
  }
  const decodedToken = req.token ? jwt.verify(req.token, process.env.TOKEN_SECRET) : null;

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user || blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  if (deletedBlog) {
    user.blogs = user.blogs.filter((blog) => blog.id !== deletedBlog.id);
    await user.save();
    await Comment.deleteMany({ blog: req.params.id });
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;
