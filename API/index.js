const app = require("./app");

app.listen(parseInt(process.env.API_PORT), () => {
    console.log("server running");
});
