import { Pagination, Button } from "@mui/material";
import { useState } from "react";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);

    const buttonWithImg = (text, panel='', img = '', alt = '') => (
        <Button variant="outlined" onClick={() => setPanel(panel || text)}>
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );

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
                <div style={{ marginBottom: '10px' }}>{formatItemName(item.name)}</div>
    
                {/* Beef and Bean button options */
                (item.type === "Burgers" || formatItemName(item.name) === "Gig Em Patty Melt") && (
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <button style={{ marginRight: '5px' }}>Beef</button>
                        <button>Bean</button>
                    </div>
                )}  
                {/* Close and Add to Order buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <button onClick={onClose}>Close</button>
                    <button style={{ backgroundColor: '#C2A061', color: 'white' }}>Add to Order</button>
                </div>
            </div>
        </div>
    );

    const formatItemName = (name) => {
        return name.replace(/_/g, ' ').replace(/[0-9]/g, '').split(' ').map(word => 
            (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // TODO: why is this not working??
        ).join(' ').slice(0, -1);
    };

    const AssociatedMenuItems = () => {
        let filteredItems = menuItems.filter(item => item.type === panel);
        let lastItem = "";
        const [showPopup, setShowPopup] = useState(Boolean);
        const [popupContent, setPopupContent] = useState('');
          
        const handleItemClick = (itemContent) => {
            setShowPopup(true);
            setPopupContent(itemContent);
        };
    
        return (
            <div>
                {filteredItems.map((item, index) => {
                    const currItem = formatItemName(item.name);
    
                    if (currItem === lastItem) {
                        return null; 
                    }
    
                    lastItem = currItem;
    
                    return (
                        <div key={index}>
                            <Button variant="outlined"  onClick={() => handleItemClick(item)}>
                                {/* <img src={currItem.replace(' ', /_/g)} alt={`Photo of ${currItem}`} style={{ marginRight: 8 }} /> */}
                                {currItem} ${item.price}
                            </Button>
                        </div>
                    );
                })}
                {["Burgers", "Baskets", "Sandwiches"].includes(panel) && <div>Make it a combo</div>}
                {/* {showPopup && <Popup onClose={() => setShowPopup(false)}>{popupContent}</Popup>} */}
                {showPopup && <Popup item={popupContent} onClose={() => setShowPopup(false)} />}

            </div>
        );
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
                <Pagination style={{ flexGrow: 1 }} count={10} />
            </div>
            <div style={{ flexGrow: 3 }}>Third Panel</div>
        </div>
    );
};

export { CustomerView };
