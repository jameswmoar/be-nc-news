const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const cors = require('cors')

const {
  handleCustomErrors,
  handleSQLErrors,
  handleServerError,
  sendMethodNotAllowed
} = require("./errors/index.js");

app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  next({ status: 404, msg: "Page not found" });
});

app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use(sendMethodNotAllowed);
app.use(handleServerError);

module.exports = app;
