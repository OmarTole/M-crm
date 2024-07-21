import { useState, useEffect } from 'react';
import axios from 'axios';
import OrderItem from '../OrderItem/OrderItem';
import HeadOrders from '../HeadOrders/HeadOrders';
import { getToken } from '../../newFunction/newFunction';
import './AllOrders.css';

const AllOrders = ({ listUpdate, selectedCity, selectedStatus, setSelectedCity, setSelectedStatus }) => {
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [orders, setOrders] = useState([]);
    const [totalSum, setTotalSum] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [listUpdate]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error("There was an error fetching the orders!", error);
        }
    };

    const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setSelectedEndDate(event.target.value);
    };

    const handleDeleteOrder = (id) => {
        setOrders(orders.filter(order => order.id !== id));
    };

    const calculateTotals = (ordersToCalculate) => {
        const totalOrders = ordersToCalculate.length;
        const totalSum = ordersToCalculate.reduce((sum, order) => sum + (order.summ || 0), 0);

        setTotalOrders(totalOrders);
        setTotalSum(totalSum);
    };

    useEffect(() => {
        const filteredItems = orders.filter(item => {
            const orderDate = new Date(item.dateOrder);
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);

            const isWithinDateRange = (!selectedStartDate || orderDate >= startDate) && (!selectedEndDate || orderDate <= endDate);
            const isStatusMatch = !selectedStatus || item.status === selectedStatus;
            const isCityMatch = !selectedCity || item.city === selectedCity;

            return isWithinDateRange && isStatusMatch && isCityMatch;
        });

        calculateTotals(filteredItems);
    }, [selectedStartDate, selectedEndDate, selectedStatus, selectedCity, orders]);

    return (
        <div className="listAllOrders">
            <div>
                <p>Количество заказов: {totalOrders}</p>
                <p>Общая сумма: {totalSum}</p>
                <p>Выберите период заказов с 
                <input
                    className='dateOrders'
                    type="date"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                /> до 
                <input
                    className='dateOrders'
                    type="date"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                /></p>
            </div>
            <HeadOrders 
                selectedStatus={selectedStatus}
                handleStatusChange={(e) => setSelectedStatus(e.target.value)}
                selectedCity={selectedCity}
                handleCityChange={(e) => setSelectedCity(e.target.value)}
            />
            
            <div className='ul'>
                <ul>
                    {orders
                        .filter(item => {
                            const orderDate = new Date(item.dateOrder);
                            const startDate = new Date(selectedStartDate);
                            const endDate = new Date(selectedEndDate);

                            const isWithinDateRange = (!selectedStartDate || orderDate >= startDate) && (!selectedEndDate || orderDate <= endDate);
                            const isStatusMatch = !selectedStatus || item.status === selectedStatus;
                            const isCityMatch = !selectedCity || item.city === selectedCity;

                            return isWithinDateRange && isStatusMatch && isCityMatch;
                        })
                        .map(item => (
                            <OrderItem key={item.id} item={item} onDelete={handleDeleteOrder} />
                        ))}
                </ul>
            </div>
        </div>
    )
};

export default AllOrders;
