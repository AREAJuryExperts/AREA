import React, {useEffect} from "react";
import { API_URL } from "../utils";
import {Redirect, getRedirectUrl} from "./Redirect";

function getQueryParams() {
    let queryParams = {};
    let queryString = window.location.search.substring(1);
    let queryParamsArray = queryString.split('&');
    for (let i = 0; i < queryParamsArray.length; i++) {
        let pair = queryParamsArray[i].split('=');
        queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return queryParams;
};

function ConfirmDiscord() {
    useEffect(() => {
        let query = getQueryParams();
        let code = query.code;
        fetch( API_URL + "/api/discord/connect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                code : code
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "ok" || data.msg === "Already connected") {
                    window.location.href = getRedirectUrl()
                } if (data.msg == "Discord account already connected") {
                    alert("Discord account already connected")
                    window.location.href = getRedirectUrl()
                } else {
                    let redirect = window.location.href;
                    window.location.href = "/login?redirect=" + redirect;
                }
            });
    }, []);


    return (<Redirect />)
}

export default ConfirmDiscord;
