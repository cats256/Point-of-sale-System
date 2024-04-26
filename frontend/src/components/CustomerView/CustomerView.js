import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../common/BasketContext";
import "./CustomerView.css";
import NavBar from "../common/navBar";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const [zoom, setZoom] = useState(100);
    
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

    const increaseZoom = () => {
        setZoom(zoom + 25);
    };

    const decreaseZoom = () => {
        if (zoom > 100) {
            setZoom(zoom - 25);
        }
    };

    const typeButton = (text, panel = "") => (
        <button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
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

                {/* Combo and Add to Order buttons */}
                <footer>
                    {["Burgers", "Baskets", "Sandwiches"].includes(item.type) && (
                        <button 
                            onClick={handleMakeCombo}
                            className={isCombo ? 'comboBtnActive' : 'comboBtn'}
                            aria-pressed={isCombo}
                        >
                            {isCombo ? "Combo Selected" : "Make it a Combo"}
                        </button>
                    )}

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

            <footer className="basketFooter">
                Total: ${totalCost.toFixed(2)}
                <button
                    onClick={() => placeOrder()}
                    disabled={basket.length === 0}
                    className="basketPlaceOrderBtn"
                >
                    Place Order
                </button>
            </footer>
        </aside>
    );

    return (
        <main>
            <NavBar increaseZoom={increaseZoom} decreaseZoom={decreaseZoom} zoom={zoom} />

            <div className="bodyPanel" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>   
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
