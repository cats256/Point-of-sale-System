/**
 * Represents a component for displaying a histogram of menu item orders.
 * @param {Object} props - The props object containing the start and end dates.
 * @param {Date} props.start_date - The start date for the period of analysis.
 * @param {Date} props.end_date - The end date for the period of analysis.
 * @returns {JSX.Element} The JSX element representing the menu item orders histogram component.
 */
const MenuItemOrdersHistogram = ({ start_date, end_date }) => {
    /**
     * State hook for storing the labels of menu items.
     * @type {Array}
     */
    const [itemLabels, setLabels] = useState([]);

    /**
     * State hook for storing the data of menu items.
     * @type {Object}
     */
    const [itemData, setData] = useState({});

    /**
     * State hook for storing the background colors for the histogram bars.
     * @type {Array}
     */
    const [backgroundColors, setBackgroundColors] = useState([]);

    /**
     * State hook for storing the border colors for the histogram bars.
     * @type {Array}
     */
    const [borderColors, setBorderColors] = useState({});

    /**
     * Effect hook for fetching menu item orders data from the server.
     * @function
     * @param {Date} start_date - The start date for the period of analysis.
     * @param {Date} end_date - The end date for the period of analysis.
     */
    useEffect(() => {
        /**
         * Fetches menu item orders data from the server.
         * @async
         * @function
         * @returns {Promise<void>} A promise that resolves when data is fetched successfully.
         */
        const fetchData = async () => {
            // Fetch order data from the server based on the provided start_date and end_date
            const orders = await getOrders(start_date, end_date);
            const order_ids = orders.map((order) => order[0]); // Extracting order IDs from orders
            order_ids.sort();
            const start_id = order_ids[0];
            const finish_id = order_ids[order_ids.length - 1];

            // Fetch menu item data based on the order IDs retrieved
            const menu_items = await getOrderMenuItemsFromId(
                start_id,
                finish_id
            );

            // Prepare data for the histogram
            const _itemLabels = [];
            const _itemData = [];
            const _backgroundColors = [];
            const _borderColors = [];

            // Arrays for defining colors
            const backgroundColorsBank = [
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
            ];
            const borderColorsBank = [
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
            ];

            // Loop through menu items and retrieve necessary information
            for (let i = 0; i < menu_items.length; i++) {
                const item_id = menu_items[i]["menu_item_id"];
                const item_name = await getItemName(item_id);
                _itemLabels.push(item_name.item_id);
                _itemData.push(menu_items[i]["category_count"]);
                _backgroundColors.push(backgroundColorsBank[i % 10]);
                _borderColors.push(borderColorsBank[i % 10]);
            }

            // Set the state with the fetched data
            setLabels(_itemLabels);
            setData(_itemData);
            setBackgroundColors(_backgroundColors);
            setBorderColors(_borderColors);
        };

        fetchData();
    }, [start_date, end_date]);

    // Data object for the histogram
    const data = {
        labels: itemLabels,
        datasets: [
            {
                label: "Number of Orders",
                data: itemData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    // Render the histogram component
    return (
        <div>
            <h2>Menu Item Orders Histogram</h2>
            {itemLabels.length > 0 && <Bar data={data} />}
        </div>
    );
};

export default MenuItemOrdersHistogram;
