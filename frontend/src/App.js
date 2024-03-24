import { useState } from "react";
import { ManagerView } from "./components/ManagerView";
import { CashierView } from "./components/CashierView";
import { CustomerView } from "./components/CustomerView";
import { MenuView } from "./components/MenuView";

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
      <button onClick={() => setPanel("manager")}>Manager</button>
      <button onClick={() => setPanel("cashier")}>Cashier</button>
      <button onClick={() => setPanel("customer")}>Customer</button>
      <button onClick={() => setPanel("menu")}>Menu</button>
    </>
  );
}

export default App;
