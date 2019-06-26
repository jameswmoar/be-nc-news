const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      const topicsInsertions = connection("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = connection("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]).then(() => {
        const formattedArticles = formatDate(articleData);
        return connection("articles")
          .insert(formattedArticles)
          .returning("*")
          .then(articleRows => {
            const articleRef = makeRefObj(articleRows, "title", "article_id");
            const formattedComments = formatComments(commentData, articleRef);
            return connection("comments").insert(formattedComments);
          });
      });
    });
};
