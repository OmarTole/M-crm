import './DetailsOrder.css';

const DetailsOrder = ({ item }) => {
    const {
        nameClient, 
        phoneNumber, 
        nameEvent, 
        address, 
        summ, 
        prepayment, 
        note, 
        dateOrder, 
        timeOrder
    } = item;

    const details = [
        { label: 'Имя:', value: nameClient },
        { label: 'Контакты:', value: phoneNumber },
        { label: 'Мероприятие:', value: nameEvent },
        { label: 'Адрес:', value: address },
        { label: 'Сумма:', value: summ },
        { label: 'Предоплата:', value: prepayment },
        { label: 'Дата:', value: dateOrder },
        { label: 'Время:', value: timeOrder }
    ];

    return (
        <div className='detailsOrder'>
            <div className='detail'>
                {details.map((detail, index) => (
                    <div key={index}>
                        <span>{detail.label}</span> {detail.value}
                    </div>
                ))}
            </div>
            <div className='note'>
                <span>Примечание:</span> {note}
            </div>
            <div className='note1'>
                <span>Остаток:  </span>
                <div className='warning'> {summ - prepayment}</div>
            </div>
        </div>
    );
};

export default DetailsOrder;
