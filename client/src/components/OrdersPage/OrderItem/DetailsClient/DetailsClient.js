import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../../../newFunction/newFunction';
import './DetailsClient.css';

const DetailsClient = ({ item }) => {
    const [clientData, setClientData] = useState(null);

    const fetchClientData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/clients?phoneNumber=${item.phoneNumber}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setClientData(response.data.client);
        } catch (error) {
            console.error("There was an error fetching the client data!", error);
        }
    }, [item.phoneNumber]);

    useEffect(() => {
        fetchClientData();
    }, [fetchClientData]);

    if (!clientData) {
        return null; // Если клиент не найден, вернуть null или другое сообщение об ошибке
    }

    return (
        <div className='clientData'>
            <div>Имя клиента: {clientData.name}</div>
            <div>Телефон: {clientData.phoneNumber}</div>
            <div>День рождения: {clientData.birthday}</div>
            <div>Дети: {clientData.children}</div>
            <div>Количества заказов: {clientData.orderQuantities}</div>
            <div>Общая сумма: {clientData.orderSumm}</div>
        </div>
    );
}

export default DetailsClient;
