import { Button, List, ListItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { submitOrder } from "../../network/api";
import { tempBurger } from '../../img/temp_burger.jpeg'; 

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [basket, setBasket] = useState([]);
    const [showPopup, setShowPopup] = useState(Boolean);
    const [popupContent, setPopupContent] = useState("");

    const buttonWithImg = (text, panel = '', img = '', alt = '') => (
        <Button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setActiveButton(text);
            }}
            style={{
                backgroundColor: activeButton === text ? "#C2A061" : '',
                color: activeButton === text ? "white" : '',
                marginRight: 8,
            }}
        >
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );
    // TODO: Separate style out to separate css files
    const Popup = ({ item, onClose }) => (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    padding: "20px",
                    background: "white",
                    border: "1px solid black",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Image of the menu item */}
                <img
                    src={item.img}
                    alt={item.alt}
                    style={{ maxWidth: "100%", marginBottom: "10px" }}
                />

                {/* Name of the menu item */}
                <div style={{ marginBottom: "10px" }}>
                    {formatItemName(item)}
                </div>

                {/* Close and Add to Order buttons */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 10
                    }}
                >
                    <button onClick={onClose}>Close</button>
                    <button
                        onClick={() => handleAddToBasket(item)}
                        style={{ backgroundColor: "#C2A061", color: "white" }}
                    >
                        Add to Basket
                    </button>
                </div>
            </div>
        </div>
    );

    const AssociatedMenuItems = () => {
        let filteredItems = menuItems.filter((item) => item.type === panel);

        const handleItemClick = (itemContent) => {
            setShowPopup(true);
            setPopupContent(itemContent);
        };

        return (
            <div style = {{ display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: 'red'}}>
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <div key={index}>
                            <button
                                variant="outlined"
                                onClick={() => handleItemClick(item)}
                                style={{fontWeight: "bold"}}
                            >
                                <img src={require('../../img/temp_burger.jpeg')} alt={itemName} style={{ marginRight: 8, width:180, height:100 }} />
                                <div style = {{ fontFamily: "bold" }}>
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
                {showPopup && (
                    <Popup
                        item={popupContent}
                        onClose={() => setShowPopup(false)}
                    />
                )}
            </div>
        );
    };

    const AddToBasket = () => {
        const totalCost = basket.reduce((total, item) => {
            return total + parseFloat(item.price) * item.quantity;
        }, 0);

        return (
            <div>
                {basket.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "10px"}}>
                        <div style={{ flexGrow: 1 }}>
                            {formatItemName(item)}: $
                            {parseFloat(item.price * item.quantity).toFixed(2)}
                            {/* Quantity modification buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button 
                                    onClick={() => decreaseQuantity(item.name)}
                                    aria-label="Decrease item">
                                    -
                                </button>
                                {item.quantity}
                                <button 
                                    style={{ marginRight: '20px' }}
                                    onClick={() => increaseQuantity(item.name)}
                                    aria-label="Increase item">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Delete button */}
                        <button 
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                            aria-label="Delete"
                            onClick={() => {/* TODO:function to handle delete */}}>
                            <DeleteIcon style={{ fontSize: '1.25rem' }} /> 
                        </button>
                    </div>
                ))}
                <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Total: ${totalCost.toFixed(2)}
                </div>
            </div>
        );
    };

    const placeOrder = async () => {
        // // Assuming basket is an array of items where each item has name, price, and quantity
        // for (const item of basket) {
        //     console.log(item);
        //     const orderData = {
        //         name: item.name,
        //         price: String(item.price * item.quantity),
        //         date: new Date().toISOString(),  // Assuming the backend expects a string date
        //         assigned_employee: "1",  // Example value, adjust as needed
        //     };
        //     console.log(orderData);
        //     try {
        //         const response = await submitOrder(orderData);
        //         const responseData = await response.json();  // Assuming the response is JSON
        //         console.log(responseData.message);  // Logging the response message
        //     } catch (error) {
        //         console.error("Error placing order:", error);
        //     }
        // }
    };

    const handleAddToBasket = (itemToAdd) => {
        setBasket((currentBasket) => {
            const exists = currentBasket.find(
                (item) => item.name === itemToAdd.name
            );
            if (exists) {
                return currentBasket.map((item) =>
                    item.name === itemToAdd.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...currentBasket, { ...itemToAdd, quantity: 1 }];
            }
        });

        setTimeout(() => {
            setShowPopup(false);
        }, 700); 
    };

    const increaseQuantity = (itemName) => {
        setBasket((currentBasket) =>
            currentBasket.map((item) =>
                item.name === itemName
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    

    const decreaseQuantity = (itemName) => {
        setBasket((currentBasket) => {
            const itemIndex = currentBasket.findIndex(
                (item) => item.name === itemName
            );
            if (itemIndex === -1) return currentBasket; // Item not found, no changes

            const newItem = { ...currentBasket[itemIndex] };
            if (newItem.quantity > 1) {
                newItem.quantity -= 1;
                return [
                    ...currentBasket.slice(0, itemIndex),
                    newItem,
                    ...currentBasket.slice(itemIndex + 1),
                ];
            } else {
                // Only show the confirmation if the quantity is 1
                const confirmRemoval = window.confirm(
                    "Do you want to remove this item from your basket?"
                );
                if (confirmRemoval) {
                    return currentBasket.filter(
                        (_, index) => index !== itemIndex
                    );
                }
                return currentBasket; // No changes if user cancels
            }
        });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    borderRight: "2px solid #000",
                    display: "flex",
                    flexDirection: "column",
                    width: "300px"
                }}
            >
                {buttonWithImg("Burgers")}
                {buttonWithImg("Baskets")}
                {buttonWithImg("Sandwiches")}
                {buttonWithImg("Drinks")}
                {buttonWithImg("Desserts")}
                {buttonWithImg("Sides")}
                {buttonWithImg("Sauces")}
                {buttonWithImg("All")}
            </div>

            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "2px solid #000", 
                    flexGrow: 9, 
                    margin: 10 
                }}
            >
                {AssociatedMenuItems()}
            </div>

            <div style={{ 
                    margin: 10,
                    width: "300"
                }}>
                <h1>Your Order</h1>
                {AddToBasket()}
                <button onClick={() => placeOrder()} disabled={basket.length === 0}>Place Order</button>
            </div>
        </div>
    );
};

export { CustomerView };
