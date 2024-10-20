"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,   
    LinearScale,    
    PointElement,   
    LineElement,    
    Title,          
    Tooltip,        
    Legend,         
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const buttonClass = "py-1 px-2 rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled";

const SubmissionTrendsChart = () => {
    const [chartData, setChartData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async (page) => {
        const response = await fetch(`/api/submissions/display/stats/submission-trends?page=${page}&limit=10`);
        const data = await response.json();

        const labels = data.trends.map(entry => entry.date);
        const submissions = data.trends.map(entry => entry.submissions);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Submissions',
                    data: submissions,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        });

        setTotalPages(data.totalPages);
        setCurrentPage(parseInt(data.currentPage, 10));
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => parseInt(prevPage, 10) + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => parseInt(prevPage, 10) - 1);
        }
    };

    if (!chartData) return <p>Loading...</p>;

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Ensures y-axis shows only integers
                    callback: function(value) {
                        return Number.isInteger(value) ? value : null;
                    },
                },
            },
        },
    };

    return (
        <div>
            <Line data={chartData} options={options}  />

            <div className="flex justify-between items-center mt-4 p-4">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className={buttonClass}
                >
                    Previous
                </button>
                <span className="text-textSurface dark:text-dark-textSurface text-lg font-semibold">Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className={buttonClass}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SubmissionTrendsChart;
