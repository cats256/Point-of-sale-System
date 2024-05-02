/**
 * Represents a logout component using Google's OAuth service.
 * This component provides a logout button and handles the logout flow,
 * clearing the user's session and redirecting to the home page upon successful logout.
 *
 * @component
 * @example
 * return (
 *   <Logout />
 * )
 */

import { GoogleLogout } from "@leecheuk/react-google-login";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Logout() {
    /**
     * State to track if the user is logged in.
     * @type {boolean}
     */

    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const navigate = useNavigate();

    /**
     * Handles the logout event.
     * Clears the user's email from sessionStorage and updates the logged-in state,
     * then navigates to the root page '/'.
     *
     * @param {Object} res - The response object returned from the logout event.
     */

    const onSuccess = (res) => {
        console.log("Logout Successful!");
        sessionStorage.setItem("user_email", "");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div id="signOutButton">
            <Button
                variant="outlined"
                onClick={onSuccess}
                className="logout-button"
            >
                Logout
            </Button>
        </div>
    );
}

export { Logout };
