const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");

const { handleCustomErrors } = require("./errors/index.js");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors)

module.exports = app;
