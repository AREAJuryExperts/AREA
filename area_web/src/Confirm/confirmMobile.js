import React, {useState, useEffect} from "react";
const mobileUrl = "AREA://"

export default function ConfirmMobile({}) {
    const handleRedirect = () => {
        let urlParams = new URLSearchParams(window.location.search);
        localStorage.setItem("isMobile", "true");
        document.location.href = urlParams.get("redirect");
    }
    useEffect(() => {
        handleRedirect();
    }, [])
    return (<></>)
}

// export default function ConfirmMobile({}) {

//     return (<a href={mobileUrl}>OPEN MOBILE</a>)
// }