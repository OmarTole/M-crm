import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgramsStats = () => {
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/analytics/programs/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPrograms(response.data.programs || []); // добавлено || []
            } catch (error) {
                console.error("There was an error fetching the program stats!", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2>Program Statistics</h2>
            <ul>
                {programs.length > 0 ? (
                    programs.map(program => (
                        <li key={program.name}>
                            {program.name}: {program.orderCount} orders, ${program.totalRevenue} revenue
                        </li>
                    ))
                ) : (
                    <li>No programs available</li>
                )}
            </ul>
        </div>
    );
};

export default ProgramsStats;
