import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './RenderCharacters.css';

const RenderCharacters = () => {
    const [characters, setCharacters] = useState([]);
    const [characterInput, setCharacterInput] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/characters', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCharacters(response.data.characters);
        } catch (error) {
            console.error("There was an error fetching the characters!", error);
        }
    };

    const addCharacter = async () => {
        if (characterInput.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:5000/api/characters', { name: characterInput }, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                setCharacters([...characters, { id: response.data.id, name: characterInput }]);
                setCharacterInput('');
            } catch (error) {
                console.error("There was an error adding the character!", error);
            }
        }
    };

    const removeCharacter = async (charIndex, charId) => {
        try {
            await axios.delete(`http://localhost:5000/api/characters/${charId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const updatedCharacters = [...characters];
            updatedCharacters.splice(charIndex, 1);
            setCharacters(updatedCharacters);
        } catch (error) {
            console.error("There was an error deleting the character!", error);
        }
    };

    const editCharacter = (index) => {
        setEditingIndex(index);
    };

    const saveChanges = async (charIndex, charId) => {
        const updatedCharacter = characters[charIndex];

        try {
            await axios.put(`http://localhost:5000/api/characters/${charId}`, { name: updatedCharacter.name }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setEditingIndex(null);
        } catch (error) {
            console.error("There was an error updating the character!", error);
        }
    };

    return (
        <div>
            <div className='addProgramInput'>
                <input
                    type="text"
                    value={characterInput}
                    onChange={(e) => setCharacterInput(e.target.value)}
                />
                <button className='addBtn' onClick={addCharacter}>Добавить</button>
            </div>
            <div className='ul'>
                <ul>
                    {characters.map((item, index) => (
                        <li key={index} className='characterList'>
                            <div className='characterName'>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => {
                                            const updatedCharacters = [...characters];
                                            updatedCharacters[index].name = e.target.value;
                                            setCharacters(updatedCharacters);
                                        }}
                                    />
                                ) : (
                                    item.name
                                )}
                                {editingIndex !== index && (
                                    <button className='changeBtn' onClick={() => editCharacter(index)}>Изменить</button>
                                )}
                            </div>
                            {editingIndex === index && (
                                <div className='characterActions'>
                                    <button 
                                        className='saveBtn' 
                                        onClick={() => saveChanges(index, item.id)}>
                                        Сохранить
                                    </button>
                                    <button 
                                        className='delBtn' 
                                        onClick={() => removeCharacter(index, item.id)}>
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RenderCharacters;
