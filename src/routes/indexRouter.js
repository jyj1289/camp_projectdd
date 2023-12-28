    const express = require("express");
    const app = express();
    const {router, authenticateUser} = require("./auth");
    const score = require("./score")

    app.use("/auth", router);
    app.use("/score", score)

    module.exports = app;