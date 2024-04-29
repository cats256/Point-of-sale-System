import { Button } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { CashierView } from "../CashierView/CashierView";
import { CustomerView } from "../CustomerView/CustomerView";
import { ManagerView } from "../ManagerView/ManagerView";
import { MenuView } from "../MenuView/MenuView";
import { Logout } from "./logout";
import { getLanguages, getMenuItems } from "../../network/api";
import { useVisualCrossing } from "react-open-weather";
import { useLocation } from "react-router-dom";
import { gapi } from "gapi-script";
import { Login } from "./login";

const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Nav({ languages, setCurrLanguage, currLanguage }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const location = useLocation();
    sessionStorage.setItem("user_email", "");

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientID: clientID,
                scope: "",
            });
        }

        gapi.load("client:auth2", start);
    }, []);

    const handleChange = (event) => {
        setCurrLanguage(event.target.value);
    };

    return (
        <div style={{ margin: 10 }}>
            <Link to="/manager">
                <Button variant="outlined">Manager</Button>
            </Link>
            <Link to="/cashier">
                <Button variant="outlined">Cashier</Button>
            </Link>
            <Link to="/customer">
                <Button variant="outlined">Customer</Button>
            </Link>
            <Link to="/menu">
                <Button variant="outlined">Menu</Button>
            </Link>

            <FormControl>
                <InputLabel>Language</InputLabel>
                <Select
                    value={currLanguage}
                    label={currLanguage}
                    onChange={handleChange}
                >
                    {Object.keys(languages).map((currLanguage) => (
                        <MenuItem key={currLanguage} value={currLanguage}>
                            {currLanguage}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Logout />
            <div style={{ display: "none" }}>
                <Login />
            </div>
        </div>
    );
}

export { Nav };
