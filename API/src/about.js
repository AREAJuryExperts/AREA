const db = require("./../DB");

const about = async (req, res) => {
    let services = JSON.parse(JSON.stringify(db.services()));

    services.forEach((service) => {
        service.name = service.app;
        delete service.app;
        delete service.icon;
        delete service.authUrl;
        service.actions.forEach((action) => {
            action.name = action.displayName;
            delete action.displayName;
            delete action.code;
        });
        service.reactions.forEach((reaction) => {
            reaction.name = reaction.displayName;
            delete reaction.displayName;
            delete reaction.code;
        });
    });

    let out = {
        client: {
            host: process.env.WEB_URL,
        },
        server: {
            current_time: Math.floor(Date.now() / 1000),
            services: services,
        },
    };
    res.send(out);
};


module.exports = about;