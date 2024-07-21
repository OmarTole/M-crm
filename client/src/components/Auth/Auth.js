import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
    const [directorName, setDirectorName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { directorName, password });
            const { token, city } = response.data;
            console.log("Полученный город:", city);

            localStorage.setItem('token', token);
            localStorage.setItem('city', city);

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userRole = decodedToken.role;
            const userName = decodedToken.name;

            if (userRole === 'animator') {
                navigate(`/employees/${userName}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            console.error("Ошибка аутентификации:", error);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="directorName"
                        value={directorName}
                        placeholder='Имя пользователя'
                        onChange={(e) => setDirectorName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder='Пароль'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Auth;
