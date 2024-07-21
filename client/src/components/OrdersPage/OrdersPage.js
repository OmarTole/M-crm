import { useState, useEffect } from "react";
import OrderForm from "../OrderForm/OrderForm";
import NewOrders from "./NewOrders/NewOrders";
import AllOrders from "./AllOrders/AllOrders";
import { getToken, checkTokenExpiration, logout } from '../newFunction/newFunction';
import "./OrdersPage.css";

const Orders = () => {
    const [showContentOrders, setShowContentOrders] = useState(true);
    const [listUpdate, setListUpdate] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const token = getToken();
        if (token) {
            checkTokenExpiration(token, logout);
        }
    }, []);

    const onChangeList = (boolean) => {
        setShowContentOrders(boolean);
    };

    return (
        <div className="page ordersPage">
            <div className="type orderType">
                <OrderForm listUpdate={listUpdate} setListUpdate={setListUpdate}/>
                <div className="orderListName">
                    <button
                        className={showContentOrders ? 'active' : ''}  
                        onClick={() => onChangeList(true)}>
                        <span>Новые заказы</span>
                    </button>
                    <button
                        className={!showContentOrders ? 'active' : ''} 
                        onClick={() => onChangeList(false)}>
                        <span>Все заказы</span>
                    </button>
                </div>
                {showContentOrders ? (
                    <NewOrders 
                        listUpdate={listUpdate}
                        selectedCity={selectedCity}
                        selectedStatus={selectedStatus}
                        setSelectedCity={setSelectedCity}
                        setSelectedStatus={setSelectedStatus}
                    />
                ) : (
                    <AllOrders 
                        listUpdate={listUpdate}
                        selectedCity={selectedCity}
                        selectedStatus={selectedStatus}
                        setSelectedCity={setSelectedCity}
                        setSelectedStatus={setSelectedStatus}
                    />
                )}
            </div>
        </div>
    )
}

export default Orders;
