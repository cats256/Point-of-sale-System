// Sidebar.js
import { Button } from "@mui/material";
import React from "react";

const Sidebar = ({ setPage }) => {
    return (
        <div className="sidebar">
            <Button
                variant="outlined"
                style={{
                    flexGrow: 1,
                    borderRadius: 0,
                    color: "black",
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
                }}
                onClick={() => setPage("stats")}
            >
                POS Information
            </Button>
        </div>
    );
};

export default Sidebar;
