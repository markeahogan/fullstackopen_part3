import React from 'react';

const PersonForm = ({name, number, setName, setNumber, onSubmit}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>name: <input value={name} onChange={(e) => setName(e.target.value)}/></div>
            <div>number: <input value={number} onChange={(e) => setNumber(e.target.value)}/></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

export default PersonForm;