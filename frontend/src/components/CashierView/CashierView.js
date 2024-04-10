import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";

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
        // menu item category buttons
        <Button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            style={{
                borderColor: 'black',
                padding: "10px",
                backgroundColor: currType === text ? "#C2A061" : '#ecebed',
                color: currType === text ? "white" : 'black',
                marginRight: 8,
                width: "175px",
                height: "50px",
            }}
        >
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );

    const AssociatedMenuItems = () => {
        // sorting the beef & bean burgers to group by type
        const customSort = (a, b) => {
            if (a.name.includes("beef") && !b.name.includes("beef")) return -1;
            if (!a.name.includes("beef") && b.name.includes("beef")) return 1;
            if (a.name.includes("bean") && !b.name.includes("bean")) return 1;
            if (!a.name.includes("bean") && b.name.includes("bean")) return -1;
            return 0;
        };

        let filteredItems = menuItems.filter((item) => item.type === panel);
        filteredItems.sort(customSort);

        const handleItemClick = (item) => {
            addItemToBasket(item);
        };

        return (
            <div style = {{ display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: 'white'}}>
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <div key={index}>
                            {/* menu item buttons */}
                            <button
                                variant="outlined"
                                onClick={() => handleItemClick(item)}
                                style={{
                                    width: "135px",
                                    height: "135px",
                                    margin: "8px",
                                    fontSize: "16px",
                                    borderRadius: 5,
                                    backgroundColor: itemName.startsWith("Beef") ? "#efdcfc" : 
                                        itemName.startsWith("Bean") ? "#fffdd4" :
                                        itemName.includes("Tender") ? "#fff2c9" :
                                        itemName.includes("Steak Finger") ? "#efdcfc" : 
                                        itemName.includes("Sandwich") ? "#e8fce8" : 
                                        itemName.includes("Grilled Cheese") ? "#fff5e3" :
                                        itemName.includes("Coffee") ? "#d4c0b8" :
                                        itemName.includes("Fountain Drink") ? "#e3f8ff" :
                                        itemName.includes("Scoop") ? "#fffef0" :
                                        itemName.includes("Cookie") ? "#d4c0b8" :
                                        itemName.includes("Brownie") ? "#d4c0b8" :
                                        itemName.includes("Shake") ? "#ffdef3" :
                                        itemName.includes("Fries") ? "#fff2c9" :
                                        itemName.includes("Tots") ? "#fff2c9" :
                                        itemName.includes("Rings") ? "#fff2c9" :
                                        itemName.includes("Chips") ? "#fff2c9" :
                                        itemName.includes("Sauce") ? "#deb0a9" :
                                        itemName.includes("Mustard") ? "#fff2c9" :
                                        itemName.includes("Ranch") ? "#e8ffff" :
                                        "inherit",
                                }}
                            >
                                <div style = {{ paddingBottom: "15px" }}>
                                    {itemName} 
                                </div>
                                ${item.price}
                            </button>
                        </div>
                    );
                })}
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
                    borderRight: "2px solid black",
                    flexGrow: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "2px solid #000",
                    padding: "10px",
                    paddingTop: "25px",
                    paddingLeft: "9px",
                    margin: 10
                }}
            >
            
            <div 
                style={{ 
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                }}     
            >
                <Button variant="outlined" style={{ backgroundColor: "#ecebed", color: "black", borderColor: "black", marginTop: 'auto', marginRight: "10px", padding: "10px" }}>Item Availability</Button>
                <Button variant="outlined" style={{ backgroundColor: "#ecebed", color: 'black', borderColor: 'black', marginRight: "10px" }}>Copy Item</Button> 
                <Button variant="outlined" style={{ backgroundColor: "#ecebed", color: 'black', borderColor: 'black', marginRight: "10px" }}>Make a Combo</Button>
            </div>
            
                <AssociatedMenuItems />
            </div>

            <div
                style={{
                    borderRight: "2px solid #000",
                    display: "flex",
                    flexDirection: "column",
                    width: "15%",
                    position: 'relative',
                    marginTop: "10px",
                }}
            >
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Burgers")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Baskets")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Sandwiches")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Drinks")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Desserts")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Sides")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {generateButtons("Sauces")}
                </div>

                {Accessibility()}
            </div>
        </div>
    );
};

export { CashierView };
