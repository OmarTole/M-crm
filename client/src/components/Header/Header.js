import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const city = localStorage.getItem('city');
    const [menuOpen, setMenuOpen] = useState(false);
    let role = '';

    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        role = decodedToken.role;
    }

    const listLink = [
        { name: 'Заказы', to: '/orders', roles: ['admin', 'director'] },
        { name: 'Клиенты', to: '/clients', roles: ['admin', 'director']  },
        { name: 'Услуги', to: '/programs', roles: ['admin'] },
        { name: 'Аниматоры', to: '/employees', roles: ['admin', 'director'] },
        { name: 'Персонажи', to: '/characters', roles: ['admin', 'director'] },
        { name: 'Регистрация', to: '/registration', roles: ['admin'] },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('city');
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const content = listLink
        .filter(link => !link.roles || link.roles.includes(role))
        .map((link, index) => (
            <li key={index}>
                <Link 
                    to={link.to}
                    className={location.pathname === link.to ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                >
                    {link.name}
                </Link>
            </li>
        ));

    return (
        <div className="header">
            <h1>Holiday.co {city}</h1>
            <span className="menu-toggle" onClick={toggleMenu}>
                &#9776;
            </span>
            <ul className={menuOpen ? 'open' : ''}>
                {content}
                <button onClick={handleLogout} className="logout-button">Выйти</button>
            </ul>
        </div>
    );
};

export default Header;
