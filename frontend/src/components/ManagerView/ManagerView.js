import React, { useState } from "react";
import "./Manager.css";

import Sidebar from "./Sidebar";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import StatsPage from "./pages/StatsPage";
// Use named export export { component_name } instead of export default, makes it easier when changing component's name

const ManagerView = () => {
    const [page, setPage] = useState("employees");

    return (
        <div className="manager-view">
            <Sidebar setPage={setPage} />
            <div className="content">
                {page === "employees" && <EmployeesPage />}
                {page === "inventory" && <InventoryPage />}
                {page === "stats" && <StatsPage />}
            </div>
        </div>
    );
};

export { ManagerView };
