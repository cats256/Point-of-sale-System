import { Pagination, Button, accordionActionsClasses } from "@mui/material";
import { useState, useEffect } from "react";

const CustomerView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    console.log(menuItems);
    const buttonWithImg = (text, panel='', img = '', alt = '') => (
        <Button variant="outlined" onClick={() => setPanel(panel || text)}>
            {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
            {text}
        </Button>
    );

    const formatItemName = (name) => {
        return name.replace(/_/g, ' ').replace(/[0-9]/g, '').trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    
    const associatedMenuItems = () => {
        let filteredItems = menuItems.filter(item => item.type === panel);
    
        return (
            <div>
                {filteredItems.map((item, index) => (
                    <div key={index}>
                        <div>{formatItemName(item.name)}</div>
                    </div>
                ))}
                {["Burgers", "Baskets", "Sandwiches"].includes(panel) && <div>Make it a combo</div>}
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
                <div style={{ borderBottom: "2px solid #000", flexGrow: 10 }}>
                    {associatedMenuItems()}
                </div>
                <Pagination style={{ flexGrow: 1 }} count={10} />
            </div>
            <div style={{ flexGrow: 3 }}>Third Panel</div>
        </div>
    );
};

export { CustomerView };
