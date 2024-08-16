import React, { useState } from 'react';
import axios from 'axios';

function AddRun({ onRunAdded }) {
    const [date, setDate] = useState('');
    const [distance, setDistance] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/runs/log', {
                date,
                distance,
                time,
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            onRunAdded(res.data);
        } catch (err) {
            console.error('Error adding run:', err);
            setError('Failed to add run. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add New Run</h2>
            <form onSubmit={handleSubmit}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Distance (miles)" required />
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time (hh:mm:ss)" required />
                <button type="submit">Add Run</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default AddRun;