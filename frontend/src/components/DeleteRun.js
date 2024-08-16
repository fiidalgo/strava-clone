// /frontend/src/components/DeleteRun.js

import React, { useState } from 'react';
import axios from 'axios';

function DeleteRun({ run, onRunDeleted }) {
    const [error, setError] = useState('');

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/runs/${run.id}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            onRunDeleted(run.id);
        } catch (err) {
            console.error('Error deleting run:', err);
            setError('Failed to delete run. Please try again.');
        }
    };

    return (
        <div>
            <h2>Delete Run</h2>
            <p>Are you sure you want to delete this run?</p>
            <p>{`Date: ${run.date}, Distance: ${run.distance} miles, Time: ${run.time}`}</p>
            <button onClick={handleDelete}>Yes, delete</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default DeleteRun;