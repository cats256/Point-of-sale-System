import { Button } from "@mui/material";
import { useState } from "react";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [basket, setBasket] = useState([]);

    const buttonWithImg = (text, panel='', img = '', alt = '') => (
        <Button 
            variant="outlined" 
            onClick={() => {
                setPanel(panel || text);
                setActiveButton(text);
            }}
            style={{
                backgroundColor: activeButton === text ? '#C2A061' : '',
                color: activeButton === text ? 'white' : '',
                marginRight: 8,
            }}
        >
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );
// TODO: Separate style out to separate css files
    const Popup = ({ item, onClose }) => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
        }}>
            <div style={{
                padding: '20px',
                background: 'white',
                border: '1px solid black',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Image of the menu item */}
                <img src={item.img} alt={item.alt} style={{ maxWidth: '100%', marginBottom: '10px' }} />
    
                {/* Name of the menu item */}
                <div style={{ marginBottom: '10px' }}>{formatItemName(item)}</div>

                {/* Close and Add to Order buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <button onClick={onClose}>Close</button>
                    <button onClick={() => handleAddToBasket(item)} style={{ backgroundColor: '#C2A061', color: 'white' }}>
                        Add to Basket
                    </button>
                </div>
            </div>
        </div>
    );

    const formatItemName = (item) => {
        let prefix = "";
        const lastChar = item.name[item.name.length - 1];
        if (item.type === "Burgers" || item.name.toUpperCase().includes("gig_em_patty_melt")) {
            if (lastChar === "1") {
                prefix = "BEAN ";
            } else if (lastChar === "0") {
                prefix = "BEEF ";
            }
        } else if (item.name.toUpperCase().includes("fountain_drink")) {
            if (lastChar === "1") {
                prefix = "Large ";
            } else if (lastChar === "0") {
                prefix = "Small ";
            }
        }

        const formattedName = prefix + item.name
            .replace(/_/g, ' ')
            .replace(/[0-9]/g, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .replace('.', '');
    
        return formattedName;
    };
    

    const AssociatedMenuItems = () => {
        let filteredItems = menuItems.filter(item => item.type === panel);
        const [showPopup, setShowPopup] = useState(Boolean);
        const [popupContent, setPopupContent] = useState('');

        const handleItemClick = (itemContent) => {
            setShowPopup(true);
            setPopupContent(itemContent);
        };
    
        return (
            <div>
                {filteredItems.map((item, index) => {
                    let temp = formatItemName(item);
    
                    return (
                        <div key={index}>
                            <Button variant="outlined"  onClick={() => handleItemClick(item)}>
                                {/* <img src={formattedItemName.replace(' ', /_/g)} alt={`Photo of ${formattedItemName}`} style={{ marginRight: 8 }} /> */}
                                {temp} ${item.price}
                            </Button>
                        </div>
                    );
                })}
                {["Burgers", "Baskets", "Sandwiches"].includes(panel) && <div>Make it a combo</div>}
                {showPopup && <Popup item={popupContent} onClose={() => setShowPopup(false)} />}

            </div>
        );
    };
    
    const AddToBasket = () => {
        const totalCost = basket.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);

        return (
            <div>
                {basket.map((item, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <div>{formatItemName(item)}: ${parseFloat(item.price * item.quantity).toFixed(2)}</div>
                        <button onClick={() => decreaseQuantity(item.name)}>-</button>
                        {item.quantity} 
                        <button onClick={() => increaseQuantity(item.name)}>+</button>
                    </div>
                ))}
                <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    Total: ${totalCost.toFixed(2)}
                </div>
            </div>
        );
    };
    
    const handleAddToBasket = (itemToAdd) => {
        setBasket((currentBasket) => {
            const exists = currentBasket.find(item => item.name === itemToAdd.name);
            if (exists) {
                return currentBasket.map(item =>
                    item.name === itemToAdd.name ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...currentBasket, { ...itemToAdd, quantity: 1 }];
            }
        });
    };    

    const increaseQuantity = (itemName) => {
        setBasket(currentBasket =>
            currentBasket.map(item =>
                item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const placeOrder = async (basket) => {
        const apiUrl = 'http://127.0.0.1:5000/submit_order'; // TODO: find correct link
    
        // Ensure basket is iterable
        if (!basket || !Array.isArray(basket)) {
            console.log(basket);
            console.error('Basket is not iterable');
            return;
        }
    
        for (let item of basket) {
            const orderData = {
                name: item.name,
                price: String(item.price * item.quantity),
                date: new Date().toISOString(), 
                assigned_employee: "1" // TODO: currently set to matthew
            };
    
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST', // Using POST as the method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });
    
                if (!response.ok) {
                    // If the response is not ok, throw an error
                    throw new Error(`Failed to place order for ${item.name}`);
                }
    
                // Assuming you want to process the response data
                const responseData = await response.json();
                console.log(`${item.name} order response:`, responseData.message);
            } catch (error) {
                console.error('Error placing order:', error);
                return; // Exit if an error occurs
            }
        }
    
        alert('All orders submitted successfully.');
    };      
    
    
    const decreaseQuantity = (itemName) => {
        setBasket(currentBasket => {
            const itemIndex = currentBasket.findIndex(item => item.name === itemName);
            if (itemIndex === -1) return currentBasket; // Item not found, no changes
    
            const newItem = { ...currentBasket[itemIndex] };
            if (newItem.quantity > 1) {
                newItem.quantity -= 1;
                return [
                    ...currentBasket.slice(0, itemIndex),
                    newItem,
                    ...currentBasket.slice(itemIndex + 1),
                ];
            } else {
                // Only show the confirmation if the quantity is 1
                const confirmRemoval = window.confirm("Do you want to remove this item from your basket?");
                if (confirmRemoval) {
                    return currentBasket.filter((_, index) => index !== itemIndex);
                }
                return currentBasket; // No changes if user cancels
            }
        });
    };    

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {buttonWithImg("Burgers")}
                {buttonWithImg("Baskets")}
                {buttonWithImg("Sandwiches")}
                {buttonWithImg("Drinks")}
                {buttonWithImg("Desserts")}
                {buttonWithImg("Sides")}
                {buttonWithImg("Sauces")}

            </div>

            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 10,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ borderBottom: "2px solid #000", flexGrow: 9 }}>
                    {AssociatedMenuItems()}
                </div>
            </div>

            <div style={{ flexGrow: 3 }}>
                <div>Your Order</div>
                {AddToBasket()}
                <button onClick={() => placeOrder()}>Place Order</button>
            </div>
        </div>
    );
};

export { CustomerView };
