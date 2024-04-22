// statspage.js
// npm install ct-datepicker

// can use this to display dates: {currentDate.toDateString()} and {comparisonDate.toDateString()}

import React, { useState, useEffect } from "react";

// import Chart from "chart.js/auto";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// import { CategoryScale } from "chart.js";

import TotalOrdersGraph from "./StatsDisplays/TotalOrdersGraph"; // Assuming you have components for graphs
import { getTopTen, getItemName } from "../../../network/api";
// import PopularProductsHistogram from './StatsDisplays/PopularProductsHistogram'; // Assuming you have components for graphs
// import AverageOrderPriceChart from './StatsDisplays/AverageOrderPriceChart'; // Assuming you have components for graphs

const StatsPage = () => {
    const defaultStartDate = new Date(2024, 0, 1);
    const defaultEndDate = new Date(2024, 3, 15);

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [smoothingOption, setSmoothingOption] = useState("None");
    const smoothingOptions = ["None", "Savitzky-Golay Filter", "LOWESS"];
    const [item_labels, setLabels] = useState([]);
    const [item_data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const topten = await getTopTen();
            const _itemLabels = [];
            const _itemData = [];

            for (let i = 0; i < 10; i++) {
                // _itemLabels.push(await getItemName(topten[i]["menu_item_id"].toString()));
                _itemLabels.push("item " + i);
                _itemData.push(topten[i]["category_count"]);
            }

            setLabels(_itemLabels);
            setData(_itemData);
        };

        fetchData();
    }, []);

    const data = {
        labels: item_labels,
        datasets: [
            {
                label: "Number of Orders",
                data: item_data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ marginLeft: "15%" }}>
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

            <div>
                <h2>Top Ten Menu Item Orders Histogram</h2>
                <Bar data={data} />
            </div>
        </div>
    );
};

export default StatsPage;
