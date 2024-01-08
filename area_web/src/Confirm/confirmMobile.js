import React, {useState, useEffect} from "react";
import {Redirect, getRedirectUrl} from "./Redirect";



export default function ConfirmMobile({}) {
    const handleRedirect = () => {
        let urlParams = new URLSearchParams(window.location.search);
        localStorage.setItem("isMobile", "true");
        document.location.href = urlParams.get("redirect");
    }
    useEffect(() => {
        handleRedirect();
    }, [])
    return (<></>)
}
