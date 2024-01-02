import React, {useEffect} from "react";
import { API_URL } from "../utils";

function ConfirmGoogle() {
    useEffect(() => {
        let access_token = window.location.hash.substring(1).split('&')
            .find(param => param.startsWith('access_token='))?.split('=')[1];
        let scope = window.location.hash.substring(1).split('&')
            .find(param => param.startsWith('scope='))?.split('=')[1];

        if (!access_token) return;
        fetch( API_URL + "/api/google/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                access_token: access_token,
                scope: scope
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "ok" || data.msg === "Already connected") {
                    window.location.href = "/";
                } else {
                    let redirect = window.location.href;
                    window.location.href = "/login?redirect=" + redirect;
                }
            });
    }, []);

    return (<></>)
}

export default ConfirmGoogle;