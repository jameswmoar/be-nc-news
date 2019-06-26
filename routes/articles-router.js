const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchArticle,
  sendComments,
  postComment
} = require("../controllers/articles-controllers.js");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchArticle)

  articlesRouter.route('/:article_id/comments').get(sendComments).post(postComment)

module.exports = articlesRouter;
