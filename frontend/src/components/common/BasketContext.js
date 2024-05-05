import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { createContext, useContext, useState } from "react";
import {
    attachMenuItem,
    getItemId,
    getOrderId,
    submitOrder,
} from "../../network/api";
import { formatItemName } from "../../utils/formatItemName";

/**
 * Context for managing the shopping basket state and related actions.
 */
export const BasketContext = createContext();

/**
 * Provider component for the BasketContext.
 * Manages the shopping basket state and provides functions for modifying it.
 *
 * @param {React.ReactNode} children - The child components wrapped by the provider.
 * @returns {JSX.Element} BasketProvider component JSX.
 */
export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState([]);
    const [showItemInfoPopup, setShowItemInfoPopup] = useState(false);
    const [isCombo, setIsCombo] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    /**
     * Dialog component for confirming item removal.
     *
     * @returns {JSX.Element} RemoveItemConfirmationDialog component JSX.
     */
    const RemoveItemConfirmationDialog = () => (
        <Dialog open={!!itemToRemove} onClose={() => setItemToRemove(null)}>
            <DialogTitle>
                Remove{" "}
                {itemToRemove === null ? "" : formatItemName(itemToRemove)}?
            </DialogTitle>
            <DialogActions style={{ justifyContent: "space-between" }}>
                <Button
                    onClick={() => {
                        setItemToRemove(null);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setBasket((currentBasket) => {
                            const itemIndex = currentBasket.findIndex(
                                (item) => item.name === itemToRemove.name
                            );

                            if (itemIndex === -1) return currentBasket;
                            setItemToRemove(null);
                            return currentBasket.filter(
                                (_, index) => index !== itemIndex
                            );
                        });
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );

    /**
     * Toggles the combo flag state.
     */
    const handleMakeCombo = () => {
        console.log(isCombo);
        setIsCombo(!isCombo);
        console.log(isCombo);
    };

    /**
     * Adds an item to the basket, possibly as part of a combo.
     *
     * @param {Object} item - The item to add to the basket.
     */
    const addItemToBasketWithCombo = (item) => {
        if (!isCombo) {
            // to not add duplicates
            addItemToBasket(item);
        }

        if (isCombo) {
            // Define the combo details
            const comboDetails = {
                Burgers: { name: "Combo with Fries", price: 1.69 },
                Baskets: { name: "Combo with Fries", price: 1.1 },
                // Add other types as needed
            };

            const combo = comboDetails[item.type];
            if (combo) {
                const comboItem = {
                    name: item.name + " " + combo.name, // This will be used for display
                    price: combo.price,
                    isComboItem: true, // A flag to indicate this is a combo addition
                    parentId: item.id, // Assuming each item has a unique ID
                };
                // Add the combo as a separate item in the basket
                addItemToBasket(comboItem);
            }

            setIsCombo(false); // Reset the combo flag
        }
    };

    /**
     * Adds an item to the basket.
     *
     * @param {Object} itemToAdd - The item to add to the basket.
     */
    const addItemToBasket = (itemToAdd) => {
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
            setShowItemInfoPopup(false);
        }, 700);
    };

    /**
     * Increases the quantity of a specific item in the basket.
     *
     * @param {string} itemName - The name of the item to increase quantity.
     */
    const increaseItemQuantity = (itemName) => {
        setBasket((currentBasket) =>
            currentBasket.map((item) =>
                item.name === itemName
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    /**
     * Decreases the quantity of a specific item in the basket.
     *
     * @param {string} itemName - The name of the item to decrease quantity.
     */
    const decreaseItemQuantity = (itemName) => {
        setBasket((currentBasket) => {
            const itemIndex = currentBasket.findIndex(
                (item) => item.name === itemName
            );
            if (itemIndex === -1) return currentBasket;

            const newItem = { ...currentBasket[itemIndex] };
            if (newItem.quantity > 1) {
                newItem.quantity -= 1;
                return [
                    ...currentBasket.slice(0, itemIndex),
                    newItem,
                    ...currentBasket.slice(itemIndex + 1),
                ];
            } else {
                setItemToRemove(newItem);
                return currentBasket;
            }
        });
    };

    /**
     * Removes an item from the basket.
     *
     * @param {string} itemName - The name of the item to remove from the basket.
     */
    const removeItemFromBasket = (itemName) => {
        setBasket((currentBasket) =>
            currentBasket.filter((item) => item.name !== itemName)
        );
    };

    /**
     * Empties the basket by removing all items.
     */
    const emptyBasket = () => {
        setBasket([]);
    };

    /**
     * Places an order by submitting the basket contents to the server.
     */
    const placeOrder = async () => {
        const orderData = {
            name: "kiosk",
            price: String(calculateTotalPrice(basket)),
            date: new Date().toISOString(),
            assigned_employee: "7", // 7 is kiosk employee
        };
        submitOrder(orderData);
        const orderIDResponse = await getOrderId();
        for (const item of basket) {
            try {
                const itemIDResponse = await getItemId(item.name);
                const menuItemData = {
                    order_id: orderIDResponse.order_id,
                    item_id: itemIDResponse.item_id,
                };
                try {
                    const response = await attachMenuItem(menuItemData);
                    // Handle the response here
                    console.log(response);
                    emptyBasket();
                } catch (error) {
                    console.error("Error attaching menu item:", error);
                }
                emptyBasket();
            } catch (error) {
                console.error("Error placing order:", error);
            }
        }
        const orderID = orderIDResponse.order_id;
        if (orderID) {
            alert("Success! Your order number is " + (parseInt(orderID) + 1));
            emptyBasket();
        } else {
            throw new Error("Failed to retrieve order ID");
        }
    };

    /**
     * Calculates the total cost of all items in the basket.
     *
     * @param {Array} basket - The array containing the basket items.
     * @returns {number} The total cost of all items in the basket.
     */
    const totalCost = basket.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
    }, 0);

    return (
        <BasketContext.Provider
            value={{
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
                setIsCombo,
                handleMakeCombo,
                addItemToBasketWithCombo,
                RemoveItemConfirmationDialog,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

/**
 * Calculates the total cost of all items in the basket.
 *
 * @param {Array} basket - The array containing the basket items.
 * @returns {number} The total cost of all items in the basket.
 */
const calculateTotalPrice = (basket) => {
    let totalPrice = 0;
    for (const item of basket) {
        totalPrice += item.price * item.quantity;
    }
    return totalPrice;
};

/**
 * Custom hook for accessing the basket context.
 *
 * @returns {Object} The basket context.
 */
export const useBasket = () => useContext(BasketContext);
