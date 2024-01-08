import style from "./LoginPage.module.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import LogoAREA from "../assets/Logo_AREA.png";
import TextField from '@mui/material/TextField';
import { API_URL, IconRouter } from "../utils";


function TextsFields({ email, setEmail, password, setPassword }) {
    return (
        <div className={style.textFieldsContainer}>
            <div className={style.textFieldContainer}>
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    className={style.inputTextField}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={style.textFieldContainer}>
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    className={style.inputTextField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
    );
}



export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [authTypes, setAuthTypes] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch(API_URL + "/api/services")
        .then((response) => response.json())
        .then((data) => {
            let tmp = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].loginUrl) {
                    let icon = IconRouter(data[i].app);
                    data[i].icon = icon;
                    tmp.push(data[i]);
                }
            }
            setAuthTypes(tmp);
        })
    }, []);

    const handleLogin = () => {
        let params = (new URL(document.location)).searchParams;
        let redirect_uri = params.get("redirect");

        fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === "ok") {
                    localStorage.setItem("jwt", data.jwt); 
                    if (redirect_uri)
                        window.location.href = redirect_uri;
                    else
                        window.location.href = "/"
                } else if (data.msg === "User not confirmed") {
                    setErrorMessage("Veuillez confirmer votre compte");
                } else if (data.msg === "Invalid credentials") {
                    setErrorMessage("Utilisateur inconnu ou mot de passe incorrect");
                } else {
                    setErrorMessage("Erreur lors de la connexion au serveur");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleNotRegistered = () => {
        navigate("/register");
    }

    const handleForgottenPassword = () => {
        console.log("pwd forgotten");
    }

    return (
        <div className={style.MainContainerLoginPage}>
            <img src={LogoAREA} alt="Logo AREA" className={style.logoLoginPage} />
            <TextsFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
            <span style={{color:'red'}}>{errorMessage}</span>
            <div className={style.forgottenPasswordButtonContainer}>
                <button onClick={handleForgottenPassword} className={style.forgottenPasswordButton}>Forgot password ?</button>
            </div>
            <button className={style.loginButton} onClick={handleLogin}>Login</button>
            <div className={style.notRegisteredButtonContainer}>
                <button onClick={handleNotRegistered} className={style.notRegisteredButton}>Not registered for the moment</button>
            </div>
            <div className={style.otherAuth} >
                {authTypes.map((authType, index) =>
                    <div className={style.appButton} onClick={() => {window.location.href = authType.loginUrl}}>
                        <img src={authType.icon} className={style.appLogo} alt={authType.app} />
                    </div>
                )}
            </div>
        </div>
    );
}
