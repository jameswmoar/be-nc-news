const {
  fetchArticleById,
  updateArticle,
  addComment,
  fetchComments,
  fetchArticles,
  checkExists
} = require("../models/articles-models.js");
const { fetchUser } = require("../models/users-model.js");
const { fetchTopicByName } = require("../models/topics-models.js");

const sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(inc_votes, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username | !body) {
    next({
      status: 400,
      msg: "Bad request - username and comment text are both required"
    });
  } else {
    const newCommentBody = { body };
    newCommentBody.author = username;
    newCommentBody.article_id = article_id;
    addComment(newCommentBody)
      .then(comment => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }
};

const sendComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const validOrder = ["asc", "desc"].includes(order);
  if (order && !validOrder) {
    next({
      status: 400,
      msg: "Bad request - invalid order value"
    });
  } else {
    fetchComments(article_id, sort_by, order)
      .then(comments => {
        if (comments.hasOwnProperty("body")) {
          comments = [];
          res.status(200).send({ comments });
        } else res.status(200).send({ comments });
      })
      .catch(next);
  }
};

const sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const validOrder = ["asc", "desc"].includes(order);
  if (order && !validOrder) {
    next({
      status: 400,
      msg: "Bad request - invalid order value"
    });
  } else {
    fetchArticles(sort_by, order, author, topic)
      .then(articles => {
        const authorExists = author
          ? checkExists(author, "users", "username")
          : null;
        const topicExists = topic ? checkExists(topic, "topics", "slug") : null;
        return Promise.all([authorExists, topicExists, articles]);
      })
      .then(([authorExists, topicExists, articles]) => {
        if (authorExists === false) {
          return Promise.reject({ status: 404, msg: "Author not found" });
        } else if (topicExists === false) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        } else {
          res.status(200).send({ articles });
        }
      })
      .catch(next);
  }
};
``;

module.exports = {
  sendArticleById,
  patchArticle,
  sendComments,
  postComment,
  sendArticles
};
