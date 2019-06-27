const connection = require("../db/connection.js");

const fetchArticleById = article_id => {
  return connection
    .first("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      } else return article;
    });
};

const updateArticle = (inc_votes, article_id) => {
  return connection
    .first("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([article]) => article);
};

const addComment = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*")
    .then(([newComment]) => newComment);
};

const fetchComments = (article_id, sort_by, order) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      if (comments.length === 0) {
        return fetchArticleById(article_id);
      } else return comments;
    });
};
const fetchArticles = (sort_by, order, author, topic) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*")
    .modify(selector => {
      if (author) {
        selector.where("articles.author", "=", author);
      }
      if (topic) {
        selector.where("articles.topic", "=", topic);
      }
    });
};

const checkExists = (queryValue, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, queryValue)
    .then(row => {
      if (row.length === 0) return false;
      else return true
    });
};

module.exports = {
  fetchArticleById,
  updateArticle,
  addComment,
  fetchComments,
  fetchArticles,
  checkExists
};
