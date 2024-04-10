import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";
import { getOrderId } from "../../network/api";

const CashierView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const { basket, 
            addItemToBasket, 
            increaseItemQuantity, 
            decreaseItemQuantity, 
            removeItemFromBasket, 
            emptyBasket, 
            placeOrder, 
        } = useBasket();

    const generateButtons = (text, panel = '', img = '', alt = '') => (
        <Button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            style={{
                backgroundColor: currType === text ? "#C2A061" : '',
                color: currType === text ? "white" : '',
                marginRight: 8,
            }}
        >
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );

    const AssociatedMenuItems = () => {
        let filteredItems = menuItems.filter((item) => item.type === panel);

        const handleItemClick = (item) => {
            addItemToBasket(item);
        };

        return (
            <div style = {{ display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: 'white'}}>
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <div key={index}>
                            <button
                                variant="outlined"
                                onClick={() => handleItemClick(item)}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                }}
                            >
                                <div style = {{ fontWeight: "bold" }}>
                                    {itemName} 
                                </div>
                                ${item.price}
                            </button>
                        </div>
                    );
                })}
                {["Burgers", "Baskets", "Sandwiches"].includes(panel) && (
                    <div>Make it a combo</div>
                )}
            </div>
        );
    };

    const DisplayBasket = () => {
        // Subtotal, tax, & total
        const subtotal = basket.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const rate = 0.08;
        const tax = subtotal * rate;
        const total = subtotal + tax;

        return (
            <div>
                <h1>Order #232323</h1> {/* This is where I want it to display the current order # */}

                {/* Clear Cart button */}
                <button 
                    style={{ marginBottom: "20px", marginTop: "20px", display: 'flex', justifyContent: 'center' }}
                    onClick={() => {emptyBasket()}}>
                    Clear Basket
                </button>

                {basket.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "25px"}}>
                        <div style={{ flexGrow: 1 }}>
                            <span style={{ fontWeight: 'bold' }}>{formatItemName(item)} </span>
                            ${parseFloat(item.price * item.quantity).toFixed(2)}
                            
                            {/* Quantity modification buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => decreaseItemQuantity(item.name)}
                                    aria-label="Decrease item">
                                    -
                                </button>
                                {item.quantity}
                                <button
                                    style={{ marginRight: '20px' }}
                                    onClick={() => increaseItemQuantity(item.name)}
                                    aria-label="Increase item">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Delete button */}
                        <button 
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                            aria-label="Delete"
                            onClick={() => {removeItemFromBasket(item.name)}}>
                            <DeleteIcon style={{ fontSize: '1.25rem' }} /> 
                        </button>
                    </div>
                ))}

                {/* Display subtotal, tax, and total */}
                <div style={{ position: 'fixed', display: 'flex', flexDirection: 'column', bottom: 10, marginTop: "20px", fontWeight: "bold" }}>
                    <div>
                        Subtotal: ${subtotal.toFixed(2)}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        Tax (8%): ${tax.toFixed(2)}
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        Total: ${total.toFixed(2)}
                    </div>
                    <button onClick={() => placeOrder()} disabled={basket.length === 0}>Place Order</button>
                </div>
            </div>
        );
    };

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
        return (
            <>
                <button 
                    style={{ 
                        position: 'absolute',  
                        bottom: 10, 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        justifyContent: 'center' 
                    }}
                    aria-label="accessibility options"
                    onClick={() => setShowAccessibilityPanel(prevState => !prevState)} // Adjusted to call the toggle function
                >
                    <SettingsAccessibilityIcon />
                </button>
                {showAccessibilityPanel && (
                    <div style={{
                        position: 'fixed', 
                        bottom: '50px', 
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <button onClick={() => setShowAccessibilityPanel(prevState => !prevState)}>
                            <CloseIcon/>
                        </button>
                        <span> Accessibility Options </span>
                        
                    </div>
                )}
            </>
        );
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: "100vh",
            }}
        >
            <div style={{ 
                margin: 10,
                width: "25%",
                borderRight: "2px solid #000",
                paddingRight: "10px"
            }}>
                <DisplayBasket />
            </div>

            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "2px solid #000", 
                    margin: 10
                }}
            >
                <AssociatedMenuItems />
            </div>

            <div
                style={{
                    borderRight: "2px solid #000",
                    display: "flex",
                    flexDirection: "column",
                    width: "15%",
                    position: 'relative'
                }}
            >
                {generateButtons("Burgers")}
                {generateButtons("Baskets")}
                {generateButtons("Sandwiches")}
                {generateButtons("Drinks")}
                {generateButtons("Desserts")}
                {generateButtons("Sides")}
                {generateButtons("Sauces")}
                {generateButtons("All")}

                {Accessibility()}
            </div>
        </div>
    );
};

export { CashierView };
