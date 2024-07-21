import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeadEmployees from './HeadEmployees/HeadEmployees';
import InputList from './InputList/InputList';
import EmployeeList from './EmployeeList/EmployeeList';
import { getToken, checkTokenExpiration, logout } from '../newFunction/newFunction';
import './EmployeesPage.css';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [employeeInput, setEmployeeInput] = useState({
        name: '',
        phone: '',
        birthday: '',
        city: ''
    });
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const token = getToken();
        if (token) {
            checkTokenExpiration(token, logout);
        };
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setEmployees(response.data.employees);
        } catch (error) {
            console.error("There was an error fetching the employees!", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className='page employeesPage'>
            <div className="type employeesType">
                <div className='employeesList'>
                    <div className="search">
                        <input 
                            type="text" 
                            placeholder="Введите имя аниматора"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="employeeCount">
                        <p>Кол-во аниматоров: {filteredEmployees.length}</p>
                    </div>
                    <InputList 
                        input={employeeInput} 
                        setEmployees={setEmployees}
                        employeeInput={employeeInput}
                        setEmployeeInput={setEmployeeInput}
                    />
                    <HeadEmployees />
                    <EmployeeList 
                        employees={filteredEmployees} 
                        setEmployees={setEmployees}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
