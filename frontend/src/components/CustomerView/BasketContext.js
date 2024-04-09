import { createContext, useState, useContext } from 'react';
import { submitOrder, getOrderId } from "../../network/api";

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState([]);
    const [showItemInfoPopup, setShowItemInfoPopup] = useState(false);

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
                const confirmRemoval = window.confirm(
                    "Do you want to remove this item from your basket?"
                );
                if (confirmRemoval) {
                    return currentBasket.filter(
                        (_, index) => index !== itemIndex
                    );
                }
                return currentBasket;
            }
        });
    };

    const removeItemFromBasket = (itemName) => {
        setBasket(currentBasket => currentBasket.filter(item => item.name !== itemName));
    }

    const emptyBasket = () => {
        setBasket([]);
    }

    const placeOrder = async () => {
        for (const item of basket) {
            const orderData = {
                name: item.name,
                price: String(item.price * item.quantity),
                date: new Date().toISOString(),
                assigned_employee: "7", // 7 is kiosk employee
            };
            try {
                const response = await submitOrder(orderData);
                emptyBasket();
            } catch (error) {
                console.error("Error placing order:", error);
            }
        }
        const orderIDResponse = await getOrderId();
                const orderID = orderIDResponse.order_id;
                if (orderID) {
                    alert("Success! Your order number is " + orderID);
                    emptyBasket();
                } else {
                    throw new Error("Failed to retrieve order ID");
                }
    };

    const totalCost = basket.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
    }, 0);

    return (
        <BasketContext.Provider value={{ basket, addItemToBasket, increaseItemQuantity, decreaseItemQuantity, removeItemFromBasket, emptyBasket, placeOrder, totalCost, setShowItemInfoPopup, showItemInfoPopup }}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => useContext(BasketContext);
