import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { formatItemName } from "../../utils/formatItemName";
import { useBasket } from "../CustomerView/BasketContext";
// import { ReactComponent as reveille_logo } from '../../img/reveille_logo.svg';

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
        isCombo,
        handleMakeCombo,
        addItemToBasketWithCombo,
    } = useBasket();
    const [popupContent, setPopupContent] = useState("");

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
                marginRight: 8,
                borderRadius: 20,
                margin: 4,
            }}
            aria-pressed ={true}
        >
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );

    const Popup = ({ item, onClose }) => (
        <section
            aria-label="Item details popup"
            style={{
                position: "fixed",
                width: "20%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                background: "white",
                border: "1px solid black",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "auto"
            }}
        >
             <button 
                    onClick={onClose} 
                    aria-pressed={true}
                    aria-label="Close"
                    style={{scale: ".9", backgroundColor: "darkred", color: "white"}}
                >
                    <CloseIcon />
                </button>
            {/* Image of the menu item */}
            <img
                src={require("../../img/temp_burger.jpeg")}
                alt={item.name}
                style={{ maxWidth: "100%", marginBottom: "10px" }}
            />

            {/* Name of the menu item */}
            <div style={{ marginBottom: "10px" }}>
                {formatItemName(item)}
            </div>


            {/* Close and Add to Order buttons */}
            <footer
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: 10,
                }}
                >
                {/* Combo button */}
                {["Burgers", "Baskets", "Sandwiches"].includes(item.type) && (
                    <button 
                        onClick={handleMakeCombo}
                        style={{
                            backgroundColor: isCombo ? "blue" : "white",
                            color: isCombo ? "white" : ""
                        }}
                        aria-pressed={isCombo}
                    >
                        {isCombo ? "Combo Selected" : "Make it a Combo"}
                    </button>
                )}

                <button
                    onClick={() => addItemToBasketWithCombo(item)}
                    style={{ backgroundColor: "#C2A061", color: "white" }}
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
            <section
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "60vw",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {filteredItems.map((item, index) => {

                let itemName = formatItemName(item);
                // Adjust this line to concatenate the string and the variable
                let imgSrc = require(`../../img/${item.name}.png`);

                    return(
                    <article
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "column",
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
                                border: "none",
                            }}
                            onClick={() => {
                                setShowItemInfoPopup(true);
                                setPopupContent(item);
                            }}
                        >
                            <img
                                src={imgSrc}
                                alt={itemName}
                                style={{
                                    marginRight: 8,
                                    width: "180px",
                                    height: "150px",
                                    borderRadius: "15px",
                                    objectFit: "cover",
                                    margin: "2px"
                                }}
                            />
                            <div
                                style={{
                                    fontWeight: "bold",
                                    width: "25vh",
                                    padding: "7px",
                                }}
                            >
                                {formatItemName(item)}
                            </div>
                            <div>
                                ${item.price}
                            </div>
                        </button>
                    </article>
                    
                )})}
                {showItemInfoPopup && (
                    <Popup
                        item={popupContent}
                        onClose={() => setShowItemInfoPopup(false)}
                    />
                )}
            </section>
        );
    };

    const DisplayBasket = () => (
        <aside>
            <h1>My Basket</h1>

            {/* Clear Cart button */}
            <button
                style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
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
                    <div>
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
                        aria-label="Delete"
                        onClick={() => {
                            removeItemFromBasket(item.name);
                        }}
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ))}

            <footer
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
            </footer>
        </aside>
    );

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
        return (
            <>
                <button
                    aria-label="accessibility options"
                    onClick={() =>
                        setShowAccessibilityPanel(!showAccessibilityPanel)
                    }
                >
                    <SettingsAccessibilityIcon />
                </button>
                {showAccessibilityPanel && (
                    <div
                        style={{
                            position: "fixed",
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <button
                            onClick={() => setShowAccessibilityPanel(showAccessibilityPanel)}
                            style={{scale: ".9", backgroundColor: "darkred", color: "white"}}
                        >
                            <CloseIcon />
                        </button>
                        <span
                            style={{padding: "10px"}}
                        >
                            Accessibility Options
                        </span>
                    </div>
                )}
            </>
        );
    };

    const navBar = () => {
        return (
            <nav
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
                <div
                    style={{
                        position: "left"
                    }}>
                    {Accessibility()}
                </div>
                
                <header
                    style={{
                        textAlign: "center",
                        alignContent: "center",
                    }}>
                    <h1 style={{ color: "#C2A061", fontWeight: "bold", fontSize: "2rem" }}>
                        Rev's American Grill
                    </h1>
                    <reveille_logo/>
                </header>
            </nav>
        )
    };

    return (
        <main>
            {navBar()}

            <body
                style={{
                    display: "flex",
                    minHeight: "100vh",
                }}>   
                <aside
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
                </aside>

                <article
                    style={{
                        borderLeft: "2px solid #000",
                        borderRight: "2px solid #000",
                        flexGrow: 1, 
                        flexDirection: "column",
                        padding: 10,
                        width: "auto"
                    }}>
                    {PopulateMenuItems()}
                </article>
                <article
                    style={{
                        margin: 10,
                        width: "25vw",
                    }}>
                    {DisplayBasket()}
                </article>
            </body>
        </main>
    );
};

export { CustomerView };
