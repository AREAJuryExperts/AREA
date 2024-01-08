import React, {useEffect} from "react";
import { API_URL } from "../utils";
import {Redirect, getRedirectUrl} from "./Redirect";


function ConfirmGoogle() {
    useEffect(() => {
        let params = (new URL(document.location)).searchParams;
        let code = params.get("code");
        let scope = params.get("scope");

        if (!code) return;
        fetch( API_URL + "/api/google/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                code: code,
                scope: scope
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "ok" || data.msg === "Already connected") {
                    window.location.href = getRedirectUrl()
                } else {
                    let redirect = window.location.href;
                    window.location.href = "/login?redirect=" + redirect;
                }
            });
    }, []);

    return (<Redirect />)
}

export default ConfirmGoogle;