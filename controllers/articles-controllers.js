const {
  fetchArticleById,
  updateArticle,
  addComment,
  fetchComments,
  fetchArticles,
  checkExists,
  checkIfInteger,
  countArticles,
  countComments,
  addArticle,
  removeArticle,
  removeCommentsByArticle
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
  const { sort_by, order, limit = 10, p } = req.query;
  const validOrder = ["asc", "desc"].includes(order);
  const isInteger = /\d+/;
  if (isInteger.test(article_id) === false) {
    return next({
      status: 400,
      msg: "Bad request - Article ID must be an integer"
    });
  }
  if (limit && isInteger.test(limit) === false) {
    return checkIfInteger(limit, next);
  }
  if (p && isInteger.test(p) === false) {
    return checkIfInteger(p, next);
  }
  if (order && !validOrder) {
    return next({
      status: 400,
      msg: "Bad request - invalid order value"
    });
  }
  countComments(article_id).then(commentCount => {
    const maxPages = Math.ceil(commentCount / limit);
    if (p > maxPages) {
      return next({
        status: 404,
        msg: "Page not found - insufficient articles"
      });
    } else {
      fetchComments(article_id, sort_by, order, limit, p)
        .then(comments => {
          if (comments.hasOwnProperty("body")) {
            comments = [];
            res.status(200).send({ comments });
          } else res.status(200).send({ comments });
        })
        .catch(next);
    }
  });
};

const sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit = 10, p } = req.query;
  const validOrder = ["asc", "desc"].includes(order);
  const isInteger = /\d+/;
  if (limit && isInteger.test(limit) === false) {
    return checkIfInteger(limit, next);
  }
  if (p && isInteger.test(p) === false) {
    return checkIfInteger(p, next);
  }
  if (order && !validOrder) {
    return next({
      status: 400,
      msg: "Bad request - invalid order value"
    });
  }
  countArticles(author, topic).then(articleCount => {
    const maxPages = Math.ceil(articleCount / limit);
    if (p > maxPages) {
      return next({
        status: 404,
        msg: "Page not found - insufficient articles"
      });
    } else {
      fetchArticles(sort_by, order, author, topic, limit, p)
        .then(articles => {
          const totalCount = countArticles(author, topic);
          const authorExists = author
            ? checkExists(author, "users", "username")
            : null;
          const topicExists = topic
            ? checkExists(topic, "topics", "slug")
            : null;
          return Promise.all([totalCount, authorExists, topicExists, articles]);
        })
        .then(([totalCount, authorExists, topicExists, articles]) => {
          if (authorExists === false) {
            return Promise.reject({ status: 404, msg: "Author not found" });
          } else if (topicExists === false) {
            return Promise.reject({ status: 404, msg: "Topic not found" });
          } else {
            res.status(200).send({ articles, total_count: totalCount });
          }
        })
        .catch(next);
    }
  });
};

const postArticle = (req, res, next) => {
  const { body } = req;
  addArticle(body, next)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  const isInteger = /\d+/;
  if (isInteger.test(article_id) === false) {
    return checkIfInteger(article_id, next);
  }
  removeCommentsByArticle(article_id).then(deleted => {
    removeArticle(article_id)
      .then(message => {
        res.sendStatus(204);
      })
      .catch(next);
  });
};

module.exports = {
  sendArticleById,
  patchArticle,
  sendComments,
  postComment,
  sendArticles,
  postArticle,
  deleteArticle
};
