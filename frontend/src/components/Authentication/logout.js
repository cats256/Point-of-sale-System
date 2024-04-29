import { GoogleLogout } from "@leecheuk/react-google-login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientID = "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Logout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const navigate = useNavigate();


    const onSuccess = (res) => {
        console.log("Logout Successful!");
        sessionStorage.setItem("user_email", "");
        setIsLoggedIn(false);
        navigate("/");
    }

    return(
        <div id="signOutButton">
            <button onClick={onSuccess}>Logout</button>
        </div>
    )
}

export {Logout};