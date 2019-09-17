const mongoose = require('mongoose');

if ( process.argv.length<3 ) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0-s2ye6.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

const addPerson = (name, number) => {   
    
    const person = new Person({name, number});

    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
};

const listPersons = () => {

    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`));        
        mongoose.connection.close();
    });
};

if (process.argv.length >= 5){
    addPerson(process.argv[3], process.argv[4]);
}else{
    listPersons();
}