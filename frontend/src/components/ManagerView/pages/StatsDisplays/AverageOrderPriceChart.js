/**
 * Represents a component for displaying the average order price chart.
 * @module AverageOrderPriceChart
 * @param {Object} props - The props object.
 * @param {Date} props.date - The date for which the average order price is calculated.
 */

// AverageOrderPriceChart.js
import React, { useState, useEffect } from "react";

const AverageOrderPriceChart = ({ date }) => {
    /**
     * State to store the data for the average order price.
     * @type {[Array, function]}
     */

    const [averageOrderPriceData, setAverageOrderPriceData] = useState([]);
    /**
     * Fetches data for the average order price based on the provided date.
     * @function fetchData
     */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/average_order_price?date=${date.toISOString()}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setAverageOrderPriceData(data);
            } catch (error) {
                console.error(
                    "Error fetching average order price data:",
                    error
                );
            }
        };

        fetchData();
    }, [date]);

    return (
        <div>
            {/* Render your chart component using averageOrderPriceData */}
            <p>Chart Placeholder - Average Order Price</p>
        </div>
    );
};

export default AverageOrderPriceChart;
