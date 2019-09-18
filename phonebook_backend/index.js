const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //fills the body of response with a js object
const morgan = require('morgan'); //provides logging
const cors = require('cors'); //enables cross domain
const Person = require('./models/person');

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

morgan.token('post', (req)=> req.method=='POST' && JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

app.post('/api/persons', (req, res) => {
    const personData = req.body;

    let error = '';
    if (!personData.name){
        error = 'name missing';
    }else if(!personData.number){
        error = 'number missing';
    }else if (persons.find(x=>x.name==personData.name)){
        error = 'person already exists';
    }

    if (error){
        res.status(400).json({error});
        return;
    }

    const person = new Person(personData);
    person.save().then((result) => {
        res.json(result);
    });
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/api/persons/:id', (req, res) =>{
    Person.findById(req.params.id)
        .then(result => {
            if (result){
                res.json(result);
            }else{
                res.status(404).end();
            }
        })
        .catch(e => {
            res.status(400).end();
        });
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id);
    const id = Number(req.params.id);
    persons = persons.filter(x => x.id != id);
    res.status(204).end();
});

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});