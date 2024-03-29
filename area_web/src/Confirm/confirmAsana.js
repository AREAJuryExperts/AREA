import React, {useEffect} from "react";
import { API_URL } from "../utils";
import {Redirect, getRedirectUrl} from "./Redirect";

function ConfirmAsana() {
    const getBearerToken = async () => {
        let token = localStorage.getItem("jwt");
        const urlParams = new URLSearchParams(window.location.search);
        try {
            await fetch(API_URL + "/api/asana/register?code=" + urlParams.get('code'), {method : "POST", headers : {"Authorization" : token}})
            try {
                let webhook = await fetch(API_URL + "/api/asana/regsiterWebhook", {method : "POST", headers : {"Authorization" : token}})
                let webhookData = await webhook.json();
                console.log("webhookData ", webhookData);
            } catch(err) {
                console.log(err);
            }
                window.location.href = getRedirectUrl()
            return;
        } catch (err) {
            console.log(err);
            return;
        }
    }
    useEffect(() => {
        getBearerToken();
    }, []);
    return (<Redirect />)
}

export default ConfirmAsana;
