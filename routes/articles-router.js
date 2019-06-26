const articlesRouter = require("express").Router();
const {
  sendArticleById,
  patchArticle,
  sendComments,
  postComment,
  sendArticles
} = require("../controllers/articles-controllers.js");
const { sendMethodNotAllowed } = require("../errors/index.js");

articlesRouter.route("/").get(sendArticles).all(sendMethodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticle)
  .all(sendMethodNotAllowed);
  
articlesRouter
  .route("/:article_id/comments")
  .get(sendComments)
  .post(postComment)
  .all(sendMethodNotAllowed);

module.exports = articlesRouter;
