import React, { useState } from 'react';
import NavigationBar from './NavigationBar';

const CashierView = () => {
    const categories = [
        'value meals',
        // 'limited time offers',
        // 'seasonal items',
        'burgers',
        'sandwiches',
        // 'salads',
        'shakes & more',
        'sides',
        'beverages'
    ];

    // Initializing states
    const [orderItems, setOrderItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const addItemToOrder = (itemName, price) => {
        const newItem = { name: itemName, price: price };
        setOrderItems([...orderItems, newItem]);
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    };

    const calculateTax = () => {
        const taxRate = 0.08;
        return (calculateSubtotal() * taxRate).toFixed(2);
    };

    const calculateTotal = () => {
        return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
    };

    // Handling the dynamic main interface
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleCheckout = () => {
        let orderDetails = "Order Details:\n";
        orderItems.forEach((item, index) => {
            orderDetails += `${index + 1}. ${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        orderDetails += `\nSubtotal: $${calculateSubtotal()}\n`;
        orderDetails += `Tax: $${calculateTax()}\n`;
        orderDetails += `Total: $${calculateTotal()}`;
    
        alert(orderDetails);
    };

    return (
        <div className="cashier-container">
            <NavigationBar categories={categories} handleCategoryClick={handleCategoryClick} />

            <div className="main-content">
                {selectedCategory && (
                    <div className="category-items">
                        <h2>{selectedCategory}</h2>
                        <ul>
                            {categoryItems[selectedCategory]?.map((item) => (
                                <li key={item.id}>{item.name}: ${item.price.toFixed(2)}</li>
                            )) || <div>No items found for this category.</div>}
                        </ul>
                    </div>
                )}

                <div className="checkout-order">
                    <button onClick={handleCheckout}>Checkout</button>
                </div>
            </div>
        </div>
    );
};

export { CashierView };
