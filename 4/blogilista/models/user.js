const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
    delete retObj.passwordHash;
  },
});

userSchema.plugin(validator);

module.exports = mongoose.model("User", userSchema);
