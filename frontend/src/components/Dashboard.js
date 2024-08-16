// /frontend/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddRun from './AddRun';
import UpdateRun from './UpdateRun';
import DeleteRun from './DeleteRun';

function Dashboard() {
    const [runs, setRuns] = useState([]);
    const [selectedRun, setSelectedRun] = useState(null);
    const [view, setView] = useState('list');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRuns();
    }, []);

    const fetchRuns = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/runs', {
                headers: {
                    'x-auth-token': token
                }
            });
            setRuns(res.data);
        } catch (err) {
            console.error('Error fetching runs:', err);
        }
    };

    const handleRunAdded = (newRun) => {
        setRuns([...runs, newRun]);
        setView('list');
    };

    const handleRunUpdated = (updatedRun) => {
        setRuns(runs.map(run => run.id === updatedRun.id ? updatedRun : run));
        setView('list');
    };

    const handleRunDeleted = (runId) => {
        setRuns(runs.filter(run => run.id !== runId));
        setView('list');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h2>Your Runs</h2>
            <button onClick={handleLogout}>Logout</button>
            {view === 'list' && (
                <>
                    <button onClick={() => setView('add')}>Add Run</button>
                    <ul>
                        {runs.map(run => (
                            <li key={run.id}>
                                {`Date: ${run.date}, Distance: ${run.distance} miles, Time: ${run.time}, Pace: ${run.pace} min/mi`}
                                <button onClick={() => { setSelectedRun(run); setView('update'); }}>Update</button>
                                <button onClick={() => { setSelectedRun(run); setView('delete'); }}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {view === 'add' && <AddRun onRunAdded={handleRunAdded} />}
            {view === 'update' && <UpdateRun run={selectedRun} onRunUpdated={handleRunUpdated} />}
            {view === 'delete' && <DeleteRun run={selectedRun} onRunDeleted={handleRunDeleted} />}
        </div>
    );
}

export default Dashboard;