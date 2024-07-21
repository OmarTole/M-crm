import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './ProgramsField.css';

const ProgramsField = ({ characters, onAddCharacter, onRemoveCharacter, error }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchOptions = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/characters', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setOptions(response.data.characters);
        } catch (error) {
            console.error("There was an error fetching the characters!", error);
        }
    }, []);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredOptions(
                options.filter(option =>
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredOptions([]);
        }
    }, [searchTerm, options]);

    const handleAdd = (character) => {
        onAddCharacter(character);
        setSearchTerm('');
    };

    return (
        <div className="programsField">
            <label htmlFor="characters"><p>Персонажи</p></label>
            <input
                type="text"
                id="characters"
                name="characters"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={error ? "error" : ""}
            />
            {/* <button onClick={() => handleAdd({ id: Date.now(), name: searchTerm })}>+</button> */}
            {error && <span className="error">{error}</span>}
            {searchTerm && (
                <ul className="characters-dropdown">
                    {filteredOptions.map((option) => (
                        <li key={option.id} onClick={() => handleAdd(option)}>
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
            <div className="selected-characters">
                {characters.map((character, index) => (
                    <div key={index} className="character-item">
                        {character.name}
                        <button onClick={() => onRemoveCharacter(index)}>x</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgramsField;
