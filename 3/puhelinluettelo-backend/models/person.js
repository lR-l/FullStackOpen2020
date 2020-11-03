const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (value) => {
        return !(!value.replace(/-/g, "").match(/^\d+$/) || value.indexOf("-") === 0 || value.indexOf("-") === value.length - 1);
      },
      message: (props) => `${props} is not valid phonenumber`,
    },
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
