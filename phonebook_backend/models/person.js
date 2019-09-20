const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log("Connecting to mongodb")

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false  })
    .then(() => {
        console.log("Connected");
    })
    .catch((e) => {
        console.log("Connect failed", e.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters.'],
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
});
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  })

const Person = mongoose.model('Person', personSchema);

module.exports = Person;