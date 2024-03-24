import { Button } from "@mui/material";
import { useState } from "react";
import { CashierView } from "./components/CashierView/CashierView";
import { CustomerView } from "./components/CustomerView/CustomerView";
import { ManagerView } from "./components/ManagerView/ManagerView";
import { MenuView } from "./components/MenuView/MenuView";

function App() {
    const [panel, setPanel] = useState(null);

    return panel ? (
        (() => {
            switch (panel) {
                case "manager":
                    return <ManagerView />;
                case "cashier":
                    return <CashierView />;
                case "customer":
                    return <CustomerView />;
                case "menu":
                    return <MenuView />;
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
