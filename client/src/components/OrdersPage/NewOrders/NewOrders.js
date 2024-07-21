import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItem from '../OrderItem/OrderItem';
import { onCurrentDate, getToken } from '../../newFunction/newFunction';
import HeadOrders from '../HeadOrders/HeadOrders';
import './NewOrders.css';

const NewOrders = ({ listUpdate, selectedCity, selectedStatus, setSelectedCity, setSelectedStatus }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, [listUpdate, selectedStatus, selectedCity]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setOrders(response.data.orders.reverse());
        } catch (error) {
            console.error("There was an error fetching the orders!", error);
        }
    };

    const onOrderList = () => {
        const currentDate = onCurrentDate();

        const filteredOrders = orders.filter(item => {
            if (!item.dateRegistr) {
                console.error("Order missing dateRegistr:", item);
                return false;
            }
            const itemDate = new Date(item.dateRegistr).toISOString().split('T')[0];
            const isStatusMatch = selectedStatus ? item.status === selectedStatus : true;
            const isCityMatch = selectedCity ? item.city === selectedCity : true;
            return currentDate === itemDate && isStatusMatch && isCityMatch;
        });

        const handleDeleteOrder = (id) => {
            setOrders(orders.filter(order => order.id !== id));
        };

        const summOrders = filteredOrders.reduce((acc, curr) => acc + Number(curr.summ), 0);
        const items = filteredOrders.map(item => <OrderItem key={item.id} item={item} onDelete={handleDeleteOrder} />);

        return (
            <div>
                <p className='summNewOrders'>Общая сумма: {summOrders} тг.</p>
                <HeadOrders 
                    selectedStatus={selectedStatus} 
                    handleStatusChange={(e) => setSelectedStatus(e.target.value)} 
                    selectedCity={selectedCity}
                    handleCityChange={(e) => setSelectedCity(e.target.value)}
                />
                <div className="ul"><ul>{items}</ul></div>
            </div>
        );
    };

    return (
        <div className="listNewOrders">
            {onOrderList()}
        </div>
    )
};

export default NewOrders;
