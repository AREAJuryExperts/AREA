import React, {useEffect} from "react";
import { API_URL } from "../utils";
import {Redirect, getRedirectUrl} from "./Redirect";

function getTokenFromUrl() {
    let hash = window.location.hash.substring(1);
    let params = new URLSearchParams(hash);
    return params.get('token');
}

function ConfirmTrello() {
    useEffect(() => {
        let token = getTokenFromUrl();
        fetch(API_URL + "/api/trello/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                token: token,
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

export default ConfirmTrello;
