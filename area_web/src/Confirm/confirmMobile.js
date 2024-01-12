import React, {useEffect} from "react";

export default function ConfirmMobile() {
    const handleRedirect = () => {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("jwt"))
            localStorage.setItem("jwt", urlParams.get("jwt"));
        localStorage.setItem("isMobile", "true");
        document.location.href = urlParams.get("redirect");
    };

    useEffect(() => {
        handleRedirect();
    }, []);

    return (<></>)
};
