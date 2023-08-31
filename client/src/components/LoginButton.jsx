import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/loginbutton.css';
const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  
    return (
        <div className="loginbtn">
            <button className="login-button" onClick={() => loginWithRedirect()}>Login</button>
        </div>
    );
};

export default LoginButton;
