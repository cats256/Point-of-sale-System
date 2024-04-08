import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";
import { useBasket } from "../CustomerView/BasketContext";

const CashierView = () => {
    const { basket, totalCost, placeOrder, addItemToBasket } = useBasket();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);

    // dynamically getting menu items & categories
    useEffect(() => {
        fetchMenuItems();
        fetchCategories();
    }, []);

    // API call to fetch the menu items
    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/menu_items');
            const data = await response.json();
            setMenuItems(data.menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // API call to fetch the categories
    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        console.log('Categories:', categories);
    }, [categories]);

    const handleCategoryClick = (category) => {
        console.log('Category clicked:', category);
    };

    const handleItemClick = (item) => {
        addItemToBasket(item);
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between", minHeight: "100vh" }}>
            <div style={{ borderRight: "2px solid #000", display: "flex", flexDirection: "column", width: "15%", position: 'relative' }}>
                {categories.map((category, index) => (
                    <Button key={index} variant="outlined" onClick={() => handleCategoryClick(category)}>
                        {category}
                    </Button>
                ))}
            </div>

            <div style={{ borderRight: "2px solid #000", flexGrow: 10, display: "flex", flexDirection: "column", borderBottom: "2px solid #000", margin: 10 }}>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <h2>{item.name}</h2>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <Button onClick={() => handleItemClick(item)}>Add to Basket</Button>
                    </div>
                ))}
            </div>

            <div style={{ margin: 10, width: "25%" }}>
                <h1>Order #87940066</h1> {/* TO DO: Dynamically put in order numbers */}
                {basket.map((item, index) => (
                    <div key={index}>
                        <h2>{item.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${parseFloat(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <p>Total: ${totalCost.toFixed(2)}</p>
                <Button onClick={() => placeOrder()} disabled={basket.length === 0}>Place Order</Button>
            </div>
        </div>
    );
};

export { CashierView };