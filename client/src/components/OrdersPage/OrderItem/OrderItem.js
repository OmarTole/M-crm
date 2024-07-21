import React, { useState } from 'react';
import axios from 'axios';
import DetailsOrder from './DetailsOrder/DetailsOrder';
import DetailsCharacter from './DetailsCharacter/DetailsCharacter';
import Modal from '../../Modal/Modal';
import { getToken, onCurDate, role } from '../../newFunction/newFunction';
import './OrderItem.css';

const OrderItem = ({ item, onDelete }) => {
    const { 
        id, 
        timeOrder, 
        nameClient, 
        dateOrder, 
        city,
        status: initialStatus 
    } = item;

    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    const handleStatusChange = async (e) => {
        setSelectedStatus(e.target.value);
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const updatedOrder = {
                ...item,
                status: e.target.value,
                characters: response.data.characters // сохраняем текущих сотрудников
            };

            await axios.put(`http://localhost:5000/api/orders/${id}`, updatedOrder, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
        } catch (error) {
            console.error("There was an error updating the order status!", error);
        }
    };

    const handleDeleteOrder = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            onDelete(id);
        } catch (error) {
            console.error("There was an error deleting the order!", error);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        setSelectedStatus(newStatus);
    };

    return (
        <li className="order-item">
            <div className='orderData' onClick={toggleDetails}>
                <div><p>#{id}</p></div>
                <div><p>{nameClient}</p></div>
                <div className='date'><p>{onCurDate(dateOrder)}</p></div>
                <div><p>{timeOrder}</p></div>
                {role() === 'admin' && <div><p>{city}</p></div>}
                <div className='status'>
                    <select 
                        value={selectedStatus} 
                        onChange={handleStatusChange} 
                        onClick={e => e.stopPropagation()}
                        className={
                            selectedStatus === "в ожидании" ? "status-awaiting" :
                            selectedStatus === "назначен" ? "status-assigned" :
                            selectedStatus === "завершен" ? "status-completed" :
                            selectedStatus === "отменен" ? "status-cancelled" : ""
                        }
                    >
                        {["в ожидании", "назначен", "завершен", "отменен"].map((statusOption, index) => (
                            <option key={index} value={statusOption}>{statusOption}</option>
                        ))}
                    </select>
                </div>
            </div>
            {isDetailsVisible && (
                <Modal isVisible={isDetailsVisible} onClose={toggleDetails}>
                    <DetailsOrder item={item} />
                    <DetailsCharacter 
                        item={item} 
                        onUpdate={(updatedItem) => console.log(updatedItem)} 
                        handleDeleteOrder={handleDeleteOrder}
                        onClose={toggleDetails}
                        onStatusUpdate={handleUpdateStatus}
                    />
                </Modal>
            )}
        </li>
    );
};

export default OrderItem;
