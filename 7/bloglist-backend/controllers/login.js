const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  if (!req.body.user || !req.body.pwd) {
    return next({ name: "ValidationError", message: "Username and password is required" });
  }
  const user = await User.findOne({ username: req.body.user });
  const checkPwd = user === null ? false : await bcryptjs.compare(req.body.pwd, user.passwordHash);
  if (!user || !checkPwd) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const userDataToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userDataToken, process.env.TOKEN_SECRET);

  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
