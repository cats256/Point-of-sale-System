// TotalOrdersGraph.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const TotalOrdersGraph = ({ start_date, end_date }) => {
    const [orderData, setOrderData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get('http://127.0.0.1:5000/orders_info', {
                //   params: {
                //     start_date: start_date,
                //     end_date: end_date,
                //   },
                // });
                const response = [];

                // Parse and process the data to prepare it for the Line graph
                const orders = response.data.orders;
                const ordersPerDay = {};

                orders.forEach((order) => {
                    const orderDate = order[3].split(",")[1].trim(); // Extracting the date part
                    if (!ordersPerDay[orderDate]) {
                        ordersPerDay[orderDate] = 0;
                    }
                    ordersPerDay[orderDate]++;
                });

                const orderDates = Object.keys(ordersPerDay);
                const orderCounts = Object.values(ordersPerDay);

                // Prepare data for Line graph
                const data = {
                    labels: orderDates,
                    datasets: [
                        {
                            label: "Number of Orders",
                            data: orderCounts,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                };

                console.log("Order Data:", data); // Log order data for debugging

                setOrderData(data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchData();
    }, [start_date, end_date]);

    console.log("Render Order Data:", orderData); // Log order data before rendering

    return (
        <div>
            <h2>Orders Line Chart</h2>
            <div>{/* <pre>{JSON.stringify(orderData, null, 2)}</pre> */}</div>
            <div className="chart-container">
                <h3>Orders Line Chart</h3>
                <Line data={orderData} />
            </div>
        </div>
    );
};

export default TotalOrdersGraph;
