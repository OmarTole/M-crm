import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, onCurDate, role } from '../../newFunction/newFunction';
import './EmployeeList.css';

const EmployeeList = ({ employees, setEmployees }) => {
    const [editingIndex, setEditingIndex] = useState(null); 
    const [password, setPassword] = useState(''); // Добавляем состояние для пароля
    const navigate = useNavigate();

    const removeEmployee = async (id, index) => {
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setEmployees(prev => prev.filter((_, i) => i !== index));
            setEditingIndex(null); 
        } catch (error) {
            console.error("There was an error deleting the employee!", error);
        }
    };

    const saveChanges = async (index, id) => {
        try {
            const updatedEmployee = { ...employees[index], password }; // Добавляем пароль к данным сотрудника
            await axios.put(`http://localhost:5000/api/employees/${id}`, updatedEmployee, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setEditingIndex(null);
            setPassword(''); // Очищаем поле пароля после сохранения
        } catch (error) {
            console.error("There was an error updating the employee!", error);
        }
    };

    const handleEmployeeClick = (name) => {
        navigate(`/employees/${name}`);
    };

    return (
        <div className="ul">
            <ul>
                {employees.map(({id, name, phone, birthday, city}, index) => (
                    <li key={index}>
                        {editingIndex === index ? (
                            <div className='item employeeItem'>
                                <div className='title'>
                                    <div><p>{name}</p></div>
                                    <div className='phone'><p>{phone}</p></div>
                                    <div><p>{onCurDate(birthday)}</p></div>
                                    { role() === "admin" && (<div><p>{city}</p></div>)}
                                    <div>
                                        <input 
                                            type="password" 
                                            placeholder="Новый пароль" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className='employeeItemBtn'>
                                    <button 
                                        className='delBtn' 
                                        onClick={() => removeEmployee(id, index)}>
                                            Удалить
                                    </button>
                                    <button 
                                        className='addBtn' 
                                        onClick={() => saveChanges(index, id)}>
                                            Сохранить
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className='item employeeItem'
                                onClick={() => handleEmployeeClick(name)}
                            >
                                <div className='title'>
                                    <div><p>{name}</p></div>
                                    <div><p>{onCurDate(birthday)}</p></div>
                                    <div className='phone'><p>{phone}</p></div>
                                    { role() === "admin" && (<div><p>{city}</p></div>)}
                                </div>
                                <button 
                                    className='changeBtn' 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Остановить всплытие события клика
                                        setEditingIndex(index);
                                    }}>
                                        Изменить
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
