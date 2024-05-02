import React, { useState, useEffect } from "react";
import {
    cancelOrder,
    completeOrder,
    getCurrent,
    deleteOrder,
} from "../../network/api";
import "./KitchenView.css";
import NavBar from "../common/navBar";
import CloseIcon from "@mui/icons-material/Close";
/**
 * Represents the kitchen view component.
 * @module KitchenView
 */

const KitchenView = () => {
    /**
     * State to store the current orders.
     * @type {[Array, function]}
     */

    const [currentOrders, setCurrentOrders] = useState([]);
    /**
     * State to store the selected order.
     * @type {[number|null, function]}
     */

    const [selectedOrder, setSelectedOrder] = useState(null);
    /**
     * State to manage the visibility of the order popup.
     * @type {[boolean, function]}
     */

    const [isOrderPopUpOpen, setIsOrderPopUpOpen] = useState(false);
    /**
     * Fetches the current orders from the server.
     * @function fetchOrders
     */

    const fetchOrders = async () => {
        try {
            const orders = await getCurrent();
            setCurrentOrders(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Handles the click event on an order item.
     * @function handleOrderClick
     * @param {number} orderId - The ID of the clicked order.
     */

    const handleOrderClick = (orderId) => {
        setSelectedOrder(orderId);
        setIsOrderPopUpOpen(true);
    };

    /**
     * Handles the close event of the order popup.
     * @function handleClosePopUp
     */

    const handleClosePopUp = () => {
        setIsOrderPopUpOpen(false);
    };

    /**
     * Represents the order popup component.
     * @function OrderPopUp
     * @param {Object} props - The props object.
     * @param {number} props.orderNumber - The order number.
     * @param {Function} props.onClose - The function to close the popup.
     * @param {Function} props.onComplete - The function to mark the order as complete.
     * @param {Function} props.onCancel - The function to cancel the order.
     * @param {Function} props.onDelete - The function to delete the order.
     * @returns {JSX.Element} The order popup component.
     */

    const OrderPopUp = ({
        orderNumber,
        onClose,
        onComplete,
        onCancel,
        onDelete,
    }) => {
        return (
            <section className="order-popup">
                <div className="order-popup-content">
                    <button className="close-button" onClick={onClose}>
                        <CloseIcon />
                    </button>
                    <h3 className="popup-title">Order {orderNumber}</h3>
                    <div className="button-container">
                        <button
                            className="complete-button"
                            onClick={onComplete}
                        >
                            Mark order complete
                        </button>
                        <button className="cancel-button" onClick={onCancel}>
                            Cancel order
                        </button>
                        <button className="delete-button" onClick={onDelete}>
                            Delete order
                        </button>
                    </div>
                </div>
            </section>
        );
    };

    /**
     * Handles marking an order as complete.
     * @function handleCompleteOrder
     */

    const handleCompleteOrder = async () => {
        try {
            const formData = { id: selectedOrder };
            const response = await completeOrder(formData);
            alert(response.message);
            // Refresh orders after completion
            await fetchOrders();
        } catch (error) {
            console.error("Error completing order:", error);
        }
        setSelectedOrder(null);
        setIsOrderPopUpOpen(false); // Close the order popup
    };

    /**
     * Handles canceling an order.
     * @function handleCancelOrder
     */

    const handleCancelOrder = async () => {
        try {
            const formData = { id: selectedOrder };
            const response = await cancelOrder(formData);
            alert(response.message);
            // Refresh orders after cancellation
            await fetchOrders();
        } catch (error) {
            console.error("Error canceling order:", error);
        }
        setSelectedOrder(null);
        setIsOrderPopUpOpen(false); // Close the order popup
    };

    /**
     * Handles deleting an order.
     * @function handleDeleteOrder
     */

    const handleDeleteOrder = async () => {
        try {
            const formData = { id: selectedOrder };
            const response = await deleteOrder(formData);
            alert(response.message);
            await fetchOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
        setSelectedOrder(null);
        setIsOrderPopUpOpen(false);
    };

    return (
        <div>
            <NavBar />
            <div className="orders-container">
                <div className="header-container">
                    <h1>Current Orders</h1>
                </div>
                <div className="order-list">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="order-item">
                            <button
                                className="button-primary" // Apply button-secondary class here
                                onClick={() => handleOrderClick(order.id)}
                            >
                                Order {order.id}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {isOrderPopUpOpen && (
                <OrderPopUp
                    orderNumber={selectedOrder}
                    onClose={handleClosePopUp}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                />
            )}
        </div>
    );
};

export default KitchenView;
