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

    const [orderItems, setOrderItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Items in each category
    const categoryItems = {
        // will be updated to be API endpoints/queries. just for MVP rn
        'value meals': [
            { id: 38, name: 'burger_combo_28.0', price: 1.69 },
            { id: 39, name: 'burger_combo_28.1', price: 1.69 },
            { id: 40, name: 'basket_combo_29.0', price: 1.1 },
            { id: 41, name: 'basket_combo_29.1' , price: 1.1 },
            { id: 42, name: 'sandwich_combo_30.0', price: 1.90 },
            { id: 43, name: 'sandwich_combo_30.1', price: 1.90 },
            { id: 44, name: 'gig_em_patty_melt_combo_31.0', price: 1.80 },
            { id: 45, name: 'gig_em_patty_melt_combo_31.1 ', price: 1.80 },
        ],
        
        'burgers': [
            { id: 0, name: 'revs_burger_1.0', price: 5.59 },
            { id: 1, name: 'revs_burger_1.1', price: 5.59 },
            { id: 2, name: 'double_stack_cheese_burger_2.0', price: 8.69 },
            { id: 3, name: 'double_stack_cheese_burger_2.1', price: 8.69 },
            { id: 4, name: 'classic_burger_3.0', price: 5.49 },
            { id: 5, name: 'classic_burger_3.1', price: 5.49 },
            { id: 6, name: 'bacon_cheeseburger_4.0', price: 6.99 },
            { id: 7, name: 'bacon_cheeseburger_4.1', price: 6.99 },
        ],

        'sandwiches': [
            { id: 10, name: 'revs_burger_1.0', price: 6.29 },
            { id: 11, name: 'revs_burger_1.1', price: 6.29 },
            { id: 12, name: 'revs_burger_1.0', price: 6.99 },
            { id: 13, name: 'revs_burger_1.1', price: 5.79 },
            { id: 14, name: 'revs_burger_1.0', price: 5.79 },
            { id: 15, name: 'revs_burger_1.1', price: 3.49 },
        ],

        'shakes & more': [
            { id: 16, name: 'aggie_shake_11.0', price: 3.99 },
            { id: 17, name: 'aggie_shake_11.1', price: 3.99 },
            { id: 18, name: 'aggie_shake_11.2', price: 3.99 },
            { id: 19, name: 'aggie_shake_11.3', price: 3.99 },
            { id: 20, name: 'double_scoop_ice_cream_cup_12.0', price: 4.00 },
            { id: 21, name: 'chocolate_chip_chunk_cookie_13.0   ', price: 3.00 },
            { id: 22, name: 'chocolate_fudge_brownie_14.0', price: 3.00 },
        ],

        'sides': [
            { id: 34, name: 'fries_25.0', price: 3.00 },
            { id: 35, name: 'tater_tots_25.1', price: 3.00 },
            { id: 36, name: 'onion_rings_26.0', price: 3.00 },
            { id: 37, name: 'kettle_chips_27.0', price: 2.50 },
        ],

        'beverages': [
            { id: 30, name: 'fries_25.0', price: 2.25 },
            { id: 31, name: 'tater_tots_25.1', price: 2.45  },
            { id: 32, name: 'onion_rings_26.0', price: 2.29 },
            { id: 33, name: 'kettle_chips_27.0', price: 3.65 },
        ]
    };
    
    // Adding Items to Order
    const addItemToOrder = (itemName, price) => {
        const existingItemIndex = orderItems.findIndex(item => item.name === itemName);

        if (existingItemIndex >= 0) {
            const newOrderItems = [...orderItems];
            newOrderItems[existingItemIndex] = {
                ...newOrderItems[existingItemIndex],
                quantity: (newOrderItems[existingItemIndex].quantity || 1) + 1,
                price: newOrderItems[existingItemIndex].price + price
            };
            setOrderItems(newOrderItems);
        } 
        
        else {
            setOrderItems(prevItems => [...prevItems, { name: itemName, price, quantity: 1 }]);
        }
    };

    // Order Calculations
    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
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

    // Handling Checkout Summary
    const handleCheckout = () => {
        let orderSummary = "Order Summary:\n\n";
    
        orderItems.forEach((item, index) => {
            orderSummary += `${index + 1}. ${item.name} x ${item.quantity}: $${(item.price).toFixed(2)}\n`;
        });
    
        const subtotal = calculateSubtotal();
        const tax = calculateTax();
        const total = calculateTotal();
        
        orderSummary += `\nSubtotal: $${subtotal}\n`;
        orderSummary += `Tax: $${tax}\n`;
        orderSummary += `Total: $${total}`;
    
        alert(orderSummary);
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
                                <li key={item.id}>
                                    {item.name}: ${item.price.toFixed(2)}{" "}
                                    <button onClick={() => addItemToOrder(item.name, item.price)}>Add to Order</button>
                                </li>
                            ))}
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
