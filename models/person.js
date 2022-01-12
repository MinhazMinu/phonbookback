const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGODB_URI;

console.log("Database connecting to ", url);
mongoose
  .connect(url)
  .then((response) => {
    console.log("Database Connected to mongoDB");
  })
  .catch((error) => {
    console.log("Connecting error", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
