// statspage.js
// npm install react-datepicker

// can use this to display dates: {currentDate.toDateString()} and {comparisonDate.toDateString()}

import React, { useState } from "react";

// import Chart from "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { CategoryScale } from "chart.js";

import TotalOrdersGraph from "./StatsDisplays/TotalOrdersGraph"; // Assuming you have components for graphs
// import PopularProductsHistogram from './StatsDisplays/PopularProductsHistogram'; // Assuming you have components for graphs
// import AverageOrderPriceChart from './StatsDisplays/AverageOrderPriceChart'; // Assuming you have components for graphs
console.log("Got here");
const StatsPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [comparisonDate, setComparisonDate] = useState(new Date());

    const handleDateChange = (date, type) => {
        if (type === "current") {
            setCurrentDate(date);
        } else if (type === "comparison") {
            setComparisonDate(date);
        }
    };

    return (
        <div>
            <h1>Stats Page</h1>
            <div>
                <p>
                    Current Date:{" "}
                    <DatePicker
                        selected={currentDate}
                        onChange={(date) => handleDateChange(date, "current")}
                    />
                </p>
                <p>
                    Comparison Date:{" "}
                    <DatePicker
                        selected={comparisonDate}
                        onChange={(date) =>
                            handleDateChange(date, "comparison")
                        }
                    />
                </p>
            </div>
            {/* Total Orders Over Time */}
            <div>
                <h2>
                    Total Orders Over Time from {comparisonDate.toDateString()}{" "}
                    to {currentDate.toDateString()}
                </h2>
                <TotalOrdersGraph
                    start_date={currentDate}
                    end_date={comparisonDate}
                />
            </div>
        </div>
    );
};

export default StatsPage;

// {/* Total Orders Over Time */}
// <div>
// <h2>Total Orders Over Time from {comparisonDate.toDateString()} to {currentDate.toDateString()}</h2>
// <TotalOrdersGraph currentdate={currentDate} comparisondate= {comparisonDate} />
// </div>
// {/* Most Popular Products Histogram */}
// <div>
//   <h2>Most Popular Products for {currentDay.toDateString()}</h2>
//   <PopularProductsHistogram date={currentDay} />
// </div>

// {/* Average Order Price Chart */}
// <div>
//   <h2>Average Order Price Chart for {currentDay.toDateString()}</h2>
//   <AverageOrderPriceChart date={currentDay} />
// </div>
