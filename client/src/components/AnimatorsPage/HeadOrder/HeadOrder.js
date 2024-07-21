// import './HeadEmployees.css'

const HeadOrder = () => {
    return (
        <div className='headOrders'>
            <div className='headOrdersList'>
                <p>#заказа</p>
                <p>Имя</p>
                <p>Программа</p>
                {/* <div><p>Контакты</p></div> */}
                <p>Дата</p>
                <p>Время</p>
            </div>
        </div>
    )
}

export default HeadOrder;