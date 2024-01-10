import style from "./RegisterPage.module.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LogoAREA from "../assets/Logo_AREA.png";
import TextField from '@mui/material/TextField';
import { API_URL } from "../utils";

function TextsFields({ email, setEmail, firstName, setFirstName, lastName, setLastName, password, setPassword, passwordConfirmation, setPasswordConfirmation }) {
    return (
        <div className={style.textFieldsContainer}>
            <div className={style.textFieldContainer}>
                <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    className={style.inputTextField}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={style.textFieldContainer}>
                <TextField
                    type="text"
                    label="First name"
                    variant="outlined"
                    className={style.inputTextField}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className={style.textFieldContainer}>
                <TextField
                    type="text"
                    label="Last name"
                    variant="outlined"
                    className={style.inputTextField}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className={style.textFieldContainer}>
                <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    className={style.inputTextField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className={style.textFieldContainer}>
                <TextField
                    type="password"
                    label="Password confirmation"
                    variant="outlined"
                    className={style.inputTextField}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
            </div>
        </div>
    );
}

export default function Register() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.msg === "ok") {
                    localStorage.setItem("jwt", data.jwt);
                    navigate("/waitingConfirmation");
                } else if (data.msg === "Email already exists")
                    setErrorMessage("Cet utilisateur a déjà été créé");
                else
                    setErrorMessage("Erreur lors de l'ajout de l'utilisateur");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div className={style.MainContainerRegisterPage}>
            <img src={LogoAREA} alt="Logo AREA" className={style.logoRegisterPage} />
            <TextsFields email={email} setEmail={setEmail} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} password={password} setPassword={setPassword} passwordConfirmation={passwordConfirmation} setPasswordConfirmation={setPasswordConfirmation} />
            <p style={{color:'red'}}>{errorMessage}</p>
            <button className={style.registerButton} onClick={handleRegister}>Register</button>
        </div>
    );
}
