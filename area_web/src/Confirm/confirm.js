import React from "react";
import { API_URL } from "../utils";
import style from "./../RegisterPage/RegisterPage.module.css";
import LogoAREA from "../assets/Logo_AREA.png";

function getQueryParams() {
    let queryParams = {};
    let queryString = window.location.search.substring(1);
    let queryParamsArray = queryString.split("&");
    for (let i = 0; i < queryParamsArray.length; i++) {
        let pair = queryParamsArray[i].split("=");
        queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(
            pair[1] || ""
        );
    }
    return queryParams;
}

function Confirm() {
    const confirm = () => {
        let params = getQueryParams();
        fetch(API_URL + "/auth/confirm", {
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
                if (
                    data.msg === "ok" ||
                    data.msg === "User already confirmed"
                ) {
                    window.location.href = "/";
                }
            });
    }

    return (
        <div className={style.MainContainerRegisterPage}>
            <div
                style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flexDirection: "column",
                }}
            >
                <img
                    src={LogoAREA}
                    alt="Logo AREA"
                    style={{ width: "60px", height: "auto", margin: "30px" }}
                />
                <span style={{ fontWeight: "bold" }}>
                    Confirm your account
                </span>
                <button
                    className={style.registerButton}
                    onClick={confirm}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default Confirm;
