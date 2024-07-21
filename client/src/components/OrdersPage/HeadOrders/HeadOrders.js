import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { role, getToken } from '../../newFunction/newFunction';
import './HeadOrders.css';

const HeadOrders = ({ selectedStatus, handleStatusChange, selectedCity, handleCityChange }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/branches/cities', {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                setCities(response.data.cities);
            } catch (error) {
                console.error("There was an error fetching the cities!", error);
            }
        };

        if (role() === 'admin') {
            fetchCities();
        }
    }, []);

    return (
        <div className='headOrders'>
            <div className='headOrdersList'>
                <p>#заказа</p>
                <p>Имя</p>
                <p className='date'>Дата</p>
                <p>Время</p>
                {role() === 'admin' && (
                    <div className='filter'>
                        <select value={selectedCity} onChange={handleCityChange}>
                            <option className='option' value="">Все города</option>
                            {cities.map((city, index) => (
                                city !== 'SomeCity' ? <option key={index} value={city}>{city}</option> : null
                            ))}
                        </select>
                    </div>
                )}
                <div className='filter'>
                    <select value={selectedStatus} onChange={handleStatusChange}>
                        <option className='option' value="">Статус</option>
                        <option className='option' value="в ожидании">В ожидании</option>
                        <option className='option' value="назначен">Назначен</option>
                        <option className='option' value="завершен">Завершен</option>
                        <option className='option' value="отменен">Отменен</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default HeadOrders;
