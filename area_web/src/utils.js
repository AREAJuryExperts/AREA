import DiscordLogo from "./assets/DiscordLogo.png";
import TrelloLogo from "./assets/TrelloLogo.png";
import GithubLogo from "./assets/GithubLogo.png";
import AsanaLogo from "./assets/Asana.png";
import GoogleLogo from "./assets/Google.png";
import info from "./infos.json";

export let API_URL = info.API_URL;

export const IconRouter = (app) => {
    if (app === "Discord") return DiscordLogo;
    if (app === "Trello") return TrelloLogo;
    if (app === "Github") return GithubLogo;
    if (app === "Asana") return AsanaLogo;
    if (app === "Google") return GoogleLogo;
    return null;
};
// export const API_URL = "http://localhost:8080";
// export const API_URL = "https://ckdetori3btxbnfqr5gjnvab4i0sbznl.lambda-url.eu-west-3.on.aws";