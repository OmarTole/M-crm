import { useState, useEffect } from 'react';
import { role } from '../../newFunction/newFunction';
// import Modal from '../../Modal/Modal';

import './ClientItem.css';

const ClientItem = ({ item, onUpdateClient }) => {
    const { id, name, phoneNumber, orderQuantities, orderSumm, birthday, city } = item;
    // const [isModalVisible, setIsModalVisible] = useState(false);
    // const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: name || '',
        phoneNumber: phoneNumber || '',
        birthday: birthday || '',
        orderQuantities: orderQuantities || 0,
        orderSumm: orderSumm || 0,
        city: city || ''
    });

    useEffect(() => {
        setEditData({
            name: name || '',
            phoneNumber: phoneNumber || '',
            birthday: birthday || '',
            orderQuantities: orderQuantities || 0,
            orderSumm: orderSumm || 0,
            city: city || ''
        });
    }, [name, phoneNumber, birthday, orderQuantities, orderSumm, city]);

    // const toggleModal = () => {
    //     setIsModalVisible(!isModalVisible);
    // };

    // const toggleEdit = (e) => {
    //     e.stopPropagation();
    //     setIsEditing(!isEditing);
    // };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditData({
    //         ...editData,
    //         [name]: value
    //     });
    // };

    // const saveChanges = (e) => {
    //     e.stopPropagation();
    //     onUpdateClient({ ...item, ...editData });
    //     setIsEditing(false);
    // };

    // const inputFields = [
    //     { label: "Имя клиента", name: "name", type: "text" },
    //     { label: "Телефон", name: "phoneNumber", type: "number" },
    //     { label: "День рождения", name: "birthday", type: "date" }
    // ];

    return (
        <>
            <li className="client-item" key={id} >
                <div className='item'>
                    <div className='title noEdit'>
                        <div><p>{name}</p></div>
                        {/* <div><p>{onCurDate(birthday)}</p></div> */}
                        <div><p>{phoneNumber}</p></div>
                        <div className='hide-on-mobile'><p>{orderQuantities}</p></div>
                        <div className='hide-on-mobile'><p>{orderSumm}</p></div>
                        {role() === "admin" && <div><p>{city}</p></div>}
                    </div>
                </div>
            </li>
            {/* {isModalVisible && (
                <Modal isVisible={isModalVisible} onClose={toggleModal}>
                    <div className="client-details">
                        {isEditing ? (
                            <div className='item edit'>
                                <div className='title label'>
                                    {inputFields.map(({ label, name, type }) => (
                                        <label key={name}>
                                            {label}:
                                            <input
                                                type={type}
                                                name={name}
                                                value={editData[name]}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    ))}
                                </div>
                                <div className='itemBtn'>
                                    <button onClick={saveChanges} className='addBtn'>
                                        Сохранить
                                    </button>
                                    <button onClick={toggleEdit} className='cancelBtn'>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className='item'>
                                <div className='title noEdit'>
                                    <div><p>Имя: {name}</p></div>
                                    <div><p>День рожд.: {onCurDate(birthday)}</p></div>
                                    <div><p>Контакты: {phoneNumber}</p></div>
                                    <div><p>Заказы: {orderQuantities}</p></div>
                                    <div><p>Сумма: {orderSumm}</p></div>
                                    {role() === "admin" && <div><p>Город: {city}</p></div>}
                                </div>
                                <button onClick={toggleEdit} className='changeBtn'>
                                    Изменить
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )} */}
        </>
    );
};

export default ClientItem;
