import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CharactersList from './CharactersList/CharactersList';
import { getToken } from '../newFunction/newFunction';
import './CharactersPage.css';

const CharactersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [characters, setCharacters] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('city') || '');
    const [filteredCharacters, setFilteredCharacters] = useState([]);

    const token = getToken();
    let userRole = '';
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userRole = decodedToken.role;
    }

    const fetchCities = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/branches/cities', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCities(response.data.cities);
        } catch (error) {
            console.error("There was an error fetching the cities!", error);
        }
    }, [token]);

    const fetchCharacters = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/characters', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCharacters(response.data.characters);
            // Initialize filteredCharacters with characters and set count to 0
            setFilteredCharacters(response.data.characters.map(char => ({ ...char, count: 0 })));
        } catch (error) {
            console.error("There was an error fetching the characters!", error);
        }
    }, [token]);

    const fetchCharacterStats = useCallback(async () => {
        if (startDate && endDate) {
            try {
                const endpoint = userRole === 'admin' && selectedCity === 'Все' 
                    ? 'http://localhost:5000/api/characters/stats/admin' 
                    : 'http://localhost:5000/api/characters/stats';
                    
                const response = await axios.get(endpoint, {
                    params: {
                        searchTerm,
                        startDate,
                        endDate,
                        city: userRole === 'admin' && selectedCity === 'Все' ? '' : selectedCity // Пустое значение для всех городов
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFilteredCharacters(response.data.characters);
            } catch (error) {
                console.error("There was an error fetching the characters statistics!", error);
            }
        } else {
            // If dates are not selected, reset counts to 0
            setFilteredCharacters(characters.map(char => ({ ...char, count: 0 })));
        }
    }, [searchTerm, startDate, endDate, selectedCity, token, characters, userRole]);

    useEffect(() => {
        if (userRole === 'admin') {
            fetchCities();
        }
        fetchCharacters();
    }, [fetchCities, fetchCharacters, userRole]);

    const handleSearch = () => {
        fetchCharacterStats();
    };

    return (
        <div className='page CharactersPage'>
            <div className="type CharactersType">
                <div className='search'>
                    <input 
                        type="text" 
                        placeholder="Поиск персонажа"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='charIn'>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='dateOrders'
                    />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='dateOrders'
                    />
                    {userRole === 'admin' && (
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className='dateOrders'>
                            <option value="Все">Все города</option>
                            {cities.map((city, index) => (
                                city !== 'SomeCity' ? <option key={index} value={city}>{city}</option> : null
                            ))}
                        </select>
                    )}
                    <button onClick={handleSearch} className='addBtn'>Найти</button>
                </div>
                <div className='head headCharacters'></div>
                <CharactersList characters={filteredCharacters} />
            </div>
        </div>
    );
};

export default CharactersPage;
