import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';
import './BranchList.css';

const BranchList = ({ branches, setBranches }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [password, setPassword] = useState('');

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setPassword('');
    };

    const handleInputChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSaveClick = async (id) => {
        if (password.trim() === '') {
            console.error("Password cannot be empty");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/branches/${id}`, { password }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setEditingIndex(null);
            setPassword('');
        } catch (error) {
            console.error("There was an error updating the branch!", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/branches/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setBranches(prev => prev.filter(branch => branch.id !== id));
        } catch (error) {
            console.error("There was an error deleting the branch!", error);
        }
    };

    const filteredBranches = branches.filter(branch => branch.directorName.toLowerCase() !== 'admin');

    return (
        <div className="ul">
            <ul className="branchList">
                {filteredBranches.map((branch, index) => (
                    <li key={branch.id} className="item">
                        {editingIndex === index ? (
                            <div className='edit-form'>
                                <div><p>{branch.directorName}</p></div>
                                <div><p>{branch.contact}</p></div>
                                <div><p>{branch.city}</p></div>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={handleInputChange} 
                                    placeholder="Новый пароль" 
                                />
                                <div>
                                    <button className='addBtn' onClick={() => handleSaveClick(branch.id)}>Сохранить</button>
                                    <button className='cancelBtn' onClick={() => setEditingIndex(null)}>Отмена</button>
                                    <button className='delBtn' onClick={() => handleDelete(branch.id)}>Удалить</button>
                                </div>
                            </div>
                        ) : (
                            <div className='title'>
                                <div><p>{branch.directorName}</p></div>
                                <div><p>{branch.contact}</p></div>
                                <div><p>{branch.city}</p></div>
                                <button className='changeBtn' onClick={() => handleEditClick(index)}>Изменить</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BranchList;
