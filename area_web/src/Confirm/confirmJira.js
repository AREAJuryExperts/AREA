import { API_URL } from "../utils";
import React, {useEffect} from 'react';


export default function ConfirmJira({})
{
    const getBearerToken = async () => {
        let token = localStorage.getItem("jwt");
        const urlParams = new URLSearchParams(window.location.search);
        try {
            let res = await fetch(API_URL + "/api/jira/register?code=" + urlParams.get('code'), {method : "POST", headers : {"Authorization" : token}})
            let data = await res.json();
            window.location.href = "/";
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