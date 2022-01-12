const mongoose = require("mongoose");

const argvLength = process.argv.length;
if (argvLength < 3) {
  console.log(`Please enter you password`);
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://m:${password}@cluster0.37ztz.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);
if (argvLength == 3) {
  Phonebook.find({}).then((result) => {
    console.log(`PhoneBook:`);
    result.forEach((element) => {
      console.log(`${element.name}  ${element.number}`);
      mongoose.connection.close();
    });
  });
} else if (argvLength > 3 && argvLength < 6) {
  const name = process.argv[3];
  const number = process.argv[4];

  const phonebook = new Phonebook({
    name: name,
    number: number,
  });

  phonebook.save().then((result) => {
    console.log("data is saved");
    mongoose.connection.close();
  });
} else {
  console.log(`Please enter you name and password only to add`);
  process.exit(1);
}
