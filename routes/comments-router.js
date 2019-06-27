const commentsRouter = require("express").Router();
const { patchComment, deleteComment } = require("../controllers/comments-controllers.js");
const { sendMethodNotAllowed } = require("../errors/index.js");

commentsRouter.route("/").all(sendMethodNotAllowed);

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(sendMethodNotAllowed);

module.exports = commentsRouter;
