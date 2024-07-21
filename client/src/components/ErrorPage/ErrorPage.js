import React from 'react';
import './ErrorPage.css';

const ErrorPage = ({ message }) => {

    return (
        <div className='page errorPage'>
            <div className="type errorType">
                <h1>Ошибка</h1>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ErrorPage;
