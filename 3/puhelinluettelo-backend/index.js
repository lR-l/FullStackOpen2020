const { response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("post-data", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
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
  })
);
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
  const response = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`;
  res.send(response);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const data = req.body;
  if (!data.name || !data.number) {
    return res.status(400).send({
      error: "Missing name or number data",
    });
  }
  if (data.name && persons.find((person) => person.name.toLowerCase() === data.name.toLowerCase())) {
    return res.status(400).send({
      error: "Person already exists in phonebook",
    });
  }
  const person = { ...data, id: Math.floor(Math.random() * (100 - 10 + 1) + 10) };
  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
