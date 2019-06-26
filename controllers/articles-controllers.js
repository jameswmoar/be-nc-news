const {
  fetchArticle,
  updateArticle,
  addComment,
  fetchComments
} = require("../models/articles-models.js");

const sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(inc_votes, article_id)
    .then(updatedArticle => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const newCommentBody = { body };
  newCommentBody.author = username;
  newCommentBody.article_id = article_id;
  addComment(newCommentBody)
    .then(newComment => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

const sendComments = (req, res, next) => {
  const { sort_by, order } = req.query;
  const validOrder = ["asc", "desc"].includes(order);
  if (order && !validOrder) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - invalid order value"
    }).catch(next);
  }
  fetchComments(req.params, sort_by, order)
    .then(comments => res.status(200).send({ comments }))
    .catch(next);
};

module.exports = { sendArticle, patchArticle, sendComments, postComment };
