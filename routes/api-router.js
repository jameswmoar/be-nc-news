const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const usersRouter = require("./users-router.js");

apiRouter.route("/")
// .get(sendEndpoints)
.all(sendMethodNotAllowed);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
