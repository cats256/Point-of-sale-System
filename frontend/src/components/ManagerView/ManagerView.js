// Manager.js
import React, { useState } from "react";
import "./Manager.css"; // Assuming you have CSS for styling

import Sidebar from "./Sidebar";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import StatsPage from "./pages/StatsPage";
import MenuPage from "./pages/MenuPage";
import NavBar from "../common/navBar";

// Use named export export { component_name } instead of export default, makes it easier when changing component's name

const ManagerView = () => {
    const [page, setPage] = useState("employees"); // Default page is employees
    const [zoom, setZoom] = useState(100);
    
    const increaseZoom = () => {
        setZoom(zoom + 25);
    };

    const decreaseZoom = () => {
        if (zoom > 100) {
            setZoom(zoom - 25);
        }
    };

    return (
        <main style={{minHeight: '100vh'}}>
            <NavBar
                increaseZoom={increaseZoom}
                decreaseZoom={decreaseZoom}
                zoom={zoom}
            />
            <div className="app">
                <Sidebar setPage={setPage} />
                <div className="content">
                    {page === "employees" && <EmployeesPage />}
                    {page === "inventory" && <InventoryPage />}
                    {page === "stats" && <StatsPage />}
                    {page === "menu" && <MenuPage />}
                </div>
            </div>
        </main>
    );
};

export { ManagerView };
