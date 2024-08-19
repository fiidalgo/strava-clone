import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

function FitnessScoreChart({ range }) {
    const [fitnessScores, setFitnessScores] = useState([]);

    // Fetch fitness scores based on selected range
    useEffect(() => {
        fetchFitnessScores();
    }, [range]);

    const fetchFitnessScores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/user/fitness-scores', {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    range
                }
            });

            console.log('Fetched fitness scores:', res.data)

            const processedScores = processFitnessScores(res.data, range);

            console.log('Processed fitness scores:', processedScores);

            setFitnessScores(processedScores);
        } catch (err) {
            console.error('Error fetching fitness scores:', err)
        }
    };

    const processFitnessScores = (data, range) => { 
        const endDate = new Date();
        let startDate;

        switch (range) {
            case '7D':
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '1M':
                startDate = new Date(endDate);
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3M':
                startDate = new Date(endDate);
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6M':
                startDate = new Date(endDate);
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1Y':
                startDate = new Date(endDate);
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 7);
        }

        const dateMap = {};
        data.forEach(score => {
            const scoreDate = new Date(score.date);
            scoreDate.setDate(scoreDate.getDate() + 1);
            const dateStr = scoreDate.toDateString();
            dateMap[dateStr] = score.score;

            console.log(`Processed date: ${dateStr}, Fitness score: ${score.fitnessScore}`);
        });

        const dates = [];
        let previousFitnessScore = 0;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = new Date(d).toDateString();
            const fitnessScore = dateMap[dateStr] !== undefined ? dateMap[dateStr] : previousFitnessScore;
            dates.push({
                date: dateStr,
                fitnessScore: fitnessScore
            });
            previousFitnessScore = fitnessScore;
            console.log(`Final date: ${dateStr}, Final fitness score: ${dateMap[dateStr] || 0}`);
        }

        return dates;
    };

    // Prepare data for chart
    const chartData = {
        labels: fitnessScores.map(score => score.date),
        datasets: [
            {
                label: 'Fitness Score',
                data: fitnessScores.map(score => score.fitnessScore),
                fill: 'origin',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            }
        ]
    };

    // Chart options for displaying data
    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100
            },
            x: {
                type: 'category',
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <div>
            <h3>Fitness Score Over Time</h3>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default FitnessScoreChart;