import lowess from "@stdlib/stats-lowess";
import { Chart, registerables } from "chart.js";
import { sgg } from "ml-savitzky-golay-generalized";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getOrders } from "../../../../network/api";

Chart.register(...registerables);

const TotalOrdersGraph = ({ start_date, end_date, smoothingOption }) => {
    const [orderData, setOrderData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await getOrders(start_date, end_date);
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

                setOrderData(newOrderData);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchData();
    }, [start_date, end_date, smoothingOption]);

    return (
        <div>
            {/* <h2>Orders Line Chart</h2> */}
            <div>{/* <pre>{JSON.stringify(orderData, null, 2)}</pre> */}</div>
            <div className="chart-container">
                <h3>Orders Line Chart</h3>
                <Line
                    data={orderData}
                    options={{
                        scales: {
                            x: {
                                // Note the change from 'xAxes' to 'x'
                                ticks: {
                                    autoSkip: true,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    maxTicksLimit: 5,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TotalOrdersGraph;
