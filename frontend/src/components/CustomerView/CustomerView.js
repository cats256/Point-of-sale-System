import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";
import "./CustomerView.css";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
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
        handleMakeCombo,
        addItemToBasketWithCombo,
    } = useBasket();
    const [popupContent, setPopupContent] = useState("");

    const categories = [
        "Burgers",
        "Baskets",
        "Sandwiches",
        "Drinks",
        "Desserts",
        "Sides",
        "Sauces",
        "All",
    ];

    const buttonWithImg = (text, panel = "", img = "", alt = "") => (
        <Button
            variant="outlined"
            onClick={() => {
                setPanel(panel || text);
                setCurrType(text);
            }}
            style={{
                backgroundColor: currType === text ? "#C2A061" : "",
                color: currType === text ? "white" : "",
                flexGrow: 1,
                borderRadius: 0,
                borderWidth: 0,
                color: "black",
                borderBottom: "2px solid black",
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

                {/* Combo button */}
                {["Burgers", "Baskets", "Sandwiches"].includes(item.type) && (
                    <button onClick={handleMakeCombo}>Make it a Combo</button>
                )}

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
            <>
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <Button
                            variant="outlined"
                            style={{
                                flexGrow: 1,
                                borderRadius: 0,
                                color: "black",
                            }}
                            onClick={() => handleItemClick(item)}
                            className="menu-item"
                        >
                            <img
                                src={require("../../img/temp_burger.jpeg")}
                                alt={itemName}
                            />
                            <div>{itemName}</div>
                            <div>${item.price}</div>
                        </Button>
                    );
                })}
                {showItemInfoPopup && (
                    <Popup
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </>
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
                    </div>
                ))}

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

    // const Accessibility = () => {
    //     const [showAccessibilityPanel, setShowAccessibilityPanel] =
    //         useState(false);
    //     return (
    //         <>
    //             <button
    //                 style={{
    //                     position: "absolute",
    //                     bottom: 10,
    //                     left: "50%",
    //                     transform: "translateX(-50%)",
    //                     justifyContent: "center",
    //                 }}
    //                 aria-label="accessibility options"
    //                 onClick={() =>
    //                     setShowAccessibilityPanel((prevState) => !prevState)
    //                 } // Adjusted to call the toggle function
    //             >
    //                 <SettingsAccessibilityIcon />
    //             </button>
    //             {showAccessibilityPanel && (
    //                 <div
    //                     style={{
    //                         position: "fixed",
    //                         bottom: "50px",
    //                         left: "50%",
    //                         transform: "translateX(-50%)",
    //                         background: "white",
    //                         padding: "20px",
    //                         borderRadius: "8px",
    //                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    //                     }}
    //                 >
    //                     <button
    //                         onClick={() =>
    //                             setShowAccessibilityPanel(
    //                                 (prevState) => !prevState
    //                             )
    //                         }
    //                     >
    //                         <CloseIcon />
    //                     </button>
    //                     <span> Accessibility Options </span>
    //                 </div>
    //             )}
    //         </>
    //     );
    // };

    return (
        <div className="customer-view">
            <div className="left-panel">
                {categories.map((category) => buttonWithImg(category))}
            </div>
            <div className="center-panel">
                {/* {Accessibility()} */}
                {PopulateMenuItems()}
            </div>
            <div className="right-panel">{DisplayBasket()}</div>
        </div>
    );
};

export { CustomerView };
