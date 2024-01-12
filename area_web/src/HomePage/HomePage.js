import style from "./HomePage.module.css";
import React, {useEffect} from "react";
import Topbar from "../Topbar/Topbar";
import HorizontalList from "../HorizontalList/HorizontalList";
import AddArea from "../AddArea/AddArea";
import { API_URL } from "../utils";

export default function Home() {
    useEffect(() => {
        fetch(API_URL + "/api/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt"),
            },
        })
            .then((response) => response.json())
            .then(async (data) => {
                if (data.msg === "ok")
                    window.user = data.data;
                if (data.msg === "Invalid Token" || data.msg === "No Token" )
                    window.location.href = "/login";
                if (data.msg === "User not confirmed")
                    window.location.href = "/waitingConfirmation";
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className={style.MainContainerHomePage}>
            <Topbar />
            <div className={style.horizontalListContainer}>
                <HorizontalList />
            </div>
            <AddArea />
        </div>
    );
};
