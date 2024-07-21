
import { role } from '../../newFunction/newFunction';

import './HeadEmployees.css'

const HeadEmployees = () => {
    return (
        <div className='head headEmployees'>
            <div className='headList headEmployeesList'>
                <div><p>Имя</p></div>
                <div><p>ДР</p></div>
                <div className='phone'><p>Контакты</p></div>
                { role() === "admin" && (<div><p>Город</p></div>)}
                <p>Действия</p>
            </div>
        </div>
    )
}

export default HeadEmployees;