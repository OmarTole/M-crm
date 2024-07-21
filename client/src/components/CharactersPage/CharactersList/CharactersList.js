import React from 'react';
import './CharactersList.css';

const CharactersList = ({ characters }) => {
    if (!characters.length) {
        return <p>Нет данных для отображения.</p>;
    }

    const sortedCharacters = [...characters].sort((a, b) => b.count - a.count);

    return (
        <div className='charactersList'>
            <ul>
                {sortedCharacters.map((character, index) => (
                    <li key={index} className='item'>
                        <div className='title'>
                            <span>{character.name}</span>
                            <span>{character.count}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharactersList;
