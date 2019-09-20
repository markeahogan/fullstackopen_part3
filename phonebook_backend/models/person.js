const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log("Connecting to mongodb")

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(() => {
        console.log("Connected");
    })
    .catch((e) => {
        console.log("Connect failed", e.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;