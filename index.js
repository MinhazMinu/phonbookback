const { response, request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
require("dotenv").config();
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const Note = require("./models/person");
const res = require("express/lib/response");
const Person = require("./models/person");

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
app.use(express.static("build"));
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

// let persons = [
//   {
//     id: 1,
//     name: "Arto ssHellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramove",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `Phonbook has info of ${persons.length} people <br> ${new Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      response.status(404).json({ error: "No Data found" });
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).json({ msg: "Data has been deleted" });
    })
    .catch((error) => {
      response.json({ msg: error.message });
    });
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(503).json({ error: " Name or number not given" });
  } else if (Person.find({ name: request.body.name })) {
    response.json({ msg: "duplicate data" });
  } else {
    const person = new Person({
      name: request.body.name,
      number: request.body.number,
    });

    person.save().then((savePerson) => {
      response.json(savePerson);
    });
  }
});

// app.post("/api/persons", (request, response) => {
//   if (!request.body.name || !request.body.number) {
//     return response.status(503).json({ error: " Name or number not given" });
//   } else if (persons.find((n) => n.name === request.body.name)) {
//     return response
//       .status(409)
//       .json({ error: " Duplicate Data already existas" });
//   } else {
//     person = request.body;
//     person.id = uuidv4();
//     persons = persons.concat(person);
//     return response.json(persons);
//   }
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`runnig PORT ${PORT}`);
});
