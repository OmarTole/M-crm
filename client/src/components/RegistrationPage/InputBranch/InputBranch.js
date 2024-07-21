import React from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './InputBranch.css';

const InputBranch = ({ 
    setBranches, 
    branchInput, 
    setBranchInput, 
    editMode, 
    handleUpdateBranch, 
    handleCancelEdit 
}) => {

    const { directorName, city, password, contact } = branchInput;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBranchInput({
            ...branchInput,
            [name]: value
        });
    };

    const handleDirectorNameChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/[^a-zA-Z]/g, '').toLowerCase();
        setBranchInput({
            ...branchInput,
            directorName: filteredValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            handleUpdateBranch();
        } else {
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/branches',
                    branchInput,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setBranches(prev => [...prev, { ...branchInput, id: response.data.id }]);
                setBranchInput({
                    directorName: '',
                    contact: '',
                    city: '',
                    password: ''
                });
            } catch (error) {
                console.error("Ошибка при добавлении филиала:", error);
            }
        }
    };

    const inputFields = [
        { placeholder: "Имя директора", name: "directorName", type: "text", value: directorName, onChange: handleDirectorNameChange },
        { placeholder: "Контакты", name: "contact", type: "text", value: contact, onChange: handleChange },
        { placeholder: "Город", name: "city", type: "text", value: city, onChange: handleChange },
        { placeholder: "Пароль", name: "password", type: "text", value: password, onChange: handleChange }
    ];

    return (
        <form className="addForm" onSubmit={handleSubmit}>
            {inputFields.map(({ placeholder, name, type, value, onChange }) => (
                <input 
                    key={name}
                    type={type} 
                    name={name} 
                    placeholder={placeholder}
                    value={value} 
                    onChange={onChange} 
                />
            ))}
            <button 
                className='addBtn' 
                type="submit">
                    {editMode ? 'Обновить филиал' : 'Добавить филиал'}
            </button>
            {editMode && 
                <button 
                    className='cancelBtn' 
                    type="button" 
                    onClick={handleCancelEdit}>
                        Отмена
                </button>
            }
        </form>
    );
}

export default InputBranch;
