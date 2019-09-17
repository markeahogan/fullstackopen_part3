import React, { useState, useEffect } from 'react';
import personService from './services/personService';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [ persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ notification, setNotification ] = useState({message:'', style:'success'});

  useEffect(() => {
    personService.getAll()
      .then(persons => setPersons(persons))
  }, [])

  const onSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name:newName,
      number:newNumber
    };

    addOrUpdate(newPerson);
    
    setNewName('');
    setNewNumber('');
  }

  const addOrUpdate = (newPerson) => {
    const personExistsAlready = persons.find(x => x.name === newPerson.name);

    if (!personExistsAlready){
      personService.add(newPerson)
        .then(x => {
          setPersons(persons.concat(x))
          notifySuccess(`Added ${newPerson.name}`);
        });
    }else{
      personService.update(personExistsAlready.id, newPerson)
        .then(person => {
          setPersons(persons.map(x => x.id === person.id ? person : x))
          notifySuccess(`Updated ${newPerson.name}`);
        });
    }
  }
  
  const remove = (id) => {
    const person = persons.find(x=>x.id===id);
    if (window.confirm(`Do you want to delete ${person.name}`) === false) return;
    
    personService.remove(id)
    .then(() => {
      setPersons(persons.filter(x => x.id !== id));
      notifySuccess(`Deleted ${person.name}`);
    })
    .catch(() => {
      notifyError(`Information of ${person.name} has already been removed from server`);
    });
  }

  const filterPersons = () => {
    if (filter === '') return persons;    
    return persons.filter(x => x.name.toLowerCase().includes(filter.toLowerCase()));
  }

  const notifySuccess = (message) => notify(message, 'success');

  const notifyError = (message) => notify(message, 'error');

  const notify = (message, style) => {    
    setNotification({message, style});
    setTimeout(() => setNotification({message:'', style:'success'}), 2000);
  }

  return (
    <div>
      <h2>Phonebook</h2>      
      <Notification message={notification.message} style={notification.style}/>
      <Filter text={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>Add new</h2>   
      <PersonForm name={newName} number={newNumber}
        setName={setNewName} setNumber={setNewNumber}
        onSubmit={onSubmit} />
      <h2>Numbers</h2>
      <Persons persons={filterPersons()} remove={remove} />
    </div>
  )
}

export default App