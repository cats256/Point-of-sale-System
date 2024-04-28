import {
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { handleMakeCombo } from "../CashierView/CashierView";
import { useBasket } from "../common/BasketContext";
import "./CustomerView.css";
import { navBar } from "../common/navBar";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [combosAdded, setCombosAdded] = useState({});
    const {
        basket,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeItemFromBasket,
        emptyBasket,
        placeOrder,
        totalCost,
        setShowItemInfoPopup,
        showItemInfoPopup,
        isCombo,
        handleMakeCombo,
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
  
    const typeButton = (text, panel = "") => (
        <button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            style={{
                    backgroundColor: currType === text ? "#C2A061" : "",
                    color: currType === text ? "white" : "",
                    marginRight: 8,
                    borderRadius: 20,
                    margin: 4,
            }}
            className={`typeBtn ${currType === text ? 'typeBtnActive' : ''}`}
            aria-pressed ={true}
        >
            {text}
        </button>
    );

    const MenuItemPopUp = ({ item, onClose }) => {
        let itemName = formatItemName(item)
        let imgSrc = require(`../../img/${item.name}.png`)

        return (
            <section
                aria-label="Item details popup"
                className="menuItemPopUp evenSpacing"
            >
                {/* Close button */}
                <button 
                        onClick={onClose} 
                        aria-pressed="true"
                        aria-label="Close"
                        className="closeBtn icon"
                    >
                        <CloseIcon />
                </button>

                {/* Image of the menu item */}
                <img
                    src={imgSrc}
                    alt={itemName}
                    className="fullWidthImage"
                />

                {/* Name of the menu item */}
                <div className="popUpItemNameTxt">
                    {itemName}
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
                        className="addToOrderBtn"
                        aria-pressed={true}
                    >
                        Add to Basket
                    </button>
                </footer>
            </section>
        );
    };

    const PopulateMenuItems = () => {
        let filteredItems = menuItems.filter((item) => item.type === panel);

        return (
            <section className="menuItemsContainer">
                {filteredItems.map((item, index) => {

                let itemName = formatItemName(item);
                let imgSrc = require(`../../img/${item.name}.png`);

                    return(
                        <button
                            key={index}
                            className="menuItemBtn"
                            onClick={() => {
                                setShowItemInfoPopup(true);
                                setPopupContent(item);
                            }}
                        >
                            <img
                                src={imgSrc}
                                alt={itemName}
                                className="menuItemImg"
                            />
                            <div className="menuItemNameTxt">
                                {formatItemName(item)}
                            </div>
                            <div className="menuItemPriceTxt">
                                ${item.price}
                            </div>
                        </button>
                    )})}
                {showItemInfoPopup && (
                    <MenuItemPopUp
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </section>
        );
    };

    const DisplayBasket = () => (
        <aside className="basket">
            <h1>My Basket</h1>

            {/* Clear Cart button */}
            <div className="flexBox">
                <button
                    className="basketClearBtn"
                    onClick={() => {
                        emptyBasket();
                    }}
                    disabled={basket.length === 0}
                >
                    Clear Basket
                </button>
            </div>

            {basket.map((item, index) => (
                <div
                    key={index}
                    className="basketItem"
                >
                    <div>
                        <span className="basketItemName">
                            {formatItemName(item)}{" "}
                        </span>
                        ${parseFloat(item.price * item.quantity).toFixed(2)}
                        
                        {/* Quantity modification buttons */}
                        <div className="basketItemQuantity">
                            <IconButton
                                onClick={() => decreaseItemQuantity(item.name)}
                                aria-label="Decrease item"
                                className="icon"
                            >
                            
                                {item.isComboItem ? (
                                    <span>Combo Item - No modifications allowed</span>
                                ) : (
                                    <>
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
                                    </>
                                )}
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
                                -
                            </IconButton>
                            {item.quantity}
                            <IconButton
                                onClick={() => increaseItemQuantity(item.name)}
                                aria-label="Increase item"
                                className="icon"
                            >
                                +
                            </IconButton>
                        </div>
                    </div>

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
  
                    {/* Delete button */}
                    <IconButton
                        aria-label="Delete"
                        onClick={() => removeItemFromBasket(item.name)}
                        className="icon"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] =
            useState(false);

        return (
            <>
            <footer className="basketFooter">
                Total: ${totalCost.toFixed(2)}
                <button
                    onClick={() => placeOrder()}
                    disabled={basket.length === 0}
                    className="basketPlaceOrderBtn"
                >
                    Place Order
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
            </footer>
        </aside>
    );

    return (
        <main>
            {navBar()}

            <div className="bodyPanel">   
                <aside className="typeMenu">
                    {typeButton("Burgers")}
                    {typeButton("Baskets")}
                    {typeButton("Sandwiches")}
                    {typeButton("Drinks")}
                    {typeButton("Desserts")}
                    {typeButton("Sides")}
                    {typeButton("Sauces")}
                </aside>

                <article className="centerPanel">
                    {PopulateMenuItems()}
                </article>

                <article className="basketPanel">
                    {DisplayBasket()}
                </article>
            </div>
        </main>
    );
};

export { CustomerView };
