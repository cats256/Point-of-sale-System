// Sidebar.js
import React from "react";

const Sidebar = ({ setPage }) => {
    return (
        <div className="sidebar" style={{ position: "fixed", top: 0, left: 0, width: "15%", height: "100vh", padding: "10px"  }} >
            <button onClick={() => setPage("employees")}>
                Employee Information
            </button>
            <button onClick={() => setPage("inventory")}>
                Inventory Display
            </button>
            <button onClick={() => setPage("stats")}>
                POS Information
            </button>
            <button onClick={() => setPage("menu")}>
                Menu
            </button>
        </div>
    );
};

export default Sidebar;
