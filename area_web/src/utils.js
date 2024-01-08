import DiscordLogo from "./assets/DiscordLogo.png";
import TrelloLogo from "./assets/TrelloLogo.png";
import GithubLogo from "./assets/GithubLogo.png";
import AsanaLogo from "./assets/Asana.png";
import GoogleLogo from "./assets/Google.png";
import JiraLogo from "./assets/Jira.png";
import info from "./infos.json";

export let API_URL = info.API_URL;

export const IconRouter = (app) => {
    if (app === "Discord") return DiscordLogo;
    if (app === "Trello") return TrelloLogo;
    if (app === "Github") return GithubLogo;
    if (app === "Asana") return AsanaLogo;
    if (app === "Google") return GoogleLogo;
    if (app === "Jira") return JiraLogo;
    return null;
};
