import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ClientItem from './ClientItem/ClientItem';
import HeadClients from './HeadClients/HeadClients';
import { getToken, checkTokenExpiration, logout } from '../newFunction/newFunction';
import './ClientsPage.css';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [totalClients, setTotalClients] = useState(0);

    const fetchClients = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clients', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setClients(response.data.clients);
            setFilteredClients(response.data.clients);
            setTotalClients(response.data.clients.length);
        } catch (error) {
            console.error("There was an error fetching the clients!", error);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) {
            checkTokenExpiration(token, logout);
        };
        fetchClients();
    }, [fetchClients]);

    const handleDateChange = (event) => {
        const value = event.target.value;
        setSelectedDate(value);
        const filtered = clients.filter(item => item.phoneNumber.includes(value));
        setFilteredClients(filtered);
        setTotalClients(filtered.length);
    };

    const updateClient = async (updatedClient) => {
        try {
            await axios.put(`http://localhost:5000/api/clients/${updatedClient.id}`, updatedClient, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            fetchClients();
        } catch (error) {
            console.error("There was an error updating the client!", error);
        }
    };

    const onClientList = () => {
        const clientsToDisplay = selectedDate ? filteredClients : clients;
        if (!clientsToDisplay || !Array.isArray(clientsToDisplay)) {
            return null;
        }

        const sortedClients = [...clientsToDisplay].sort((a, b) => b.orderSumm - a.orderSumm);

        const items = sortedClients.map(item => (
            <ClientItem key={item.id} item={item} onUpdateClient={updateClient} />
        ));

        return <div className="ul"><ul>{items}</ul></div>;
    };

    return (
        <div className='page clientsPage'>
            <div className="type clientsType">
                <div className="search">
                    <input 
                        type="text" 
                        placeholder="Введите номер клиента"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>
                <p>Количество клиентов: {totalClients}</p>
                <HeadClients />
                {onClientList()}
            </div>
        </div>
    );
};

export default ClientsPage;
