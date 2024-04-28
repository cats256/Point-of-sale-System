import React, { useState, useEffect } from "react";
import { getOrderTrends } from "../../../../network/api";

const OrderTrendsTable = ({ start_date, end_date }) => {
    const [orderTrends, setOrderTrends] = useState([]);

    useEffect(() => {
        // Fetch ingredient usage data when component mounts
        fetchOrderTrends();
    }, [start_date, end_date]); // Include start_date and end_date in the dependency array to fetch data when they change

    const fetchOrderTrends = async () => {
        try {
            const data = await getOrderTrends(start_date, end_date);
            console.log(data);
            setOrderTrends(data);
        } catch (error) {
            console.error("Error fetching ingredient usage:", error);
        }
    };

    return (
        <div>
            <h2>Ingredient Usage</h2>
            <table style={{ borderCollapse: "collapse", border: "1px solid black" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Title 1</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Title 2</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Title 3</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Title 4</th>
                    </tr>
                </thead>
                <tbody>
                    {orderTrends.map((order, index) => (
                        <tr key={index} style={{ border: "1px solid black" }}>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{order[0]}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{order[1]}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{order[2]}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{order[3]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTrendsTable;
