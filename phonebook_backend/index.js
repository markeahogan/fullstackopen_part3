require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //fills the body of response with a js object
const morgan = require('morgan'); //provides logging
const cors = require('cors'); //enables cross domain
const Person = require('./models/person');
const errorHandler = require('./errorHandler');

morgan.token('post', (req)=> req.method=='POST' && JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

app.post('/api/persons', (req, res, next) => {

    const person = new Person(req.body);

    person.save()
        .then((result) => {
            res.json(result.toJSON());
        })
        .catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
    const data = {
        name:req.body.name,
        number:req.body.number
    };
    const id = req.params.id;

    Person.findByIdAndUpdate(id, data, {new:true})
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON());
        })
        .catch(e => next(e));
});
    
app.get('/api/persons', (req, res) => {
        Person.find({}).then(result => {
        res.json(result.map(x => x.toJSON()));
    });
});

app.get('/api/persons/:id', (req, res, next) =>{
    Person.findById(req.params.id)
    .then(result => {
        if (result){
                res.json(result.toJSON());
            }else{
                res.status(404).end();
            }
        })
        .catch(e => next(e));
    });
    
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(r => {
            res.status(204).end();
        })
        .catch(e => next(e));
    });
    
app.get('/info', (req, res, next) => {

    Person.find({})
        .then(result =>
            {
                res.send(`
                <p>Phonebook has info for ${result.length} people</p>
                <p>${new Date()}</p>
            `)
        })
        .catch(e => next(e));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});