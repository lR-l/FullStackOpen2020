const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
});

commentSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  },
});

commentSchema.plugin(validator);

module.exports = mongoose.model("Comment", commentSchema);
