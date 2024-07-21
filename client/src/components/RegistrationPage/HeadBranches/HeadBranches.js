import React from 'react';
import './HeadBranches.css';

const HeadBranches = () => {
    return (
        <div className='head headBranches'>
            <div className='headList headBranchesList'>
                <div><p>Имя</p></div>
                <div><p>Контакты</p></div>
                <div><p>Город</p></div>
                {/* <p>Пароль</p> */}
                <p>Действия</p>
            </div>
        </div>
    )
}

export default HeadBranches;
