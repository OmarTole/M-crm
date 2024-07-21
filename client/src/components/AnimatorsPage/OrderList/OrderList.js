import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken, onCurDate } from '../../newFunction/newFunction';
import Modal from '../../Modal/Modal';
import DetailsOrder from '../../OrdersPage/OrderItem/DetailsOrder/DetailsOrder';
import DetailsCharacter from '../../OrdersPage/OrderItem/DetailsCharacter/DetailsCharacter';
import './OrderList.css';

const OrderList = ({ isMyOrders, employeeName, setOrders, selectedDate, orderNumber, city }) => {
    const [employeeOrders, setEmployeeOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchEmployeeOrders = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/by/dateCity', {
                params: {
                    date: selectedDate || new Date().toISOString().split('T')[0], // текущая дата, если дата не указана
                    city: city
                },
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            let orders = response.data.orders;

            if (isMyOrders) {
                orders = orders.filter(order => {
                    const characters = JSON.parse(order.characters || '[]');
                    return characters.some(character => character.employee === employeeName);
                });
            }

            if (orderNumber) {
                orders = orders.filter(order => order.id.toString().includes(orderNumber));
            }

            setEmployeeOrders(orders);
            setOrders(orders.length);
        } catch (error) {
            console.error("Произошла ошибка при получении заказов сотрудника!", error);
        }
    }, [employeeName, selectedDate, orderNumber, city, isMyOrders, setOrders]);

    useEffect(() => {
        fetchEmployeeOrders();
    }, [fetchEmployeeOrders]);

    const toggleDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div>
            {employeeOrders.length > 0 ? (
                <ul className="employeeOrders">
                    {employeeOrders.map((order) => (
                        <li key={order.id} className="order-item" onClick={() => toggleDetails(order)}>
                            <div className='orderData'>
                                <div># {order.id}</div>
                                <div>{order.nameClient}</div>
                                <div>{order.nameEvent}</div>
                                <div>{onCurDate(order.dateOrder)}</div>
                                <div>{order.timeOrder}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет назначенных заказов для этого сотрудника.</p>
            )}
            {selectedOrder && (
                <Modal isVisible={!!selectedOrder} onClose={closeModal}>
                    <DetailsOrder item={selectedOrder} />
                    <DetailsCharacter 
                        item={selectedOrder} 
                        onUpdate={(updatedItem) => console.log(updatedItem)} 
                        handleDeleteOrder={() => {} /* Add logic to delete order if needed */}
                        onClose={closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default OrderList;
