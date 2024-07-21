
import { role } from '../../newFunction/newFunction';

import './HeadClients.css'


const HeadClients = () => {
    return (
        <div className='head headClients'>
            <div className='headList headClientsList'>
                <div><p>Имя</p></div>
                {/* <div><p>ДР</p></div> */}
                <div><p>Контакты</p></div>
                <div className='hide-on-mobile'><p>Заказы</p></div>
                <div className='hide-on-mobile'><p>Сумма</p></div>
                {role() === "admin" && <div><p>Город</p></div> }
            </div>
        </div>
    )
}

export default HeadClients;