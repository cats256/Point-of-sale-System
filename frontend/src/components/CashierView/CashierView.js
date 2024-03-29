import React, { useState } from 'react';

const CashierView = () => {
    const [orderItems, setOrderItems] = useState([]);
    
    const addItemToOrder = (itemName, price) => {
        const newItem = { name: itemName, price: price };
        setOrderItems([...orderItems, newItem]);
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    };

    const calculateTax = () => {
        const taxRate = 0.08; // 8% tax rate
        return (calculateSubtotal() * taxRate).toFixed(2);
    };

    const calculateTotal = () => {
        return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
    };

    return (
        <div>
            <div>
                <button onClick={() => addItemToOrder("Item 1", 5.99)}>Add Item 1</button>
                <button onClick={() => addItemToOrder("Item 2", 8.49)}>Add Item 2</button>
            </div>

            <div>
                <h2>Current Order</h2>
                <ul>
                    {orderItems.map((item, index) => (
                        <li key={index}>{item.name}: ${item.price.toFixed(2)}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Order Summary</h2>
                <p>Subtotal: ${calculateSubtotal()}</p>
                <p>Tax: ${calculateTax()}</p>
                <p>Total: ${calculateTotal()}</p>
            </div>
        </div>
    );
};

export { CashierView };
