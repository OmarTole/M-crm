import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersStats.css';

const OrdersStats = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        newOrders: 0,
        totalRevenue: 0,
        newRevenue: 0,
        avgCheck: 0,
        newSales: 0,
        repeatSales: 0,
        topClients: [],
        topServices: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const ordersResponse = await axios.get('http://localhost:5000/api/analytics/orders/stats');
                const clientsResponse = await axios.get('http://localhost:5000/api/analytics/clients/stats/extended');
                const servicesResponse = await axios.get('http://localhost:5000/api/analytics/services/stats');

                setStats({
                    ...ordersResponse.data,
                    ...clientsResponse.data,
                    ...servicesResponse.data,
                });
            } catch (error) {
                console.error("There was an error fetching the stats!", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="orders-stats">
            <h2>Order Statistics</h2>
            <div className="stat">
                <h3>Заказы</h3>
                <p>{stats.totalOrders}</p>
            </div>
            <div className="stat">
                <h3>Новые заказы</h3>
                <p>{stats.newOrders}</p>
            </div>
            <div className="stat">
                <h3>Общая касса</h3>
                <p>{stats.totalRevenue}</p>
            </div>
            <div className="stat">
                <h3>Новая касса</h3>
                <p>{stats.newRevenue}</p>
            </div>
            <div className="stat">
                <h3>Средний чек</h3>
                <p>{stats.avgCheck}</p>
            </div>
            <h2>Client Statistics</h2>
            <div className="stat">
                <h3>Новые продажи</h3>
                <p>{stats.newSales}</p>
            </div>
            <div className="stat">
                <h3>Повторные продажи</h3>
                <p>{stats.repeatSales}</p>
            </div>
            <div className="stat">
                <h3>Топ 3 клиента</h3>
                <ul>
                    {stats.topClients.map((client, index) => (
                        <li key={index}>{client.nameClient} - {client.ordersCount} заказов</li>
                    ))}
                </ul>
            </div>
            <h2>Services Statistics</h2>
            <div className="stat">
                <h3>Топ-услуги и количество</h3>
                <ul>
                    {stats.topServices.map((service, index) => (
                        <li key={index}>{service.program} - {service.programCount} заказов</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrdersStats;
