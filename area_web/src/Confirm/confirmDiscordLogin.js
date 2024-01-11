import { Redirect, getRedirectUrl } from "./Redirect";
import React, {useEffect} from "react";
import { API_URL } from "../utils";

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

function ConfirmDiscordLogin() {
    useEffect(() => {
        let query = getQueryParams();
        let code = query.code;
        fetch( API_URL + "/api/discord/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code : code
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "ok") {
                    localStorage.setItem("jwt", data.jwt);
                    window.location.href = getRedirectUrl();
                    return
                }
                if (data.msg === "Invalid code") {
                    window.location.href = getRedirectUrl() === "/" ? "/login" : getRedirectUrl();
                }
            });
    }, []);

    return (<Redirect />)
}

export default ConfirmDiscordLogin;
