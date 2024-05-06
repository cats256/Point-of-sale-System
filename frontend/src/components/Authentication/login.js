import { GoogleLogin } from "@leecheuk/react-google-login";
import { useNavigate } from "react-router-dom";
import { getPositionFromEmail } from "../../network/api";

const clientID = "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Login() {
    const navigate = useNavigate();

    const onSuccess = async (res) => {
        console.log("Login Successful! as user ", res.profileObj.email);
        try {
            const position = await getPositionFromEmail(res.profileObj.email)
            sessionStorage.setItem("user_position", position.position);
            console.log(position.position);
        } catch (error) {
            console.error("Error fetching position: ", error);
            sessionStorage.setItem("user_position", "");
        }
        navigate("/nav");
    }

    const onFailure = (res) => {
        console.log("Login Failed!");
        sessionStorage.setItem("user_email", "");
    }

    return(
        <div id="signInButton">
            <GoogleLogin
                    style={{ width: '300px', height: '50px', fontSize: '18px' }}
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