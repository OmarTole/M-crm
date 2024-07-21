import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../Modal/Modal';
import { getToken } from '../../newFunction/newFunction';
import './AnimatorsModal.css';

const AnimatorsModal = ({ employee, onClose, onEmployeeUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState({
        userName: employee.userName || '',
        birthday: employee.birthday || '',
        phone: employee.phone || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee({
            ...editedEmployee,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/api/employees/${employee.id}`, editedEmployee, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            onEmployeeUpdate({
                ...employee,
                ...editedEmployee
            });
            setIsEditing(false);
        } catch (error) {
            console.error("There was an error updating the employee!", error);
        }
    };

    return (
        <Modal isVisible={!!employee} onClose={onClose}>
            <div className="">
                <h2>Данные сотрудника</h2>
                {isEditing ? (
                    <>
                        <p>
                            <strong>Имя:</strong>
                            <input
                                type="text"
                                name="userName"
                                value={editedEmployee.userName}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Дата рождения:</strong>
                            <input
                                type="date"
                                name="birthday"
                                value={editedEmployee.birthday}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Телефон:</strong>
                            <input
                                type="text"
                                name="phone"
                                value={editedEmployee.phone}
                                onChange={handleInputChange}
                            />
                        </p>
                        <button className='addBtn' onClick={handleSaveChanges}>Сохранить</button>
                        <button className='cancelBtn' onClick={() => setIsEditing(false)}>Отмена</button>
                    </>
                ) : (
                    <>
                        <p><strong>Имя:</strong> {employee.userName}</p>
                        <p><strong>Логин:</strong> {employee.name}</p>
                        <p><strong>Телефон:</strong> {employee.phone}</p>
                        <p><strong>Дата рождения:</strong> {employee.birthday}</p>
                        <p><strong>Город:</strong> {employee.city}</p>
                        <button className='changeBtn' onClick={() => setIsEditing(true)}>Изменить</button>
                        {/* <button className='cancelBtn' onClick={onClose}>Закрыть</button> */}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default AnimatorsModal;
