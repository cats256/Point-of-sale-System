import React, { useState, useEffect } from "react";
import { cancelOrder, completeOrder, getCurrent, deleteOrder, itemsList, getItemNameList } from "../../network/api";
import "./KitchenView.css";
import NavBar from "../common/navBar";
import CloseIcon from "@mui/icons-material/Close";

const KitchenView = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderPopUpOpen, setIsOrderPopUpOpen] = useState(false);

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

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
    setIsOrderPopUpOpen(true);
  };

  const handleClosePopUp = () => {
    setIsOrderPopUpOpen(false); 
  };

  const OrderPopUp = ({ orderNumber, onClose, onComplete, onCancel, onDelete }) => {
    const [itemNames, setItemNames] = useState([]);
  
    useEffect(() => {
      const fetchItemNames = async () => {
        try {
          const nestedItemIds = await itemsList(orderNumber-1);
          const itemIds = nestedItemIds.flat();
          const names = await Promise.all(itemIds.map(async (itemId) => {
              const response = await getItemNameList(itemId);
              return response;
        }));
          setItemNames(names);
        } catch (error) {
          console.error('Error fetching item names:', error);
        }
      };
  
      fetchItemNames();
    }, [orderNumber]);
  
    return (
      <section className="order-popup">
        <div className="order-popup-content">
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
          <h3 className="popup-title">Order {orderNumber-1}</h3>
          <div className="order-items">
            {itemNames.map((itemName, index) => (
              <div key={index} className="order-item">
                <span>{itemName}</span> {/* Display item name */}
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="complete-button" onClick={onComplete}>
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
