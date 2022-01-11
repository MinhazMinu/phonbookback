const { response, request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

// morgan.token("body", (req, res) => JSON.stringify(req.body));
// app.use(
//   morgan(
//     ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
//   )
// );
// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
// app.use(requestLogger);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonbook has info of ${persons.length} people <br> ${new Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((n) => n.id === id);
  person
    ? response.json(person)
    : response.status(404).json({ error: "No Data found" });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const hasData = persons.find((n) => n.id === id);

  if (hasData) {
    persons = persons.filter((n) => n.id !== id);
    response.status(204).json({ msg: "Data has been deleted" });
  } else {
    response.status(404).json({ msg: "No Data has been deleted" });
  }
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(503).json({ error: " Name or number not given" });
  } else if (persons.find((n) => n.name === request.body.name)) {
    return response
      .status(409)
      .json({ error: " Duplicate Data already existas" });
  } else {
    person = request.body;
    person.id = uuidv4();
    persons = persons.concat(person);
    return response.json(persons);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.POR || 3001;
app.listen(PORT, () => {
  console.log(`runnig PORT ${PORT}`);
});
