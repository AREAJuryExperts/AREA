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
}

function Confirm() {
    useEffect(() => {
        let params = getQueryParams();
        fetch( API_URL + "/auth/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                checkoutId: params.checkoutId,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "ok" || data.msg === "User already confirmed") {
                    window.location.href = "/";
                }
            });
        
        
    }, []);

    return (<></>)
}

export default Confirm;

