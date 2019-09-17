import React from 'react';

const Persons = ({persons, remove}) => {
    return persons.map(x =>
        <p key={x.id}>
            {x.name} {x.number} <button onClick={()=>remove(x.id)}>Delete</button>
        </p>
    );
}

export default Persons;