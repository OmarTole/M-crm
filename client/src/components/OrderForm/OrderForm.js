import React, { useState, useEffect } from "react";
import axios from 'axios';
import InputField from "./InputField/InputField";
import SelectField from "./SelectField/SelectField";
import ProgramsField from "./ProgramsField/ProgramsField";
import Notification from './Notification/Notification';
import { onCurrentDate, getToken } from '../newFunction/newFunction';
import "./OrderForm.css";

const OrderForm = ({ listUpdate, setListUpdate }) => {
    const initialFormData = {
        orderId: "",
        nameClient: "",
        phoneNumber: "",
        nameEvent: "",
        address: "",
        characters: [],
        summ: "",
        prepayment: "",
        note: "",
        dateOrder: "",
        dateRegistr: "",
        timeOrder: "",
        status: "",
        city: localStorage.getItem('city') || "" // Извлечение города из localStorage
    };

    const fieldsConfig = [
        { name: "nameClient", label: "Имя клиента", type: "text" },
        { name: "phoneNumber", label: "Контакты", type: "number" },
        { name: "dateOrder", label: "Дата", type: "date" },
        { name: "timeOrder", label: "Время", type: "time" },
        { name: "address", label: "Адрес", type: "text" },
        { name: "nameEvent", label: "Мероприятие", type: "select" },
        { name: "summ", label: "Сумма", type: "number" },
        { name: "prepayment", label: "Предоплата", type: "number" },
        { name: "note", label: "Примечание", type: "text" },
        { name: "city", label: "Город", type: "select", roles: ["admin"] }
    ];

    const [formData, setFormData] = useState(initialFormData);
    const [display, setDisplay] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showNotification, setShowNotification] = useState(false);
    const [clients, setClients] = useState([]);
    const [cities, setCities] = useState([]);
    const now = new Date().toLocaleDateString('en-CA');

    const token = getToken();
    let role = '';

    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        role = decodedToken.role;
    }

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clients', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Fetched clients:", response.data.clients);
                setClients(response.data.clients);
            } catch (error) {
                console.error("There was an error fetching the clients!", error);
            }
        };

        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/branches/cities', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCities(response.data.cities);
            } catch (error) {
                console.error("There was an error fetching the cities!", error);
            }
        };

        fetchClients();
        fetchCities();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input change - ${name}: ${value}`);
        setFormData({ ...formData, [name]: value });
    };

    const onOpenForm = () => {
        setDisplay(!display);
    };

    const onCheckClient = async (newOrder) => {
        const existingClient = clients.find(client => client.phoneNumber === newOrder.phoneNumber);

        if (existingClient) {
            const updatedClient = {
                ...existingClient,
                orderQuantities: existingClient.orderQuantities + 1,
                orderSumm: existingClient.orderSumm + parseInt(newOrder.summ)
            };
            try {
                console.log("Updating existing client:", updatedClient);
                await axios.put(`http://localhost:5000/api/clients/${existingClient.id}`, updatedClient, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setClients(clients.map(client => client.id === existingClient.id ? updatedClient : client));
            } catch (error) {
                console.error("There was an error updating the client!", error);
            }
        }
    };

    const onCreateOrder = async (e) => {
        e.preventDefault();
        const errors = {};
        fieldsConfig.forEach((field) => {
            if (!formData[field.name] && (field.roles ? field.roles.includes(role) : true)) {
                errors[field.name] = "Заполните это поле";
            }
        });

        if (formData.characters.length === 0) {
            errors.characters = "Добавьте хотя бы одного персонажа";
        }

        const selectedDate = new Date(formData.dateOrder);
        if (selectedDate < new Date(now)) {
            errors.dateOrder = "Дата не может быть старше сегодняшней";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            const newOrder = {
                ...formData,
                characters: JSON.stringify(formData.characters), // Преобразование массива персонажей в строку JSON
                dateRegistr: onCurrentDate(),
                timeRegistr: new Date().toLocaleTimeString(),
                status: "в ожидании"
            };

            try {
                console.log('Sending order data:', newOrder);
                await axios.post('http://localhost:5000/api/orders', newOrder, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                onCheckClient(newOrder);
                setDisplay(!display);
                setFormData(initialFormData);
                setValidationErrors({});
                setShowNotification(true);
                setListUpdate(!listUpdate);
            } catch (error) {
                console.error("There was an error creating the order!", error);
                console.error("Error response:", error.response); // Логирование ответа ошибки
            }
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleAddCharacter = (character) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            characters: [...prevFormData.characters, character]
        }));
    };

    const handleRemoveCharacter = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            characters: prevFormData.characters.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            <div className="btnNewOrder">
                <button onClick={onOpenForm}>{display ? "Скрыть" : "Оформить заказ"}</button>
                {showNotification && (
                    <Notification
                        duration={5000}
                        onClose={handleCloseNotification}
                    />
                )}
            </div>
            <div className={display ? "orderForm" : "orderForm hidden"}>
                <form onSubmit={onCreateOrder}>
                    <View 
                        validationErrors={validationErrors} 
                        fieldsConfig={fieldsConfig} 
                        formData={formData} 
                        handleInputChange={handleInputChange} 
                        role={role}
                        cities={cities}
                    />
                    <ProgramsField
                        characters={formData.characters}
                        onAddCharacter={handleAddCharacter}
                        onRemoveCharacter={handleRemoveCharacter}
                        error={validationErrors.characters}
                    />
                    <button type="submit" className='addOrder'>Оформить заказ</button>
                </form>
            </div>
        </>
    );
};

const View = ({ validationErrors, fieldsConfig, formData, handleInputChange, role, cities }) => {
    return (
        <div className="formInput">
            {fieldsConfig.map(({ label, type, name, roles }, index) => {
                if (roles && !roles.includes(role)) return null;
                return (
                    <div key={index} className='date'>
                        {type === "select" ? (
                            <SelectField
                                label={label}
                                name={name}
                                value={formData[name]}
                                onChange={handleInputChange}
                                options={name === 'city' ? cities : []}
                                error={validationErrors[name]}
                            />
                        ) : (
                            <InputField
                                label={label}
                                type={type}
                                name={name}
                                value={formData[name] !== undefined ? formData[name] : ""} // Добавлено для предотвращения ошибки
                                onChange={handleInputChange}
                                error={validationErrors[name]}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default OrderForm;
