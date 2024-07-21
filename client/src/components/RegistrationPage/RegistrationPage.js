import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeadBranches from './HeadBranches/HeadBranches';
import InputBranch from './InputBranch/InputBranch';
import BranchList from './BranchList/BranchList';
import { getToken, checkTokenExpiration, logout } from '../newFunction/newFunction';
import './RegistrationPage.css';

const RegistrationPageBranches = () => {
    const [branches, setBranches] = useState([]);
    const [branchInput, setBranchInput] = useState({
        directorName: '',
        contact: '',
        city: '',
        password: ''
    });
    const [searchText, setSearchText] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            checkTokenExpiration(token, logout);
        }
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/branches', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setBranches(response.data.branches);
        } catch (error) {
            console.error("There was an error fetching the branches!", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredBranches = branches.filter(branch =>
        branch.directorName.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEditClick = (branch) => {
        setEditMode(true);
        setEditId(branch.id);
        setBranchInput({
            directorName: branch.directorName,
            contact: branch.contact,
            city: branch.city,
            password: branch.password
        });
    };

    const handleUpdateBranch = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/branches/${editId}`,
                branchInput,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setBranches(prev =>
                prev.map(branch =>
                    branch.id === editId ? { ...branch, ...branchInput } : branch
                )
            );
            setEditMode(false);
            setBranchInput({
                directorName: '',
                contact: '',
                city: '',
                password: ''
            });
        } catch (error) {
            console.error("There was an error updating the branch!", error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setBranchInput({
            directorName: '',
            contact: '',
            city: '',
            password: ''
        });
    };

    return (
        <div className='registrationPage page'>
            <div className="registrationType type">
                {/* <h1>Филиалы</h1> */}
                <div className="search">
                    <input 
                        type="text" 
                        placeholder="Введите имя директора"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="branchCount">
                    <p>Количество филиалов: {filteredBranches.length}</p>
                </div>
                <InputBranch 
                    input={branchInput} 
                    setBranches={setBranches}
                    branchInput={branchInput}
                    setBranchInput={setBranchInput}
                    editMode={editMode}
                    handleUpdateBranch={handleUpdateBranch}
                    handleCancelEdit={handleCancelEdit}
                />
                <HeadBranches />
                <BranchList 
                    branches={filteredBranches} 
                    setBranches={setBranches}
                    handleEditClick={handleEditClick}
                />
            </div>
        </div>
    );
}

export default RegistrationPageBranches;
