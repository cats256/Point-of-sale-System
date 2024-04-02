import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import lowess from "@stdlib/stats-lowess";
import { sgg } from "ml-savitzky-golay-generalized";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);

const TotalOrdersGraph = ({ start_date, end_date }) => {
    const [orderData, setOrderData] = useState({ labels: [], datasets: [] });
    const [smoothingOption, setSmoothingOption] = useState("None");

    const handleChange = (event) => {
        setSmoothingOption(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/orders_info",
                    {
                        params: {
                            start_date: start_date,
                            end_date: end_date,
                        },
                    }
                );

                const orders = response.data.orders;
                const ordersPerDay = {};

                orders.forEach((order) => {
                    const orderDate = order[3].split(",")[1].trim();
                    if (!ordersPerDay[orderDate]) {
                        ordersPerDay[orderDate] = 0;
                    }
                    ordersPerDay[orderDate]++;
                });

                const orderDates = Object.keys(ordersPerDay);
                const orderCounts = Object.values(ordersPerDay);

                let yData;

                switch (smoothingOption) {
                    case "Savitzky-Golay Filter":
                        yData = sgg(orderCounts, 1, {
                            windowSize:
                                Math.floor(orderCounts.length / 20) % 2 === 0
                                    ? Math.floor(orderCounts.length / 20) + 1
                                    : Math.floor(orderCounts.length / 20),
                            derivative: 0,
                            polynomial: 3,
                        });
                        break;
                    case "LOWESS":
                        yData = lowess(
                            Array.from(
                                { length: orderCounts.length },
                                (_, i) => i + 1
                            ),
                            orderCounts,
                            { f: 0.1, nsteps: 10 }
                        ).y;
                        break;
                    default:
                        yData = orderCounts;
                        break;
                }

                const newOrderData = {
                    labels: orderDates,
                    datasets: [
                        {
                            label: "Number of Orders",
                            data: yData,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                        },
                    ],
                };

                // console.log("Order Data:", data);

                setOrderData(newOrderData);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchData();
    }, [start_date, end_date, smoothingOption]);

    // console.log("Render Order Data:", orderData);

    return (
        <div>
            <h2>Orders Line Chart</h2>
            <div>{/* <pre>{JSON.stringify(orderData, null, 2)}</pre> */}</div>
            <div className="chart-container">
                <h3>Orders Line Chart</h3>
                <FormControl style={{ width: "200px" }}>
                    <InputLabel>Smoothing Option</InputLabel>
                    <Select
                        value={smoothingOption}
                        label={smoothingOption}
                        onChange={handleChange}
                    >
                        <MenuItem key="None" value="None">
                            None
                        </MenuItem>
                        <MenuItem
                            key="Savitzky-Golay Filter"
                            value="Savitzky-Golay Filter"
                        >
                            Savitzky-Golay Filter
                        </MenuItem>
                        <MenuItem key="LOWESS" value="LOWESS">
                            LOWESS
                        </MenuItem>
                    </Select>
                </FormControl>
                <Line data={orderData} />
            </div>
        </div>
    );
};

export default TotalOrdersGraph;
