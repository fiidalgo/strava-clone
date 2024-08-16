// /frontend/src/components/UpdateRun.js

import React, { useState } from 'react';
import axios from 'axios';

function UpdateRun({ run, onRunUpdated }) {
    const [date, setDate] = useState(run.date);
    const [distance, setDistance] = useState(run.distance);
    const [time, setTime] = useState(run.time);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/runs/${run.id}`, {
                date,
                distance,
                time,
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            onRunUpdated(res.data);
        } catch (err) {
            console.error('Error updating run:', err);
            setError('Failed to update run. Please try again.');
        }
    };

    return (
        <div>
            <h2>Update Run</h2>
            <form onSubmit={handleSubmit}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Distance (miles)" required />
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time (hh:mm:ss)" required />
                <button type="submit">Update Run</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default UpdateRun;