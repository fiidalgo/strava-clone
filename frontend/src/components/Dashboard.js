import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Analytics from './Analytics';
import FitnessScoreChart from './FitnessScoreChart';

function Dashboard() {
    const [runs, setRuns] = useState([]);
    const [range, setRange] = useState('7D');
    const [selectedRun, setSelectedRun] = useState(null);
    const [date, setDate] = useState('');
    const [distance, setDistance] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRuns();
    }, [range]);

    const fetchRuns = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/runs', {
                method: 'GET',
                headers: {
                    'x-auth-token': token
                }
            });
            const data = await res.json();
            setRuns(data);
        } catch (err) {
            console.error('Error fetching runs:', err);
        }
    };

    const handleAddOrUpdateRun = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const runData = { date, distance, time };
            if (selectedRun) {
                // Update run
                await axios.put(`http://localhost:5000/api/runs/${selectedRun.id}`, runData, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setRuns(runs.map(run => run.id === selectedRun.id ? { ...run, ...runData } : run));
            } else {
                // Add new run
                const res = await axios.post('http://localhost:5000/api/runs/log', runData, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setRuns([...runs, res.data])
            }
            resetForm();
        } catch (err) {
            console.error('Error saving run:', err);
            setError('Failed to save run. Please try again.');
        }
    };

    const resetForm = () => {
        setSelectedRun(null);
        setDate('');
        setDistance('');
        setTime('');
    };

    const handleUpdate = (run) => {
        setSelectedRun(run);
        setDate(run.date);
        setDistance(run.distance);
        setTime(run.time);
    };

    const handleDelete = async (runId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this run?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/runs/${runId}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            setRuns(runs.filter(run => run.id !== runId));
        } catch (err) {
            console.error('Error deleting run:', err);
            setError('Failed to delete run. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <div>
                <button onClick={() => setRange('7D')}>7D</button>
                <button onClick={() => setRange('1M')}>1M</button>
                <button onClick={() => setRange('3M')}>3M</button>
                <button onClick={() => setRange('6M')}>6M</button>
                <button onClick={() => setRange('1Y')}>1Y</button>
            </div>
           
            <div>
                <h3>Activity Analytics</h3>
                <Analytics range={range} runs={runs} />
            </div>

            <div>
                <FitnessScoreChart range={range} />
            </div>

            <div>
                <h2>{selectedRun ? 'Update Run' : 'Add New Run'}</h2>
                <form onSubmit={handleAddOrUpdateRun}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="Distance (miles)"
                        required
                    />
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Time (hh:mm:ss)"
                        required
                    />
                    <button type="submit">{selectedRun ? 'Update Run' : 'Add Run'}</button>
                </form>
                {error && <p>{error}</p>}
            </div>

            <div>
                <h3>Your Runs:</h3>
                <ul>
                {Array.isArray(runs) && runs.length > 0 ? (
                    runs.map(run => (
                        <li key={run.id}>
                            {run.date} - {run.distance} mi - {run.time} - {run.pace} min/mi
                            <button onClick={() => handleUpdate(run)}>Update</button>
                            <button onClick={() => handleDelete(run.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No runs available.</p>
                )}
            </ul>
            </div>
        </div>
    );
}

export default Dashboard;
