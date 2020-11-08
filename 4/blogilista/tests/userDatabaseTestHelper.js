const User = require("../models/user");

const initialUsers = [
  {
    _id: "5a422aa71b54a676234d17f8",
    username: "admin",
    passwordHash: "¤fgfh¤%#%141252¤#@£$€£$$€##¤24",
    name: "Admin",
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    username: "root",
    passwordHash: "glfKJKFG#!964lfdgoiWQ502",
    name: "Root",
  },
  {
    _id: "5a422b891b54a676234d17fa",
    username: "superdash",
    passwordHash: "klkgd09kj234#!90474{€#",
    name: "Sun Lightning",
  },
];

const getUsersInDatabase = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const getNonExsistingId = async () => {
  const user = new User({ username: "id", passwordHash: "##########", name: "id" });
  await user.save();
  await user.remove();
  return user._id.toString();
};

module.exports = {
  initialUsers,
  getUsersInDatabase,
  getNonExsistingId,
};
