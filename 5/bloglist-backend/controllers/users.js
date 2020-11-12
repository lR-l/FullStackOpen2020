const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", { user: 0, likes: 0 });
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return next({ name: "ValidationError", message: "Username and password is required" });
  }
  if (req.body.password.length < 3) {
    return next({ name: "ValidationError", message: "Password must contain at least 3 characters" });
  }

  const passwordHash = await bcryptjs.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    passwordHash,
    name: req.body.name,
  });

  const result = await user.save();
  res.status(201).json(result);
});

module.exports = usersRouter;
