/**
 * Represents a component for displaying ingredient usage data in a table.
 * @param {Object} props - The props object containing the start and end dates.
 * @param {Date} props.start_date - The start date for the period of ingredient usage.
 * @param {Date} props.end_date - The end date for the period of ingredient usage.
 * @returns {JSX.Element} The JSX element representing the ingredient usage table component.
 */
const IngredientUsageTable = ({ start_date, end_date }) => {
    /**
     * State hook for storing the ingredient usage data.
     * @type {Array}
     */
    const [ingredientUsage, setIngredientUsage] = useState([]);

    /**
     * Effect hook for fetching ingredient usage data from the server.
     * @function
     * @param {Date} start_date - The start date for the period of ingredient usage.
     * @param {Date} end_date - The end date for the period of ingredient usage.
     */
    useEffect(() => {
        /**
         * Fetches ingredient usage data from the server.
         * @async
         * @function
         * @returns {Promise<void>} A promise that resolves when data is fetched successfully.
         */
        const fetchIngredientUsage = async () => {
            try {
                const data = await getIngredientUsage(start_date, end_date);
                setIngredientUsage(data);
            } catch (error) {
                console.error("Error fetching ingredient usage:", error);
            }
        };

        // Fetch ingredient usage data when component mounts or when start_date or end_date changes
        fetchIngredientUsage();
    }, [start_date, end_date]);

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
