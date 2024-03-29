import React, { useState } from 'react';
import NavigationBar from './NavigationBar';

const CashierView = () => {
    const categories = [
        'value meals',
        'limited time offers',
        'seasonal items',
        'burgers',
        'sandwiches',
        'salads',
        'shakes & more',
        'appetizers',
        'beverages'
    ];

    const [orderItems, setOrderItems] = useState([]);
    
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

     return (
        <div className="cashier-container">
            <NavigationBar categories={categories} />

            <div className="main-content">
                <div className="order-view">
                    <h2>Current Order</h2>
                    <ul>
                        {orderItems.map((item, index) => (
                            <li key={index}>{item.name}: ${item.price.toFixed(2)}</li>
                        ))}
                    </ul>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <p>Subtotal: ${calculateSubtotal()}</p>
                    <p>Tax: ${calculateTax()}</p>
                    <p>Total: ${calculateTotal()}</p>
                </div>
            </div>
        </div>
    );
};

export { CashierView };
