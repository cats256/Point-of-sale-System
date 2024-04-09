// statspage.js
// npm install ct-datepicker

// can use this to display dates: {currentDate.toDateString()} and {comparisonDate.toDateString()}

import React, { useState } from "react";

// import Chart from "chart.js/auto";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// import { CategoryScale } from "chart.js";

import TotalOrdersGraph from "./StatsDisplays/TotalOrdersGraph"; // Assuming you have components for graphs
// import PopularProductsHistogram from './StatsDisplays/PopularProductsHistogram'; // Assuming you have components for graphs
// import AverageOrderPriceChart from './StatsDisplays/AverageOrderPriceChart'; // Assuming you have components for graphs

const StatsPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [smoothingOption, setSmoothingOption] = useState("None");
    const smoothingOptions = ["None", "Savitzky-Golay Filter", "LOWESS"];

    return (
        <div>
            {/* <h2 style={{ marginBottom: "32px" }}>Charts</h2> */}
            <div
                style={{
                    display: "flex",
                    gap: "16px",
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={dayjs(startDate)}
                        onChange={(currentDate) =>
                            setStartDate(currentDate.toDate())
                        }
                    />
                    <DatePicker
                        label="End Date"
                        value={dayjs(endDate)}
                        onChange={(currentDate) =>
                            setEndDate(currentDate.toDate())
                        }
                    />
                    <FormControl style={{ width: "200px" }}>
                        <InputLabel>Smoothing Option</InputLabel>
                        <Select
                            value={smoothingOption}
                            label={smoothingOption}
                            onChange={(event) => {
                                setSmoothingOption(event.target.value);
                            }}
                        >
                            {smoothingOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </LocalizationProvider>
            </div>
            {/* Total Orders Over Time */}
            <div>
                {/* <h2>
                    Total Orders Over Time from {startDate.toDateString()} to{" "}
                    {endDate.toDateString()}
                </h2> */}
                <TotalOrdersGraph
                    start_date={startDate}
                    end_date={endDate}
                    smoothingOption={smoothingOption}
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
