import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { createContext, useContext, useState } from "react";
import {
    attachMenuItem,
    getItemId,
    getOrderId,
    submitOrder,
} from "../../network/api";
import { formatItemName } from "../../utils/formatItemName";

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState([]);
    const [showItemInfoPopup, setShowItemInfoPopup] = useState(false);
    const [isCombo, setIsCombo] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    // makeshift code. not very clean but it works
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

    const handleMakeCombo = () => {
        console.log(isCombo)
        setIsCombo(!isCombo);
        console.log(isCombo)
    };

    const addItemToBasketWithCombo = (item) => {
        if (!isCombo) { // to not add duplicates
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

    const increaseItemQuantity = (itemName) => {
        setBasket((currentBasket) =>
            currentBasket.map((item) =>
                item.name === itemName
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

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

    const removeItemFromBasket = (itemName) => {
        setBasket((currentBasket) =>
            currentBasket.filter((item) => item.name !== itemName)
        );
    };

    const emptyBasket = () => {
        setBasket([]);
    };

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

const calculateTotalPrice = (basket) => {
    let totalPrice = 0;
    for (const item of basket) {
        totalPrice += item.price * item.quantity;
    }
    return totalPrice;
};

export const useBasket = () => useContext(BasketContext);
