import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
    return (
        <div className='analytics'>
            <div className="analytics-page">
                <h1>Аналитика</h1>
                <nav>
                    <ul>
                        <li><Link to="orders">Orders</Link></li>
                        <li><Link to="clients">Clients</Link></li>
                        <li><Link to="employees">Employees</Link></li>
                        <li><Link to="programs">Programs</Link></li>
                    </ul>
                </nav>
                <div className="analytics-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
