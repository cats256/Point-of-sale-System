import React, { useState, useEffect } from "react";
import { getOrderTrends } from "../../../../network/api";

/**
 * Represents a table component for displaying order trends.
 * @module OrderTrendsTable
 * @param {Object} props - The props object.
 * @param {Date} props.start_date - The start date for filtering order trends.
 * @param {Date} props.end_date - The end date for filtering order trends.
 */
const OrderTrendsTable = ({ start_date, end_date }) => {
    /**
     * State to store the order trends data.
     * @type {[Array, function]}
     */
    const [orderTrends, setOrderTrends] = useState([]);

    /**
     * Fetches data for the order trends based on the provided start and end dates.
     * @function fetchOrderTrends
     */

    return (
        <div>
            <h2>Ingredient Usage</h2>
            <table
                style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            Title 1
                        </th>
                        <th
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            Title 2
                        </th>
                        <th
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            Title 3
                        </th>
                        <th
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            Title 4
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orderTrends.map((order, index) => (
                        <tr key={index} style={{ border: "1px solid black" }}>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {order[0]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {order[1]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {order[2]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {order[3]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTrendsTable;
