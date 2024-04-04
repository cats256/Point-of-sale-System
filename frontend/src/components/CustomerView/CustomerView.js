import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const { basket, 
            addItemToBasket, 
            increaseItemQuantity, 
            decreaseItemQuantity, 
            removeItemFromBasket, 
            emptyBasket, 
            placeOrder, 
            totalCost,
            setShowItemInfoPopup, 
            showItemInfoPopup
        } = useBasket();
    const [popupContent, setPopupContent] = useState("");

    const buttonWithImg = (text, panel = '', img = '', alt = '') => (
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
                        onClick={() => addItemToBasket(item)}
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
            setShowItemInfoPopup(true);
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
                            >
                                <img src={require('../../img/temp_burger.jpeg')} alt={itemName} style={{ marginRight: 8, width:180, height:100 }} />
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
                {showItemInfoPopup && (
                    <Popup
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </div>
        );
    };

    const displayBasket = () => {
        return (
            <div>
                <h1>My Basket</h1>
                
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

                <div style={{ position: 'fixed', display: 'flex', gap: 20, bottom: 10, marginTop: "20px", fontWeight: "bold" }}>
                    Total: ${totalCost.toFixed(2)}
                    <button onClick={() => placeOrder()} disabled={basket.length === 0}>Place Order</button>
                </div>
            </div>
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
            <div
                style={{
                    borderRight: "2px solid #000",
                    display: "flex",
                    flexDirection: "column",
                    width: "15%"
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
                    margin: 10
                }}
            >
                {AssociatedMenuItems()}
            </div>

            <div style={{ 
                    margin: 10,
                    width: "25%"
                }}>
                {displayBasket()}
            </div>
        </div>
    );
};

export { CustomerView };
