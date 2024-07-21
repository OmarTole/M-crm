import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

import { getToken, checkTokenExpiration, logout, role } from '../newFunction/newFunction';
import OrderList from './OrderList/OrderList';
import HeadOrder from './HeadOrder/HeadOrder';
import AnimatorsModal from './AnimatorsModal/AnimatorsModal';

import './AnimatorsPage.css';

const AnimatorsPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ordersCount, setOrdersCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [isMyOrders, setIsMyOrders] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            checkTokenExpiration(token, logout);
        }
        const fetchEmployeeDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/name/${name}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                setEmployee(response.data.employee);
                setLoading(false);
            } catch (error) {
                console.error("Произошла ошибка при получении данных сотрудника!", error);
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [name]);

    if (loading) {
        return <div>Загрузка данных сотрудника...</div>;
    }

    if (!employee) {
        return <div>Сотрудник не найден.</div>;
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEmployeeUpdate = (updatedEmployee) => {
        setEmployee(updatedEmployee);
        closeModal();
    };

    return (
        <div className="page EmployeeDetailPage">
            <div className="type">
                {(role() === "admin" || role() === "director") && (
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                )}
                <div className="search">
                    <input 
                        type="text" 
                        value={orderNumber} 
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder='Введите номер заказа'
                    />
                </div>
                <h2 onClick={openModal}>Заказы: {name}</h2>
                <p>Кол-во заказов: {ordersCount}</p>
                <label>
                    Мои заказы
                    <input 
                        type="checkbox" 
                        checked={isMyOrders} 
                        onChange={() => setIsMyOrders(!isMyOrders)}
                    />
                </label>
                <div className="filter-period">
                    <label>
                        Дата-
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </label>
                </div>
                
                <HeadOrder />
                <OrderList 
                    isMyOrders={isMyOrders}
                    employeeName={employee.name} 
                    setOrders={setOrdersCount}
                    selectedDate={selectedDate}
                    orderNumber={orderNumber}
                    city={employee.city}
                />
                {isModalOpen && (
                    <AnimatorsModal
                        employee={employee}
                        onClose={closeModal}
                        onEmployeeUpdate={handleEmployeeUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default AnimatorsPage;
