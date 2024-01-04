const mobileUrl = "exp://10.137.158.163:8081"

export default function Redirect({})
{
    if (localStorage.getItem("isMobile") !== "true")
        return (<></>)
    else
        return (<button onClick={() => localStorage.removeItem("isMobile")}><a href={mobileUrl + "?jwt=" + localStorage.getItem("jwt")}>OPEN MOBILE</a></button>)
}