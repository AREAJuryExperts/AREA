const dotenv = require("dotenv");
const path = require("path");
var dynamo = require("./DB");
const cors = require("cors");
const express = require("express");


dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();


dynamo.connect(() => {
    app.use(
        cors({
            origin: "*",
        })
    );
    app.options('*', cors());
    app.use(express.json());

    app.get("/about", require("./src/about"));

    app.use("/auth", require("./src/Auth"));
    app.use("/api/", require("./src/NoAuth"));
    app.use("/api/", require("./src/Middlewares/CheckToken"));
    app.use("/api/", require("./src/Middlewares/CheckConfirm"));

    app.use("/api/", require("./src/Services"));
    app.use("/api/", require("./src/Area"));

    module.exports = app;
});
