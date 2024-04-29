import { GoogleLogin } from "@leecheuk/react-google-login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientID = "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const navigate = useNavigate();

    const onSuccess = (res) => {
        console.log("Login Successful!");
        sessionStorage.setItem("user_email",res.profileObj.email);
        setIsLoggedIn(true);
        navigate("/nav");
    }

    const onFailure = (res) => {
        console.log("Login Failed!");
    }

    return(
        <div id="signInButton">
            <GoogleLogin
                    clientId={clientID}
                    buttonText="Login with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={false}
                /> 
        </div>
    )
}

export {Login};