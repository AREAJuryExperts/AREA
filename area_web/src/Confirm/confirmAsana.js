import React, {useEffect} from "react";
import { API_URL } from "../utils";


function ConfirmAsana() {
    const getBearerToken = async () => {
        let token = localStorage.getItem("jwt");
        const urlParams = new URLSearchParams(window.location.search);
        try {
            const res = await fetch(API_URL + "/api/asana/register?code=" + urlParams.get('code'), {method : "POST", headers : {"Authorization" : token}})
            const data = await res.json();
            console.log(data);
            return;
        } catch (err) {
            console.log(err);
            return;
        }
    }
    useEffect(() => {
        getBearerToken();
    }, []);
    return (<></>)
}

export default ConfirmAsana;
