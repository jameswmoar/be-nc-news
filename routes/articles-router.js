const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchArticle,
  postComment
} = require("../controllers/articles-controllers.js");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchArticle)

  articlesRouter.route('/:article_id/comments').post(postComment)

module.exports = articlesRouter;
