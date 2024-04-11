import { useState, useEffect } from 'react';
import { getMenuItems } from "../../network/api";
import { CashierView } from "../CashierView/CashierView";

const ItemAvailability = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
            } catch (error) {
                console.error('Failed to fetch menu items:', error);
            }
        };

        fetchItems();
    }, []);

    const toggleItemAvailability = (itemId) => {
        setMenuItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
            )
        );
    };

    return <CashierView menuItems={menuItems} toggleItemAvailability={toggleItemAvailability}></CashierView>;
};

export default ItemAvailability;