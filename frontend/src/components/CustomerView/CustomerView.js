import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";
import { TextSizeControls } from "../CustomerView/TextEnlarger";
import { useGamification } from "../CustomerView/GamificationContext";
import { handleMakeCombo } from "../CashierView/CashierView";
// import { ReactComponent as reveille_logo } from '../../img/reveille_logo.svg';

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [combosAdded, setCombosAdded] = useState({});

    const {
        basket,
        addItemToBasket,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeItemFromBasket,
        emptyBasket,
        placeOrder,
        totalCost,
        setShowItemInfoPopup,
        showItemInfoPopup,
        addItemToBasketWithCombo,
    } = useBasket();
    const [popupContent, setPopupContent] = useState("");

    // Combo Dialog Handlers
    const handleComboDialog = (itemType) => {
        setCombosAdded(prev => ({
            ...prev,
            [itemType]: true
        }));
        
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Gamified Buttons
    const {isGamified } = useGamification();
    const buttonStyle = isGamified ? {
        animation: 'pulse 1s infinite ease-in-out',
        backgroundColor: 'hotpink',
        color: 'white'
    } : {
        backgroundColor: '#C2A061',
        color: 'white'
    };

    // Make It A Combo Button & Mouse Effects
    const comboButtonStyle = {
        backgroundColor: "#C2A061",
        color: "white",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "2px 5px",
        fontSize: "0.7rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.2s",
        margin: "5px",
        marginLeft: "15px",
        display: "flex",
    };

    /* const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = "#8B1D41";
        e.target.style.transform = "scale(1.05)";
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = "#C2A061";
        e.target.style.transform = "scale(1.0)";
    }; */

    const buttonWithImg = (text, panel = "", img = "", alt = "") => (
        <Button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            style={{
                ...buttonStyle,
                ...{
                    backgroundColor: currType === text ? "#C2A061" : buttonStyle.backgroundColor,
                    color: currType === text ? "white" : buttonStyle.color,
                    marginRight: 8,
                    borderRadius: 20,
                    margin: 4,
                }
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
                        gap: 10,
                        marginTop: 10,
                    }}
                >
                    <button onClick={onClose}>Close</button>
                    <button
                        onClick={() => addItemToBasketWithCombo(item)}
                        style={{ backgroundColor: "#C2A061", color: "white" }}
                    >
                        Add to Basket
                    </button>
                </div>
            </div>
        </div>
    );

    const PopulateMenuItems = () => {
        let filteredItems = menuItems.filter((item) => item.type === panel);

        const handleItemClick = (itemContent) => {
            setShowItemInfoPopup(true);
            setPopupContent(itemContent);
        };

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "60vw",
                    justifyContent: "center",
                }}
            >
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: "#F0F0F0",
                                borderRadius: "15px",
                                border: "2px solid #000",
                                padding: "10px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}
                        >
                            <button
                                style={{
                                    height: "2%",
                                    width: "100%",
                                    alignItems: "center",
                                    border: "none",
                                }}
                                variant="outlined"
                                onClick={() => handleItemClick(item)}
                            >
                                <img
                                    src={require("../../img/temp_burger.jpeg")}
                                    alt={itemName}
                                    style={{
                                        marginRight: 8,
                                        width: "180px",
                                        height: "100",
                                        borderRadius: "15px",
                                    }}
                                />
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        width: "180px",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "7px",
                                    }}
                                >
                                    {itemName}
                                </div>
                                ${item.price}
                            </button>
                        </div>
                    );
                })}
                {showItemInfoPopup && (
                    <Popup
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </div>
        );
    };

    const DisplayBasket = () => {
        return (
            <div>
                <h1>My Basket</h1>

                {/* Clear Cart button */}
                <button
                    style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        emptyBasket();
                    }}
                    disabled={basket.length === 0}
                >
                    Clear Basket
                </button>

                {basket.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "25px",
                        }}
                    >
                        <div style={{ flexGrow: 1 }}>
                            <span style={{ fontWeight: "bold" }}>
                                {formatItemName(item)}{" "}
                            </span>
                            ${parseFloat(item.price * item.quantity).toFixed(2)}
                            {/* Quantity modification buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginTop: 5,
                                }}
                            >
                                <button
                                    onClick={() =>
                                        decreaseItemQuantity(item.name)
                                    }
                                    aria-label="Decrease item"
                                >
                                    -
                                </button>
                                {item.quantity}
                                <button
                                    style={{ marginRight: "20px" }}
                                    onClick={() =>
                                        increaseItemQuantity(item.name)
                                    }
                                    aria-label="Increase item"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Delete button */}
                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: 5,
                            }}
                            aria-label="Delete"
                            onClick={() => {
                                removeItemFromBasket(item.name);
                            }}
                        >
                            <DeleteIcon style={{ fontSize: "1.25rem" }} />
                        </button>

                        {/* Combo button */}
                        {(item.type === 'Sandwiches' || item.type === 'Burgers') && (
                            <Button
                                style={comboButtonStyle}
                                disabled={!!combosAdded[item.type]}
                                // onMouseEnter={handleMouseEnter}
                                // onMouseLeave={handleMouseLeave}
                                onClick={() => handleComboDialog(item.type)}
                            >
                                Make It A Combo!
                            </Button>
                        )}
                    </div>
                ))}

                <div>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Combos</DialogTitle>
                            <DialogContent>
                                <Button onClick={() => handleMakeCombo("kettleChips", menuItems, addItemToBasket, setOpenDialog, setCombosAdded)}>
                                    Kettle Chips
                                </Button>
                                <Button onClick={() => handleMakeCombo("frenchFries", menuItems, addItemToBasket, setOpenDialog, setCombosAdded)}>
                                    French Fries
                                </Button>
                            </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div
                    style={{
                        position: "fixed",
                        display: "flex",
                        gap: 20,
                        bottom: 10,
                        marginTop: "20px",
                        fontWeight: "bold",
                    }}
                >
                    Total: ${totalCost.toFixed(2)}
                    <button
                        onClick={() => placeOrder()}
                        disabled={basket.length === 0}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        );
    };

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] =
            useState(false);
        const { isGamified, toggleGamification } = useGamification();

        return (
            <>
                <button
                    style={{
                        position: "absolute",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        justifyContent: "center",
                    }}
                    aria-label="accessibility options"
                    onClick={() =>
                        setShowAccessibilityPanel((prevState) => !prevState)
                    }
                >
                    <SettingsAccessibilityIcon />
                </button>
                {showAccessibilityPanel && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "50px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <button
                            onClick={() =>
                                setShowAccessibilityPanel(
                                    (prevState) => !prevState
                                )
                            }
                        >
                            <CloseIcon />
                        </button>
                        <div>
                            <span> Accessibility Options </span>
                            <TextSizeControls />
                            <button 
                                onClick={toggleGamification}
                                aria-label={isGamified ? "Disable gamified mode" : "Enable gamified mode"}
                            >
                                {isGamified ? 'Disable Gamified Mode' : 'Enable Gamified Mode'}
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const navBar = () => {
        return (
            <>
                <div
                    style={{
                        float: "left"
                    }}>
                    {Accessibility()}
                </div>
                <div
                    style={{
                        textAlign: "center",
                        alignContent: "center",
                    }}>
                    <text style={{ color: "#C2A061", fontWeight: "bold", fontSize: "2rem" }}>
                        Rev's American Grill
                    </text>
                    {/* <reveille_logo/> */}
                </div>
            </>
        )
    };

    return (
        <div>
            <div
                style={{
                    width: "100%",
                    backgroundColor: "#8B1D41",
                    textAlign: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    minHeight: "6vh",
                    display: "flex",
                    flexDirection: "row"
                }}>
                {navBar()}
            </div>

            <div
                style={{
                    display: "flex",
                    minHeight: "100vh",
                }}>   
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "15vw",
                        margin: 8
                    }}>
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
                        borderLeft: "2px solid #000",
                        borderRight: "2px solid #000",
                        flexGrow: 1, 
                        flexDirection: "column",
                        padding: 10,
                        width: "auto"
                    }}>
                    {PopulateMenuItems()}
                </div>
                <div
                    style={{
                        margin: 10,
                        width: "25vw",
                    }}>
                    {DisplayBasket()}
                </div>
            </div>
        </div>
    );
};

export { CustomerView };
