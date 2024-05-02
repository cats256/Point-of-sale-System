/**
 * Represents a sidebar component for navigation.
 * Provides buttons for navigating to different pages in the manager dashboard.
 * @module Sidebar
 */

import React from "react";
import Button from "@mui/material/Button";

/**
 * A React component representing the sidebar for navigation.
 * @param {Object} props - The component properties.
 * @param {Function} props.setPage - Function to set the currently displayed page.
 * @returns {JSX.Element} The rendered component.
 */
const Sidebar = ({ setPage }) => {
    return (
        <div
            className="sidebar"
            style={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                width: "15vw",
                justifyContent: "space-between",
                minHeight: "100vh",
            }}
        >
            {/* Button for navigating to Employee Information page */}
            <Button
                variant="outlined"
                style={{
                    flexGrow: 1,
                    borderRadius: 0,
                    color: "black",
                    border: "1px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderRightWidth: "1px",
                }}
                onClick={() => setPage("employees")}
            >
                Employee Information
            </Button>
            {/* Button for navigating to Inventory Display page */}
            <Button
                variant="outlined"
                style={{
                    flexGrow: 1,
                    borderRadius: 0,
                    color: "black",
                    border: "1px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderRightWidth: "1px",
                }}
                onClick={() => setPage("inventory")}
            >
                Inventory Display
            </Button>
            {/* Button for navigating to POS Information page */}
            <Button
                variant="outlined"
                style={{
                    flexGrow: 1,
                    borderRadius: 0,
                    color: "black",
                    border: "1px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderRightWidth: "1px",
                }}
                onClick={() => setPage("stats")}
            >
                POS Information
            </Button>
            {/* Button for navigating to Menu page */}
            <Button
                variant="outlined"
                style={{
                    flexGrow: 1,
                    borderRadius: 0,
                    color: "black",
                    border: "1px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderRightWidth: "1px",
                }}
                onClick={() => setPage("menu")}
            >
                Menu
            </Button>
        </div>
    );
};

export default Sidebar;
