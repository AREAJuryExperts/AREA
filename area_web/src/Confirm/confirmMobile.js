import React, {useState, useEffect} from "react";
import {Redirect, getRedirectUrl, url} from "./Redirect";



export default function ConfirmMobile({}) {
    const handleRedirect = () => {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("jwt"))
            localStorage.setItem("jwt", urlParams.get("jwt"));
        localStorage.setItem("isMobile", "true");
        document.location.href = urlParams.get("redirect");
    }
    useEffect(() => {
        handleRedirect();
    }, [])
    return (<></>)
}
