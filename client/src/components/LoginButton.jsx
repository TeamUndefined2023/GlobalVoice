import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/loginbutton.css';
const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  
    return (
        <div class="login-container">
           <h1>LOGIN</h1>
            <p>Welcome to our application. Please log in to continue.</p>
            <button className="login-button" onClick={() => loginWithRedirect()}>Log in with Auth0</button>
        </div>
    );
};

export default LoginButton;
