import { GoogleLogout } from "@leecheuk/react-google-login";

const clientID = "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Logout() {

    const onSuccess = (res) => {
        console.log("Logout Successful!");
    }

    return(
        <div id="signOutButton">
            <GoogleLogout
                    clientId={clientID}
                    buttonText="Logout"
                    onSuccess={onSuccess}
                /> 
        </div>
    )
}

export {Logout};