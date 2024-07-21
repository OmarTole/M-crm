import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './InputList.css';

const InputList = ({ input, setEmployeeInput, employeeInput, setEmployees }) => {
    const [notif, setNotif] = useState(false);
    const [cities, setCities] = useState([]);
    const [nameError, setNameError] = useState(''); // Состояние для отслеживания ошибки имени
    const token = getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;

    const { name, phone, birthday, password } = input;

    useEffect(() => {
        if (role === 'admin') {
            fetchCities();
        } else {
            setEmployeeInput(prevState => ({
                ...prevState,
                city: localStorage.getItem('city') || ''
            }));
        }
    }, [role, setEmployeeInput]);

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

    const inputFields = [
        { name: 'Имя', type: 'text', value: name || '', placeholder: 'Введите логин', key: 'name' },
        { name: 'Телефон', type: 'number', value: phone || '', placeholder: 'Введите телефон', key: 'phone' },
        { name: 'День рождения', type: 'date', value: birthday || '', placeholder: 'Выберите дату рождения', key: 'birthday' },
        { name: 'Пароль', type: 'password', value: password || '', placeholder: 'Введите пароль', key: 'password' }
    ];

    const notification = (message) => (
        <div className='notification'>
            {message}
        </div>
    );

    const handleInputChange = async (e, key) => {
        let value = e.target.value;

        if (key === 'name') {
            // Преобразуем вводимые символы в нижний регистр и проверяем, что они являются латиницей
            value = value.toLowerCase().replace(/[^a-z]/g, '');
            setEmployeeInput({
                ...employeeInput,
                [key]: value
            });

            if (value.length === 0) {
                setNameError('');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/employees/check-name/${value}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });

                if (response.data.exists) {
                    setNameError('C таким именем уже существует. Выберите другое имя.');
                } else {
                    setNameError('');
                }
            } catch (error) {
                console.error("There was an error checking the employee name!", error);
            }
        } else {
            setEmployeeInput({
                ...employeeInput,
                [key]: value
            });
        }
    };

    const handleCityChange = (e) => {
        setEmployeeInput({
            ...employeeInput,
            city: e.target.value
        });
    };

    const addEmployee = async () => {
        const { name, phone, birthday, city, password } = employeeInput;
        if (nameError) return; // Если есть ошибка имени, отменяем добавление

        if (name.trim() !== '' && phone.trim() !== '' && birthday.trim() !== '' && city.trim() !== '' && password.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:5000/api/employees', { name, phone, birthday, city, password }, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                setEmployees(prev => [...prev, { id: response.data.id, name, phone, birthday, city }]);
                setEmployeeInput({
                    name: '',
                    phone: '',
                    birthday: '',
                    city: role === 'admin' ? '' : localStorage.getItem('city') || '',
                    password: ''
                });
                setNotif(true);
                setTimeout(() => {
                    setNotif(false);
                }, 3000);
            } catch (error) {
                console.error("There was an error adding the employee!", error);
            }
        }
    };

    return (
        <div>
            <div className='addForm'>
                {inputFields.map(({ key, type, value, placeholder }) => (
                    <input
                        key={key}
                        type={type}
                        value={value}
                        onChange={(e) => handleInputChange(e, key)}
                        placeholder={placeholder}
                    />
                ))}
                {role === 'admin' && (
                    <select value={employeeInput.city} onChange={handleCityChange}>
                        <option value="">Выберите город</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                )}
                <button className='addBtn btnAddEmployee' onClick={addEmployee} disabled={nameError}>
                    Добавить
                </button>
                {nameError && <p className="error">{nameError}</p>}
            </div>
            {notif && notification('Сотрудник добавлен')}
        </div>
    );
};

export default InputList;
