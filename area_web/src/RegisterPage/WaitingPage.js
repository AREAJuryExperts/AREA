import style from "./RegisterPage.module.css";
import React from 'react';
import { useNavigate } from "react-router-dom";
import LogoAREA from "../assets/Logo_AREA.png";

export default function RegisterWaitingPage() {
    const navigate = useNavigate();

    const accountConfirmed = () => {
        navigate("/");
    }

    return (
        <div className={style.MainContainerRegisterPage}>
            <div style={{width:'100%', height:'100', display:'flex', alignContent:'center', alignItems:'center', textAlign:'center', flexDirection:'column'}}>
                <img src={LogoAREA} alt="Logo AREA" style={{width:'60px', height:'auto', margin:'30px'}} />
                <span style={{fontWeight:'bold'}}>Please check your email to confirm your account.</span>
                <button className={style.registerButton} onClick={accountConfirmed}>Account confirmed</button>
            </div>
        </div>
    );
}
