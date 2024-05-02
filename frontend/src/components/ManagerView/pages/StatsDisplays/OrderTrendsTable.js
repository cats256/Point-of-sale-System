/**
 * Represents a component for displaying order trends in a table.
 * @param {Object} props - The props object containing the start and end dates.
 * @param {Date} props.start_date - The start date for the period of analysis.
 * @param {Date} props.end_date - The end date for the period of analysis.
 * @returns {JSX.Element} The JSX element representing the order trends table component.
 */
const OrderTrendsTable = ({ start_date, end_date }) => {
    /**
     * State hook for storing the order trends data.
     * @type {Array}
     */
    const [orderTrends, setOrderTrends] = useState([]);

    /**
     * Effect hook for fetching order trends data from the server.
     * @function
     * @param {Date} start_date - The start date for the period of analysis.
     * @param {Date} end_date - The end date for the period of analysis.
     */
    useEffect(() => {
        /**
         * Fetches order trends data from the server.
         * @async
         * @function
         * @returns {Promise<void>} A promise that resolves when data is fetched successfully.
         */
        const fetchOrderTrends = async () => {
            try {
                const data = await getOrderTrends(start_date, end_date);
                setOrderTrends(data);
            } catch (error) {
                console.error("Error fetching order trends:", error);
            }
        };

        // Fetch order trends data when component mounts or when start_date or end_date changes
        fetchOrderTrends();
    }, [start_date, end_date]);

    // Render the table component
    return (
        <div>
            <h2>Order Trends</h2>
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
