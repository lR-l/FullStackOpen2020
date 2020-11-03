require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("post-data", (req) => JSON.stringify(req.body));
const morganCustom = morgan((tokens, req, res) => {
  if (tokens.method(req, res) === "POST") {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["post-data"](req, res),
    ].join(" ");
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (err, req, res, nxt) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "Incorrect id format" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }
  if (err.name === "PersonNotFound") {
    return res.status(404).send({ error: "Person not found, please reload site" });
  }

  nxt(err);
};

app.use(express.static("build"));
app.use(express.json());
app.use(morganCustom);
app.use(cors());

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const response = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`;
      res.send(response);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.send(person);
      } else {
        next({ name: "PersonNotFound", message: "Missing person data" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const data = req.body;

  const person = new Person({
    name: data.name,
    number: data.number,
  });

  person
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const data = req.body;
  if (
    data.name === "" ||
    data.number === "" ||
    !data.number.replace(/-/g, "").match(/^\d+$/) ||
    data.number.indexOf("-") === 0 ||
    data.number.indexOf("-") === data.number.length - 1
  ) {
    return next({ name: "DataError", message: "Missing data or data has invalid format" });
  }

  Person.findByIdAndUpdate(req.params.id, { number: data.number }, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        next({ name: "PersonNotFound", message: "Missing person data" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        res.status(204).end();
      } else {
        next({ name: "PersonNotFound", message: "Missing person data" });
      }
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
