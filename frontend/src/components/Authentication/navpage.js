import { Button } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logout } from "./logout";
import { gapi } from "gapi-script";
import { Login } from "./login";
import { ReactComponent as ReveilleLogo } from "../../img/reveille_logo.svg";
import "./navpage.css";


const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Nav({ languages, setCurrLanguage, currLanguage }) {
    const [currentPosition, setCurrentPosition] = useState("");

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientID: clientID,
                scope: "",
            });
        }

        gapi.load("client:auth2", start);
        setCurrentPosition(sessionStorage.getItem("user_position"));
    }, []);

    const handleChange = (event) => {
        setCurrLanguage(event.target.value);
    };

    return (
        <div className="navigation-page">
            <div className="page-header">
                <ReveilleLogo className="logo" />
                <h1>Welcome To Rev's American Grill</h1>
            </div>

            <div className="control-panel">
                <FormControl
                    variant="filled"
                    className="custom-select"
                    style={{}}
                >
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={currLanguage}
                        label="Language"
                        onChange={handleChange}
                    >
                        {Object.keys(languages).map((lang) => (
                            <MenuItem key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Logout />
            </div>

            <div className="nav-container" style={{ margin: 10 }}>
                {currentPosition === "true" && (
                <Link to="/manager">
                    <Button variant="outlined">Manager</Button>
                </Link>
                )}
                {["true", "false"].includes(currentPosition) && (
                <>
                    <Link to="/cashier">
                        <Button variant="outlined">Cashier</Button>
                    </Link>
                </>
                )}
                <Link to="/kiosk">
                    <Button variant="outlined">Kiosk</Button>{" "}
                    {/* New button for Kiosk */}
                </Link>
                <Link to="/menu">
                    <Button variant="outlined">Menu</Button>
                </Link>
                {["true", "false"].includes(currentPosition) && (
                <Link to="/kitchen">
                    <Button variant="outlined">Kitchen</Button>
                </Link>
                )}
            </div>

            <div style={{ display: "none" }}>
                <Login />
            </div>
        </div>
    );
}

export { Nav };
