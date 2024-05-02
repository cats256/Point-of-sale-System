/**
 * Represents a login component using Google's OAuth service.
 * This component provides a Google login button and handles the authentication flow,
 * redirecting to a navigation page upon successful login.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */

import { GoogleLogin } from "@leecheuk/react-google-login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Login() {
    /**
     * State to track if the user is logged in.
     * @type {boolean}
     */
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const navigate = useNavigate();

    /**
     * Handles the success event from GoogleLogin.
     * Stores the user's email in sessionStorage and navigates to '/nav'.
     *
     * @param {Object} res - The response object returned from the GoogleLogin component.
     */

    const onSuccess = (res) => {
        console.log("Login Successful!");
        sessionStorage.setItem("user_email", res.profileObj.email);
        setIsLoggedIn(true);
        navigate("/nav");
    };

    /**
     * Handles the failure event from GoogleLogin.
     * Logs a failure message to the console.
     *
     * @param {Object} res - The response object returned from the GoogleLogin component.
     */

    const onFailure = (res) => {
        console.log("Login Failed!");
    };

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientID}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={false}
            />
        </div>
    );
}

export { Login };
