import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { CashierView } from "./components/CashierView/CashierView";
import { CustomerView } from "./components/CustomerView/CustomerView";
import { ManagerView } from "./components/ManagerView/ManagerView";
import { MenuView } from "./components/MenuView/MenuView";
import { getMenuItems } from "./network/api";

function App() {
    const [panel, setPanel] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        getMenuItems().then((data) => {
            setMenuItems(data);
        });
    }, []);

    return panel ? (
        (() => {
            switch (panel) {
                case "manager":
                    return <ManagerView />;
                case "cashier":
                    return <CashierView />;
                case "customer":
                    return <CustomerView  menuItems={menuItems} />;
                case "menu":
                    return <MenuView menuItems={menuItems} />;
                default:
                    return null;
            }
        })()
    ) : (
        <>
            <div>Choose a panel</div>
            <Button variant="outlined" onClick={() => setPanel("manager")}>
                Manager
            </Button>
            <Button variant="outlined" onClick={() => setPanel("cashier")}>
                Cashier
            </Button>
            <Button variant="outlined" onClick={() => setPanel("customer")}>
                Customer
            </Button>
            <Button variant="outlined" onClick={() => setPanel("menu")}>
                Menu
            </Button>
        </>
    );
}

export default App;
