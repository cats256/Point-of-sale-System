import React, { useState, useEffect } from "react";
import { getIngredientUsage } from "../../../../network/api";

/**
 * Represents a table component for displaying ingredient usage.
 * @module IngredientUsageTable
 * @param {Object} props - The props object.
 * @param {Date} props.start_date - The start date for filtering ingredient usage.
 * @param {Date} props.end_date - The end date for filtering ingredient usage.
 */

const IngredientUsageTable = ({ start_date, end_date }) => {
    /**
     * State to store the ingredient usage data.
     * @type {[Array, function]}
     */

    const [ingredientUsage, setIngredientUsage] = useState([]);

    /**
     * Fetches ingredient usage data based on the provided start and end dates.
     * @function fetchIngredientUsage
     */

    useEffect(() => {
        const fetchIngredientUsage = async () => {
            try {
                const data = await getIngredientUsage(start_date, end_date);
                setIngredientUsage(data);
            } catch (error) {
                console.error("Error fetching ingredient usage:", error);
            }
        };

        // Fetch ingredient usage data when component mounts
        fetchIngredientUsage();
    }, [start_date, end_date]); // Include start_date and end_date in the dependency array to fetch data when they change

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
                            Total Ingredients Used
                        </th>
                        <th
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            Ingredient Quantity Left
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {ingredientUsage.map((ingredient, index) => (
                        <tr key={index} style={{ border: "1px solid black" }}>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {ingredient[0]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {ingredient[1]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {ingredient[2]}
                            </td>
                            <td
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                {ingredient[3]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IngredientUsageTable;
