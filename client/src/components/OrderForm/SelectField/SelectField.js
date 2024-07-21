import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../../newFunction/newFunction';

const SelectField = ({ label, name, value, onChange, error, options = [] }) => {
    const [dataOptions, setDataOptions] = useState(options);

    const fetchOptions = useCallback(async () => {
        try {
            let url = '';
            if (name === 'nameEvent') {
                url = 'http://localhost:5000/api/events';
            } else if (name === 'city') {
                url = 'http://localhost:5000/api/branches/cities';
            }
            const result = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setDataOptions(result.data[name === 'nameEvent' ? 'events' : 'cities']);
        } catch (error) {
            console.error(`There was an error fetching the ${name}!`, error);
        }
    }, [name]);

    useEffect(() => {
        if (!options.length) {
            fetchOptions();
        }
    }, [fetchOptions, options.length]);

    return (
        <>
            <label htmlFor={name}><p>{label}</p></label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? "error" : ""}
            >
                <option value="">{`Выберите ${label.toLowerCase()}`}</option>
                {dataOptions.map(option => (
                    option !== 'SomeCity' ? 
                    <option key={option.id || option} value={option.name || option}>
                        {option.name || option}
                    </option> : null
                ))}
            </select>
            {error && <span className="error">{error}</span>}
        </>
    );
};

export default SelectField;
