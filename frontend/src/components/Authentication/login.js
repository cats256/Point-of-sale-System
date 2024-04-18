import { GoogleLogin } from "@leecheuk/react-google-login";

const clientID = "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Login() {

    const onSuccess = (res) => {
        console.log("Login Successful!");
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
                    isSignedIn={true}
                /> 
        </div>
    )
}

export {Login};