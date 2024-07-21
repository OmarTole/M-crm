import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientsStats = () => {
    const [stats, setStats] = useState({ totalClients: 0, lastMonthClients: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/analytics/clients/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(response.data);
            } catch (error) {
                console.error("There was an error fetching the client stats!", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2>Client Statistics</h2>
            <p>Total Clients: {stats.totalClients}</p>
            <p>Clients in Last Month: {stats.lastMonthClients}</p>
        </div>
    );
};

export default ClientsStats;
