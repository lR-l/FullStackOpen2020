const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Missing password parameter");
  process.exit(1);
}

const pass = process.argv[2];
const url = `mongodb+srv://C01-Adm:${pass}@r-tech-c01.5c8t7.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((results) => {
    console.log("phonebook:");
    results.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  if (name === "" || number === "" || !number.replace(/-/g, "").match(/^\d+$/) || number.indexOf("-") === 0 || number.indexOf("-") === number.length - 1) {
    console.log("Check data");
    mongoose.connection.close();
    return;
  }

  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPerson.save().then((result) => {
    console.log(`added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid format,use "node mongo.js <password> <name> <number>"');
  mongoose.connection.close();
}
