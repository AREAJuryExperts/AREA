import { MOBILE_HREF } from "../utils"

export const url = MOBILE_HREF;

export const getRedirectUrl = () => {
    if (localStorage.getItem("isMobile") !== "true")
        return ("/")
    localStorage.removeItem("isMobile")
    let urlSearchParams = new URLSearchParams({jwt : localStorage.getItem("jwt")})
    return url + "?" + urlSearchParams.toString()
}

export function Redirect({}) {
    const setHref = () => {
        document.location.href = url + "?jwt=" + localStorage.getItem("jwt");        
    }
    if (localStorage.getItem("isMobile") !== "true")
        return (<></>)
    else
        return (<button style={{position : 'absolute', top : '50%', left : '50%', borderRadius : 25, backgroundColor : 
    'blue', borderColor : 'blue', color : 'white', width : '50%', height : '12%', fontSize : 20, transform : 'translate(-50%, -50%)',
    boxShadow : '4px 4px 4px 1px rgba(0,0,0,0.50)'}}
    onClick={() => {setHref();localStorage.removeItem("isMobile")}}>OPEN MOBILE</button>)
};
