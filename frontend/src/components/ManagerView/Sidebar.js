// Sidebar.js
import React from "react";
import Button from "@mui/material/Button";

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
