import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../common/BasketContext";
import "./CustomerView.css";
import NavBar from "../common/navBar";
import { translate } from "../../network/api";
import { useLanguage } from "../common/languageContext";
import Button from "@mui/material/Button";

const CustomerView = ({ menuItems }) => {
    const itemTypes = [
        "Burgers",
        "Baskets",
        "Sandwiches",
        "Drinks",
        "Desserts",
        "Sides",
        "Sauces",
    ];
    const [translatedItemTypes, setTranslatedItemTypes] = useState(itemTypes);
    const [myOrderText, setMyOrderText] = useState("My Order");
    const [clearOrderText, setClearOrderText] = useState("Clear Order");
    const [placeOrderText, setPlaceOrderText] = useState("Place Order");

    const { languages, setLanguages, currLanguage, setCurrLanguage } =
        useLanguage();

    useEffect(() => {
        const translateItemTypes = async () => {
            if (!itemTypes || !currLanguage) {
                return;
            }

            const translatedItemTypes = await Promise.all(
                itemTypes.map(async (type) => {
                    if (currLanguage === "English (American)") {
                        return type;
                    }
                    const translatedType = await translate(
                        type,
                        languages[currLanguage]
                    );
                    return translatedType;
                })
            );

            setTranslatedItemTypes(translatedItemTypes);
        };

        translateItemTypes();

        if (currLanguage === "English (American)") {
            setMyOrderText("My Order");
        } else {
            translate("My Order", languages[currLanguage]).then((data) =>
                setMyOrderText(data)
            );
        }

        if (currLanguage === "English (American)") {
            setClearOrderText("Clear Order");
        } else {
            translate("Clear Order", languages[currLanguage]).then((data) =>
                setClearOrderText(data)
            );
        }

        if (currLanguage === "English (American)") {
            setPlaceOrderText("Place Order");
        } else {
            translate("Place Order", languages[currLanguage]).then((data) =>
                setPlaceOrderText(data)
            );
        }
    }, [currLanguage, languages]);

    console.log(translatedItemTypes);

    const [panel, setPanel] = useState("Burgers");
    const [currType, setCurrType] = useState("Burgers");
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

    const typeButton = (text, translatedText = "", panel = "") => (
        <button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            className={`typeBtn ${currType === text ? "typeBtnActive" : ""}`}
            aria-pressed={true}
        >
            {translatedText || text}
        </button>
    );

    const MenuItemPopUp = ({ item, onClose }) => {
        let itemName = formatItemName(item);
        const imageExists = () => {
            try {
                return Boolean(require(`../../img/${item.name}.png`));
            } catch (error) {
                return false;
            }
        };

        let imgSrc = imageExists()
            ? require(`../../img/${item.name}.png`)
            : require(`../../img/new.png`);

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
                <img src={imgSrc} alt={itemName} className="fullWidthImage" />

                {/* Name of the menu item */}
                <div className="popUpItemNameTxt">{itemName}</div>

                {/* Combo and Add to Order buttons */}
                <footer>
                    {["Burgers", "Baskets", "Sandwiches"].includes(
                        item.type
                    ) && (
                        <button
                            onClick={handleMakeCombo}
                            className={isCombo ? "comboBtnActive" : "comboBtn"}
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
        if (!menuItems || !panel) {
            return <div>Loading...</div>;
        }

        let filteredItems = menuItems[panel];

        return (
            <section className="menuItemsContainer">
                {filteredItems.map((item, index) => {
                    let itemName =
                        item.translatedName.toUpperCase() ||
                        formatItemName(item);
                    const imageExists = () => {
                        try {
                            return Boolean(
                                require(`../../img/${item.name}.png`)
                            );
                        } catch (error) {
                            return false;
                        }
                    };

                    let imgSrc = imageExists()
                        ? require(`../../img/${item.name}.png`)
                        : require(`../../img/new.png`);

                    return (
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
                            <div className="menuItemNameTxt">{itemName}</div>
                            <div className="menuItemPriceTxt">
                                ${item.price}
                            </div>
                        </button>
                    );
                })}
                {showItemInfoPopup && (
                    <MenuItemPopUp
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </section>
        );
    };

    console.log(basket);
    const DisplayBasket = () => (
        <aside className="basket">
            <h1>{myOrderText}</h1>

            {/* Clear Cart button */}
            <div className="flexBox">
                <button
                    className="basketClearBtn"
                    onClick={() => {
                        emptyBasket();
                    }}
                    disabled={basket.length === 0}
                >
                    {clearOrderText}
                </button>
            </div>

            {basket.map((item, index) => (
                <div key={index} className="basketItem">
                    <div>
                        <span className="basketItemName">
                            {`${item.translatedName.toUpperCase()} ` ||
                                `${formatItemName(item)} `}
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
                    {placeOrderText}
                </button>
            </footer>
        </aside>
    );

    return (
        <main>
            <NavBar
                increaseZoom={increaseZoom}
                decreaseZoom={decreaseZoom}
                zoom={zoom}
            />

            <div
                className="bodyPanel"
                style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "center center",
                }}
            >
                <aside className="typeMenu">
                    {itemTypes.map((type, index) =>
                        typeButton(type, translatedItemTypes[index])
                    )}
                </aside>

                <article className="centerPanel">{PopulateMenuItems()}</article>

                <article className="basketPanel">{DisplayBasket()}</article>
            </div>
        </main>
    );
};

export { CustomerView };
