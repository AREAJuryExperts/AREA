import discord from '../../assets/discord.png';
import trello from '../../assets/trello.png';
import github from '../../assets/github.png';
import jira from '../../assets/jira.png';
import google from '../../assets/google.png';
import asana from '../../assets/asana.png';

const GetImages = (name) => {
    const images = {
        'discord': discord,
        'trello': trello,
        'github': github,
        'jira': jira,
        'google': google,
        'asana': asana,
    }
    return images[name.toLowerCase()];
}

export default GetImages;