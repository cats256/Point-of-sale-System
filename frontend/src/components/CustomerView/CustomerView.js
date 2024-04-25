import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../common/BasketContext";
import "./CustomerView.css";
import { ReactComponent as ReveilleLogo } from "../../img/reveille_logo.svg";
import { useFontSize } from "../../utils/FontSizeProvider";
import classNames from 'classnames';

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const { toggleFontSize, toggleIconScale, fontSizeMultiplier } = useFontSize();
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

    const MenuItemPopUp = ({ item, onClose }) => (
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
                src={require("../../img/temp_burger.jpeg")}
                alt={item.name}
                className="fullWidthImage"
            />

            {/* Name of the menu item */}
            <div>
                {formatItemName(item)}
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

    const PopulateMenuItems = () => {
        let filteredItems = menuItems.filter((item) => item.type === panel);

        return (
            <section className="menuItemsContainer">
                {filteredItems.map((item, index) => (
                    <button
                        key={index}
                        className="menuItemBtn"
                        onClick={() => {
                            setShowItemInfoPopup(true);
                            setPopupContent(item);
                        }}
                    >
                        <img
                            src={require("../../img/temp_burger.jpeg")}
                            alt={formatItemName(item)}
                            className="menuItemImg"
                        />
                        <div className="menuItemNameTxt">
                            {formatItemName(item)}
                        </div>
                        <div className="menuItemPriceTxt">
                            ${item.price}
                        </div>
                    </button>
                    
                ))}
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

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
        const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
        const [longPressBtnEnabled, setLongPressBtnEnabled] = useState(false);
        const [highContrastEnabled, setHighContrastEnabled] = useState(false);
        
        return (
            <>
                <button
                    aria-label="accessibility options"
                    onClick={() =>
                        setShowAccessibilityPanel(!showAccessibilityPanel)
                    }
                    className="accessibilityBtn"
                >
                    <SettingsAccessibilityIcon style={{fill: "white"}}/>
                </button>
                {showAccessibilityPanel && (
                    <div className="accessibilityContainer">
                        <button
                            onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                            className="closeBtn"
                        >
                            <CloseIcon />
                        </button>

                        <span className="accessibilityTitle">
                            Accessibility Options
                        </span>

                        <div className="accessibilityOptions">
                            <button
                                className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': screenReaderEnabled })}
                                onClick={() =>setScreenReaderEnabled(!screenReaderEnabled)}
                                variant="contained"
                            >
                                {screenReaderEnabled ? 'Disable Screen Reader' : 'Enable Screen Reader'}
                            </button>

                            <button
                                className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': fontSizeMultiplier != 1 })}
                                onClick={ () => (
                                    toggleFontSize(),
                                    toggleIconScale()
                                )}
                                variant="contained"
                            >
                                {fontSizeMultiplier != 1 ? 'Disable Large Text' : 'Enable Large Text'}
                            </button>

                            <button
                                className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': longPressBtnEnabled })}
                                onClick={() =>setLongPressBtnEnabled(!longPressBtnEnabled)}
                                variant="contained"
                            >
                                {longPressBtnEnabled ? 'Disable Long Press Buttons' : 'Enable Long Press Buttons'}
                            </button>

                            <button
                                className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': highContrastEnabled })}
                                onClick={() =>setHighContrastEnabled(!highContrastEnabled)}
                                variant="contained"
                            >
                                {highContrastEnabled ? 'Disable High Contrast' : 'Enable High Contrast'}
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const navBar = () => {
        return (
            <nav className="navBar">
                <div className="navSide">
                    <Accessibility />
                </div>
                
                <header className="navHeader">
                    <ReveilleLogo className="reveilleLogo" />
                    <h1 className="navTitle">
                        Rev's American Grill
                    </h1>
                </header>
                <div className="navSide">
                    {/* TODO: add content */}
                </div>
            </nav>
        )
    };

    return (
        <main>
            {navBar()}

            <div className="bodyPanel"
                style={{ fontSize: `${fontSizeMultiplier}rem` }}
            >   
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
