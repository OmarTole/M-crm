import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './RenderEvent.css';

const RenderEvent = () => {
    const [events, setEvents] = useState([]);
    const [eventInput, setEventInput] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setEvents(response.data.events);
        } catch (error) {
            console.error("There was an error fetching the events!", error);
        }
    };

    const addEvent = async () => {
        if (eventInput.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:5000/api/events', { name: eventInput }, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                setEvents([...events, { id: response.data.id, name: eventInput }]);
                setEventInput('');
            } catch (error) {
                console.error("There was an error adding the event!", error);
            }
        }
    };

    const removeEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setEvents(events.filter(event => event.id !== id));
            setEditingIndex(null);
        } catch (error) {
            console.error("There was an error deleting the event!", error);
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
    };

    const renderEventList = () => (
        <div>
            <div className='addProgramInput'>
                <input
                    type="text"
                    value={eventInput}
                    onChange={(e) => setEventInput(e.target.value)}
                />
                <button 
                    className='addBtn' 
                    onClick={addEvent}
                >Добавить</button>
            </div>
            <div className='ul'>
                <ul>
                    {events.map((item, index) => (
                        <li key={index}>
                            <div>{item.name}</div>
                            {editingIndex === index ? (
                                <div>
                                    <button 
                                        className='delBtn' 
                                        onClick={() => removeEvent(item.id)}
                                    >Удалить</button>
                                    <button 
                                        className='cancelBtn' 
                                        onClick={cancelEditing}
                                    >Отмена</button>
                                </div>
                            ) : (
                                <button 
                                    className='changeBtn' 
                                    onClick={() => startEditing(index)}
                                >Изменить</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return renderEventList();
};

export default RenderEvent;
