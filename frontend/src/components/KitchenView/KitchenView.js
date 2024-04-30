import React, { useState, useEffect } from "react";
import { cancelOrder, completeOrder, getCurrent } from "../../network/api";
import "./KitchenView.css";
import NavBar from "../common/navBar";
import CloseIcon from "@mui/icons-material/Close";

const KitchenView = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderPopUpOpen, setIsOrderPopUpOpen] = useState(false);

  // Define fetchOrders function
  const fetchOrders = async () => {
    try {
      const orders = await getCurrent();
      setCurrentOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    // Fetch current orders on component mount
    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
    setIsOrderPopUpOpen(true); // Open the order popup
  };

  const handleClosePopUp = () => {
    setIsOrderPopUpOpen(false); // Close the order popup
  };

  // Define OrderPopUp component here to access handleCompleteOrder and handleCancelOrder
  const OrderPopUp = ({ orderNumber, onClose, onComplete, onCancel }) => {
    return (
        <section className="order-popup">
        <div className="order-popup-content">
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
          <h3 className="popup-title">Order {orderNumber}</h3>
          <div className="button-container">
            <button className="complete-button" onClick={onComplete}>
              Mark order complete
            </button>
            <button className="cancel-button" onClick={onCancel}>
              Cancel order
            </button>
          </div>
        </div>
      </section>
    );
  };

  const handleCompleteOrder = async () => {
    try {
      const formData = { id: selectedOrder };
      const response = await completeOrder(formData);
      alert(response.message);
      // Refresh orders after completion
      fetchOrders();
    } catch (error) {
      console.error("Error completing order:", error);
    }
    setSelectedOrder(null);
    setIsOrderPopUpOpen(false); // Close the order popup
  };

  const handleCancelOrder = async () => {
    try {
      const formData = { id: selectedOrder };
      const response = await cancelOrder(formData);
      alert(response.message);
      // Refresh orders after cancellation
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
    setSelectedOrder(null);
    setIsOrderPopUpOpen(false); // Close the order popup
  };

  return (
    <div>
      <NavBar />
      <div className="orders-container">
        <h2>Current Orders</h2>
        <div className="order-list">
          {currentOrders.map((order) => (
            <div key={order.id}>
              <button
                className="order-button"
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
        />
      )}
    </div>
  );
};

export default KitchenView;
