import React, { useState, useEffect } from "react";
import { getExcessReport } from "../../../../network/api";

const ExcessReport = ({ start_date, end_date }) => {
    const [excessReport, setExcessReport] = useState([]);

    useEffect(() => {
        const fetchExcessReport = async () => {
            try {
                const data = await getExcessReport(start_date, end_date);
                setExcessReport(data);
            } catch (error) {
                console.error("Error fetching ingredient usage:", error);
            }
        };

        // Fetch ingredient usage data when component mounts
        fetchExcessReport();
    }, [start_date, end_date]); // Include start_date and end_date in the dependency array to fetch data when they change

    return (
        <div>
            <h2>Excess Report</h2>
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
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
                                Ingredient ID
                            </th>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Ingredient Name
                            </th>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Total Ingredients Count
                            </th>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Ingredient Quantity
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {excessReport.map((excess, index) => (
                            <tr key={index} style={{ border: "1px solid black" }}>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {excess[0]}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {excess[1]}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {excess[2]}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {excess[3]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExcessReport;
