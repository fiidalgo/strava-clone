import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

function Analytics({ range, runs }) {
    const [processedRuns, setProcessedRuns] = useState([]);

    useEffect(() => {
        setProcessedRuns(processRuns(runs, range));
    }, [range, runs]);

    const processRuns = (data, range) => {
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
        data.forEach((run) => {
            const runDate = new Date(run.date);
            runDate.setDate(runDate.getDate() + 1); // Fix the date offset
            const dateStr = runDate.toDateString();
            dateMap[dateStr] = run.distance;
        });

        const dates = [];
        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
        ) {
            const dateStr = new Date(d).toDateString();
            dates.push({
                date: dateStr,
                distance: dateMap[dateStr] || 0,
            });
        }

        return dates;
    };

    const chartData = {
        labels: processedRuns.map((run) => run.date),
        datasets: [
            {
                label: 'Distance (mi)',
                data: processedRuns.map((run) => run.distance),
                backgroundColor: 'rgba(255,87,34,0.2)',
                borderColor:'#FF5722',
                pointBackgroundColor: '#FF5722',
                fill: 'origin'
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 10,
            },
            x: {
                type: 'category',
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
        elements: {
            line: {
                borderWidth: 3,
            },
            point: {
                radius: 4,
            }
        }
    };

    return (
        <div>
            <Line data={chartData} options={chartOptions} />
        </div>
    );

}

export default Analytics;
