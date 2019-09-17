const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

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

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

app.post('/api/persons', (req, res) => {
    const person = req.body;

    let error = '';
    if (!person.name){
        error = 'name missing';
    }else if(!person.number){
        error = 'number missing';
    }else if (persons.find(x=>x.name==person.name)){
        error = 'person already exists';
    }

    if (error){
        res.status(400).json({error});
        return;
    }

    person.id = Math.floor(Math.random()*1000);
    persons = persons.concat(person);
    res.json(person);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) =>{
    const person = persons.find(x => x.id == req.params.id);
    if (person){
        res.json(person);
    }else{
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
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