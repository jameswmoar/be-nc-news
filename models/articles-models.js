const connection = require("../db/connection.js");

const fetchArticle = article_id => {
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
    .where("articles.article_id", "=", article_id)
    .then(article => {
      article.votes += inc_votes;
      return article;
    });
};

const addComment = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*")
    .then(([newComment]) => newComment);
};

module.exports = { fetchArticle, updateArticle, addComment };
