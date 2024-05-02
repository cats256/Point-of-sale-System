/**
 * Represents a manager dashboard view component.
 * Displays a sidebar for navigation and content area for different pages such as
 * Employees, Inventory, Statistics, and Menu.
 * @module ManagerView
 */

import React, { useState } from "react";
import "./Manager.css"; // Assuming you have CSS for styling

import Sidebar from "./Sidebar";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import StatsPage from "./pages/StatsPage";
import MenuPage from "./pages/MenuPage";
// Use named export export { component_name } instead of export default, makes it easier when changing component's name

/**
 * A React component representing the manager dashboard view.
 * @returns {JSX.Element} The rendered component.
 */
const ManagerView = () => {
    const [page, setPage] = useState("employees"); // Default page is employees

    return (
        <div className="app">
            <Sidebar setPage={setPage} />
            <div className="content">
                {page === "employees" && <EmployeesPage />}
                {page === "inventory" && <InventoryPage />}
                {page === "stats" && <StatsPage />}
                {page === "menu" && <MenuPage />}
            </div>
        </div>
    );
};

export { ManagerView };
