import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken, role } from '../../../newFunction/newFunction';
import './DetailsCharacter.css';

const DetailsCharacter = ({ item, onUpdate, handleDeleteOrder, onClose, onStatusUpdate, }) => {
    const [showSelect, setShowSelect] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignedCharacters, setAssignedCharacters] = useState([]);

    const fetchEmployees = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setEmployees(response.data.employees);
        } catch (error) {
            console.error("There was an error fetching the employees!", error);
        }
    }, []);

    const fetchAssignedCharacters = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${item.id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const orderData = response.data;
            const characters = typeof orderData.characters === 'string' ? JSON.parse(orderData.characters) : orderData.characters;
            setAssignedCharacters(Array.isArray(characters) ? characters : []);
        } catch (error) {
            console.error("There was an error fetching the assigned characters!", error);
        }
    }, [item.id]);

    useEffect(() => {
        fetchEmployees();
        fetchAssignedCharacters();
    }, [fetchEmployees, fetchAssignedCharacters]);

    const handleAssignClick = () => {
        setShowSelect(true);
    };

    const handleEmployeeChange = (charIndex, event) => {
        const updatedEmployees = [...selectedEmployees];
        updatedEmployees[charIndex] = event.target.value;
        setSelectedEmployees(updatedEmployees);
    };

    const handleSaveClick = async () => {
        try {
            const updatedCharacters = assignedCharacters.map((character, index) => ({
                ...character,
                employee: selectedEmployees[index] || character.employee || ''
            }));

            const updatedItem = { ...item, characters: JSON.stringify(updatedCharacters), status: 'назначен' };

            console.log('Sending updated item:', updatedItem); // Логирование данных перед отправкой

            await axios.put(`http://localhost:5000/api/orders/${item.id}`, updatedItem, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
            });

            setShowSelect(false);
            setAssignedCharacters(updatedCharacters);
            setSelectedEmployees([]);

            if (onUpdate) {
                onUpdate(updatedItem);
            }

            if (onStatusUpdate) {
                onStatusUpdate('назначен');
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("There was an error saving the character assignment!", error);
            console.error("Error details:", error.response); // Логирование ответа ошибки
        }
    };

    const handleCompleteClick = async () => {
        try {
            const updatedItem = { ...item, status: 'завершен' };

            await axios.put(`http://localhost:5000/api/orders/${item.id}/complete`, updatedItem, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
            });

            if (onUpdate) {
                onUpdate(updatedItem);
            }

            if (onStatusUpdate) {
                onStatusUpdate('завершен');
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("There was an error completing the order!", error);
            console.error("Error details:", error.response); // Логирование ответа ошибки
        }
    };

    if (!assignedCharacters.length) {
        return <div>No character data available for this order.</div>;
    }

    return (
        <div className='detailsCharacter'>
            <div className='nameProgram'>
                <div className='characterList'>
                    <div className='orderCharacter'>
                        <p>Персонажи</p>
                        <ul>
                            {assignedCharacters.map((character, charIndex) => (
                                <li key={charIndex} value={character.name}>
                                    {character.name}
                                    : {character.employee || "Не назначен"}
                                    {showSelect && (
                                        <>
                                            <select
                                                name={`employee-${charIndex}`}
                                                id={`employee-${charIndex}`}
                                                onChange={(e) => handleEmployeeChange(charIndex, e)}
                                                value={selectedEmployees[charIndex] || ''}
                                                className='select-border'
                                            >
                                                <option value="">Выберите сотрудника</option>
                                                {employees.map((employee, empIndex) => (
                                                    <option key={empIndex} value={employee.name}>{employee.name}</option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    {(role() === 'admin' || role() === 'director') && (
                        <button className='addBtn add' onClick={showSelect ? handleSaveClick : handleAssignClick}>
                            {showSelect ? "Сохранить" : "Назначить"}
                        </button>
                    )}
                    {role() === 'animator' && (
                        <button className='addBtn' onClick={handleCompleteClick}>Завершить</button>
                    )}
                    {role() === 'admin' && (
                        <button className='delBtn' onClick={handleDeleteOrder}>Удалить</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsCharacter;
